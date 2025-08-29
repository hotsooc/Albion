'use client';

import { useState } from 'react';
import { DropSpotComponent } from './DropSpot';
import { allItemsData, ItemType } from '@/store/data';
import { Modal } from 'antd';
import Image from 'next/image';

type DragItem = {
  id: string;
  name: string;
  detail: string;
  image: string;
  image2: string;
  image3: string;
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

const Popup = ({ item, onClose }: { item: DragItem | null; onClose: () => void }) => {
  if (!item) {
    return null;
  }

  return (
    <Modal
      open={true} 
      footer={null}
      onCancel={onClose}
      centered
      width="max(1200px, 80vh)"
      maskClosable={false}
      zIndex={100}
      destroyOnClose={true}
      title="Thông tin chi tiết"
    >
      <div className='grid grid-cols-[2fr_4fr] gap-8'>
        <div>
          <h2 className='text-xl font-bold mb-4'>Thông tin chi tiết</h2>
          <p className='text-lg'>Tên mục: <span className='font-semibold'>{item.name}</span></p>
          <p className='text-lg'>Detail: <span className='font-semibold'>{item.detail}</span></p>
        </div>
        <div className='flex flex-row gap-4'>
          {item.image && (
            <div className='flex flex-col text-center border rounded-lg items-center gap-2'>
              <span>Hellgate 5v5 (2v2)</span>
              <img src={item.image} alt='' height={450} width={300} />
            </div>
          )}
          {item.image2 && (
            <div className='flex flex-col text-center border rounded-lg items-center gap-2'>
              <span>Corrupted dungeon</span>
              <img src={item.image2} alt='' height={450} width={300} />
            </div>
          )}
          {item.image3 && (
            <div className='flex flex-col text-center border rounded-lg items-center gap-2'>
              <span>Open World</span>
              <img src={item.image3} alt='' height={450} width={300} />
            </div>
          )}
        </div>
      </div>
    </Modal>
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

  const handleItemClick = (item: DroppableSpot) => {
    if (item) {
      setPopupItem(item as DragItem);
    }
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

      const completeItem = allItemsData.find((item: ItemType) => item.id === droppedItem.id);

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