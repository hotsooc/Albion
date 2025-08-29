'use client';

import { useState } from 'react';
import { DropSpotComponent } from './DropSpot';
import { allItemsData } from '@/store/data';

type DragItem = {
  id: string;
  name: string;
  detail: string;
};

type DroppableSpot = DragItem | null;

type TeamData = {
  column_A: DroppableSpot[];
  column_B: DroppableSpot[];
  column_C: DroppableSpot[];
  column_D: DroppableSpot[];
  column_E: DroppableSpot[];
};

type AllData = {
  team_1: TeamData;
  team_2: TeamData;
  team_3: TeamData;
};

const Popup = ({ item, onClose }: { item: DragItem; onClose: () => void }) => {
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
      <div className='bg-white p-6 rounded-lg shadow-xl text-center'>
        <h2 className='text-xl font-bold mb-4'>Thông tin chi tiết</h2>
        <p className='text-lg'>Tên mục: <span className='font-semibold'>{item.name}</span></p>
        <p className='text-lg'>Detail: <span className='font-semibold'>{item.detail}</span></p>
        <button
          onClick={onClose}
          className='mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

export const DroppableTable = () => {
  const [allData, setAllData] = useState<AllData>({
    team_1: { column_A: Array(5).fill(null), column_B: Array(5).fill(null), column_C: Array(5).fill(null), column_D: Array(5).fill(null), column_E: Array(5).fill(null) },
    team_2: { column_A: Array(5).fill(null), column_B: Array(5).fill(null), column_C: Array(5).fill(null), column_D: Array(5).fill(null), column_E: Array(5).fill(null) },
    team_3: { column_A: Array(5).fill(null), column_B: Array(5).fill(null), column_C: Array(5).fill(null), column_D: Array(5).fill(null), column_E: Array(5).fill(null) },
  });

  const [visibleTeams, setVisibleTeams] = useState({
    team_1: false,
    team_2: false,
    team_3: false,
  });

  const [popupItem, setPopupItem] = useState<DragItem | null>(null);

  const handleItemClick = (item: DragItem) => {
    setPopupItem(item);
  };

  const toggleTeamVisibility = (teamKey: keyof AllData) => {
    setVisibleTeams(prevState => ({
      ...prevState,
      [teamKey]: !prevState[teamKey]
    }));
  };

  const handleDropItem = (teamKey: keyof AllData, columnKey: keyof TeamData, spotIndex: number, droppedItem: DragItem) => {
    setAllData((prevData) => {
      if (prevData[teamKey][columnKey][spotIndex] !== null) {
        return prevData;
      }

      const completeItem = allItemsData.find((item: any) => item.id === droppedItem.id);
      
      if (!completeItem) {
        return prevData;
      }

      const newTeamData = { ...prevData[teamKey] };
      const newColumnData = [...newTeamData[columnKey]];
      
      newColumnData[spotIndex] = completeItem;
      
      return { 
        ...prevData,
        [teamKey]: {
          ...newTeamData,
          [columnKey]: newColumnData,
        },
      };
    });
  };

  const handleDeleteItem = (teamKey: keyof AllData, columnKey: keyof TeamData, spotIndex: number) => {
    setAllData((prevData) => {
      const newTeamData = { ...prevData[teamKey] };
      const newColumnData = [...newTeamData[columnKey]];
      newColumnData[spotIndex] = null;
      return {
        ...prevData,
        [teamKey]: {
          ...newTeamData,
          [columnKey]: newColumnData,
        },
      };
    });
  };

  const renderColumn = (teamKey: keyof AllData, columnKey: keyof TeamData, title: string) => (
    <div className='flex flex-col bg-[#e6f7ff] p-4 rounded-lg gap-2 min-h-[200px]'>
      <h3 className='text-center font-bold text-gray-700'>{title}</h3>
      <div className='flex flex-col gap-2'>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className='bg-white p-2 rounded-lg'>
            <DropSpotComponent
              teamKey={teamKey}
              columnKey={columnKey}
              spotIndex={index}
              item={allData[teamKey][columnKey][index]}
              onDropItem={handleDropItem}
              onDeleteItem={handleDeleteItem}
              onItemClick={handleItemClick}
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderTeam = (teamKey: keyof AllData, teamTitle: string) => (
    <div className='mb-8'>
      <div
        onClick={() => toggleTeamVisibility(teamKey)}
        className='text-center text-2xl font-bold mb-4 cursor-pointer hover:text-blue-600 transition-colors'
      >
        {teamTitle}
      </div>
      {visibleTeams[teamKey] && (
        <div className='grid grid-cols-5 gap-4 text-black'>
          {renderColumn(teamKey, 'column_A', 'Tank')}
          {renderColumn(teamKey, 'column_B', 'Sub Tank')}
          {renderColumn(teamKey, 'column_C', 'Flex (Cover)')}
          {renderColumn(teamKey, 'column_D', 'DPS/Sub DPS')}
          {renderColumn(teamKey, 'column_E', 'Heal')}
        </div>
      )}
    </div>
  );

  return (
    <div className='flex flex-col gap-4 w-full'>
      {renderTeam('team_1', 'Team 1')}
      {renderTeam('team_2', 'Team 2')}
      {renderTeam('team_3', 'Team 3')}
      {popupItem && (
        <Popup item={popupItem} onClose={() => setPopupItem(null)} />
      )} 
    </div>
  );
};