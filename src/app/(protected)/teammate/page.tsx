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
import { GridSkeleton } from '@/component/Skeleton';
import { allItemsData, ItemType } from '@/store/data';

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
  const [builds, setBuilds] = useState<ItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const {trans} = useTrans();
  
  useEffect(() => {
    setIsLoading(true);
    supabase
      .from('teams_list')
      .select('*')
      .eq('id', 1)
      .single()
      .then(({ data: teamData, error: teamError }) => {
        if (teamError && teamError.code === 'PGRST116') {
          const initialNames = ['Anti heal', 'Balance', 'One shot'];
          const initialKeys = ['team_1', 'team_2', 'team_3'];
          const initialData: TeamsListInsert = {
            id: 1,
            team_names: initialNames,
            team_keys: initialKeys
          };
          return supabase
            .from('teams_list')
            .insert(initialData)
            .then(({ error: insertError }) => {
              if (!insertError) {
                setTeamNames(initialNames);
                setTeamKeys(initialKeys);
              }
            });
        } else if (teamData) {
          const teamsData = teamData as TeamsListRow;
          setTeamNames(teamsData.team_names || []);
          setTeamKeys(teamsData.team_keys || []);
        }
      })
      .then(() =>
        supabase
          .from('teams_data')
          .select('data')
          .eq('id', 2)
          .single()
          .then(({ data: buildsData }) => {
            if (buildsData && buildsData.data) {
              const parsed = buildsData.data as { builds: ItemType[] };
              setBuilds(parsed.builds || allItemsData);
            } else {
              setBuilds(allItemsData);
            }
            setIsLoading(false);
          })
      );
  }, []);

  const saveTeamsToSupabase = (names: string[], keys: string[]) => {
    supabase
      .from('teams_list')
      .update({ team_names: names, team_keys: keys })
      .eq('id', 1)
      .then(({ error }) => {
        if (error) {
        }
      });
  };

  const handleAddTeam = (name: string) => {
    const newTeamKey = `team_${Date.now()}`;
    const newTeamNames = [...teamNames, name];
    const newTeamKeys = [...teamKeys, newTeamKey];

    setTeamNames(newTeamNames);
    setTeamKeys(newTeamKeys);

    saveTeamsToSupabase(newTeamNames, newTeamKeys);

    setOpenTeamIndex(newTeamNames.length - 1);
  };

  const handleDeleteTeam = (index: number) => {
    if (teamNames.length <= 1) {
      alert(trans.teammate.deleteLastError);
      return;
    }
    const isConfirmed = window.confirm(trans.teammate.deleteConfirm.replace('{name}', teamNames[index]));
    if (isConfirmed) {
      const deletedTeamKey = teamKeys[index];
      const newTeamNames = teamNames.filter((_, i) => i !== index);
      const newTeamKeys = teamKeys.filter((_, i) => i !== index);

      supabase
        .from('teams_data')
        .update({ data: { [deletedTeamKey]: null } })
        .eq('id', 1)
        .then(({ error: deleteError }) => {
          if (deleteError) {
          }
          setTeamNames(newTeamNames);
          setTeamKeys(newTeamKeys);
          saveTeamsToSupabase(newTeamNames, newTeamKeys);
          if (openTeamIndex === index) {
            setOpenTeamIndex(0);
          } else if (openTeamIndex > index) {
            setOpenTeamIndex(openTeamIndex - 1);
          }
        });
    }
  };

  const handleEditTeam = (index: number, newName: string) => {
    const newTeamNames = [...teamNames];
    newTeamNames[index] = newName;
    setTeamNames(newTeamNames);

    saveTeamsToSupabase(newTeamNames, teamKeys);
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
    return <div className='p-8'><GridSkeleton count={3} /></div>;
  }

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={fadeInVariants}
      className="w-auto h-auto p-4 md:p-6 rounded-[32px] border-2 border-[var(--border-color)] bg-[var(--bg-panel-solid)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mx-1 md:mx-6 transition-all duration-300 text-[var(--text-primary)] theme-transition"
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

        <div className='grid grid-cols-1 lg:grid-cols-[1fr_5fr] gap-4'>
          <div className='sticky top-4 h-full'>
            <DragSourceContainer builds={builds} />
          </div>
          <div className='flex flex-col gap-4'>
            <DroppableTable
              teamNames={teamNames}
              teamKeys={teamKeys}
              openTeamIndex={openTeamIndex}
              columnCount={columnCount}
              builds={builds}
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
