'use client';

import { useState } from 'react';
import { DragSourceContainer } from '@/component/DragTable';
import DragDropProvider from '@/component/DndProvider';
import { DroppableTable } from '@/component/DropTable';
import { TeamSelector } from '@/component/TeamSelector';
import { ButtonChangeColumn } from '@/component/ButtonChangeColumn';

const teamNames = ['Anti heal', 'Balance', 'One shot'];
const teamKeys = ['team_1', 'team_2', 'team_3'];

export default function TeammatePage() {
  const [openTeamIndex, setOpenTeamIndex] = useState<number>(0);
  const [columnCount, setColumnCount] = useState<number>(7);

  const handleNextTeam = () => {
    setOpenTeamIndex(prevIndex => (prevIndex + 1) % teamNames.length);
  };

  const handlePrevTeam = () => {
    setOpenTeamIndex(prevIndex => (prevIndex - 1 + teamNames.length) % teamNames.length);
  };

  const handleToggleTeam = (index: number) => {
    setOpenTeamIndex(index);
  };

  return (
    <section className='mt-5 bg-gradient-to-r from-green-100 to-green-50 p-4 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] mx-4'>
      <DragDropProvider>
        <div className='flex mb-4 p-4'>
          <TeamSelector
            teamNames={teamNames}
            openTeamIndex={openTeamIndex}
            handlePrevTeam={handlePrevTeam}
            handleNextTeam={handleNextTeam}
            handleToggleTeam={handleToggleTeam}
            // setColumnCount={setColumnCount}
            // columnCount={columnCount}
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
    </section>
  );
}