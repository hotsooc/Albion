'use client';

import { useState, useEffect } from 'react';
import { DragSourceContainer } from '@/component/DragTable';
import DragDropProvider from '@/component/DndProvider';
import { DroppableTable } from '@/component/DropTable';
import { TeamSelector } from '@/component/TeamSelector';
import { ButtonChangeColumn } from '@/component/ButtonChangeColumn';
import { motion, Variants } from 'framer-motion';
import { supabase } from '../../../../lib/supabase/client';
import { Database } from '../../../../lib/database.types';
import useTrans from '@/hooks/useTrans';

type TeamsListRow = Database['public']['Tables']['teams_list']['Row'];
type TeamsListInsert = Database['public']['Tables']['teams_list']['Insert'];

const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 2,
      ease: 'easeOut',
      delay: 0.5,
    },
  },
};

export default function TeammatePage() {
  const [openTeamIndex, setOpenTeamIndex] = useState<number>(0);
  const [columnCount, setColumnCount] = useState<number>(7);
  const [teamNames, setTeamNames] = useState<string[]>([]);
  const [teamKeys, setTeamKeys] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const {trans} = useTrans();
  useEffect(() => {
    const fetchTeams = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('teams_list')
        .select('*')
        .eq('id', 1)
        .single();

      if (error && error.code === 'PGRST116') {
        const initialNames = ['Anti heal', 'Balance', 'One shot'];
        const initialKeys = ['team_1', 'team_2', 'team_3'];
        
        const initialData: TeamsListInsert = {
            id: 1,
            team_names: initialNames,
            team_keys: initialKeys
        };

        const { error: insertError } = await supabase
          .from('teams_list')
          .insert(initialData);
        
        if (insertError) {
        }
        
        setTeamNames(initialNames);
        setTeamKeys(initialKeys);
      } else if (data) {
        const teamsData = data as TeamsListRow;
        setTeamNames(teamsData.team_names || []);
        setTeamKeys(teamsData.team_keys || []);
      }
      setIsLoading(false);
    };

    fetchTeams();
  }, []);

  const saveTeamsToSupabase = async (names: string[], keys: string[]) => {
    const { error } = await supabase
      .from('teams_list')
      .update({ team_names: names, team_keys: keys })
      .eq('id', 1);
    if (error) {
    }
  };

  const handleAddTeam = async (name: string) => {
    const newTeamKey = `team_${Date.now()}`;
    const newTeamNames = [...teamNames, name];
    const newTeamKeys = [...teamKeys, newTeamKey];

    setTeamNames(newTeamNames);
    setTeamKeys(newTeamKeys);

    await saveTeamsToSupabase(newTeamNames, newTeamKeys);

    setOpenTeamIndex(newTeamNames.length - 1);
  };

  const handleDeleteTeam = async (index: number) => {
    if (teamNames.length <= 1) {
      alert(trans.teammate.deleteLastError);
      return;
    }
    const isConfirmed = window.confirm(trans.teammate.deleteConfirm.replace('{name}', teamNames[index]));
    if (isConfirmed) {
      const deletedTeamKey = teamKeys[index];
      const newTeamNames = teamNames.filter((_, i) => i !== index);
      const newTeamKeys = teamKeys.filter((_, i) => i !== index);

      const { error: deleteError } = await supabase
        .from('teams_data')
        .update({ data: { [deletedTeamKey]: null } })
        .eq('id', 1);

      if (deleteError) {
      }

      setTeamNames(newTeamNames);
      setTeamKeys(newTeamKeys);

      await saveTeamsToSupabase(newTeamNames, newTeamKeys);

      if (openTeamIndex === index) {
        setOpenTeamIndex(0);
      } else if (openTeamIndex > index) {
        setOpenTeamIndex(openTeamIndex - 1);
      }
    }
  };

  const handleEditTeam = async (index: number, newName: string) => {
    const newTeamNames = [...teamNames];
    newTeamNames[index] = newName;
    setTeamNames(newTeamNames);

    await saveTeamsToSupabase(newTeamNames, teamKeys);
  };

  const handleNextTeam = () => {
    setOpenTeamIndex(prevIndex => (prevIndex + 1) % teamNames.length);
  };

  const handlePrevTeam = () => {
    setOpenTeamIndex(prevIndex => (prevIndex - 1 + teamNames.length) % teamNames.length);
  };

  const handleToggleTeam = (index: number) => {
    setOpenTeamIndex(index);
  };

  if (isLoading) {
    return <div className='p-8 text-center text-xl font-bold'>{trans.loading}</div>;
  }

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={fadeInVariants}
      className='bg-[#E4FFFE] w-auto h-auto p-4 rounded-2xl ml-1 mr-10 shadow-2xl'
    >
      <DragDropProvider>
        <div className='flex'>
          <TeamSelector
            teamNames={teamNames}
            teamKeys={teamKeys}
            openTeamIndex={openTeamIndex}
            handlePrevTeam={handlePrevTeam}
            handleNextTeam={handleNextTeam}
            handleToggleTeam={handleToggleTeam}
            handleAddTeam={handleAddTeam}
            handleDeleteTeam={handleDeleteTeam}
            handleEditTeam={handleEditTeam}
          />
        </div>

        <div className='grid grid-cols-[1fr_5fr] gap-4'>
          <div className='sticky top-4 h-full'>
            <DragSourceContainer />
          </div>
          <div className='flex flex-col gap-4'>
            <DroppableTable
              teamNames={teamNames}
              teamKeys={teamKeys}
              openTeamIndex={openTeamIndex}
              columnCount={columnCount}
            />
          </div>
        </div>

        <div className='flex justify-end items-center mt-5'>
          <ButtonChangeColumn
            setColumnCount={setColumnCount}
            columnCount={columnCount}
          />
        </div>
      </DragDropProvider>
    </motion.section>
  );
}