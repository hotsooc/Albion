'use client';

import { useState } from 'react';
import { DragSourceContainer } from '@/component/DragTable';
import DragDropProvider from '@/component/DndProvider';
import { DroppableTable } from '@/component/DropTable';
import { TeamSelector } from '@/component/TeamSelector';
import { ButtonChangeColumn } from '@/component/ButtonChangeColumn';
import { motion, Variants } from 'framer-motion';

const teamNames = ['Anti heal', 'Balance', 'One shot'];
const teamKeys = ['team_1', 'team_2', 'team_3'];

// Hiệu ứng hiện ra chậm hơn
const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 2, // Tăng thời gian lên 2 giây
      ease: 'easeOut',
      delay: 0.5, // Tăng độ trễ một chút để hiệu ứng bắt đầu sau khi trang tải
    },
  },
};

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
    <motion.section
      initial="hidden"
      animate="visible"
      variants={fadeInVariants}
      className='mt-5 bg-[#E4FFFE] w-auto h-auto p-4 rounded-2xl ml-1 mr-10'
    >
      <DragDropProvider>
        <div className='flex mb-4 p-4'>
          <TeamSelector
            teamNames={teamNames}
            openTeamIndex={openTeamIndex}
            handlePrevTeam={handlePrevTeam}
            handleNextTeam={handleNextTeam}
            handleToggleTeam={handleToggleTeam}
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