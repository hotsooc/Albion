'use client';

import { useEffect, useState } from 'react';
import { DropSpotComponent } from './DropSpot';
import { allItemsData, ItemType } from '@/store/data';
import { Modal } from 'antd';
import { supabase } from '../../lib/supabase/client';

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
 column_F: DroppableSpot[];
 column_G: DroppableSpot[];
};



type AllData = {
 team_1: TeamData;
 team_2: TeamData;
 team_3: TeamData;
};



type DroppableTableProps = {
 teamNames: string[];
 teamKeys: string[];
 openTeamIndex: number;
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
       {/* eslint-disable-next-line @next/next/no-img-element */}
       <img src={item.image} alt='' height={450} width={300} />
      </div>
     )}
     {item.image2 && (
      <div className='flex flex-col text-center border rounded-lg items-center gap-2'>
       <span>Corrupted dungeon</span>
       {/* eslint-disable-next-line @next/next/no-img-element */}
       <img src={item.image2} alt='' height={450} width={300} />
      </div>
     )}
     {item.image3 && (
      <div className='flex flex-col text-center border rounded-lg items-center gap-2'>
       <span>Open World</span>
       {/* eslint-disable-next-line @next/next/no-img-element */}
       <img src={item.image3} alt='' height={450} width={300} />
      </div>
     )}
    </div>
   </div>
  </Modal>
 );
};

const initialData: AllData = {
 team_1: { column_A: Array(5).fill(null), column_B: Array(5).fill(null), column_C: Array(5).fill(null), column_D: Array(5).fill(null), column_E: Array(5).fill(null), column_F: Array(5).fill(null), column_G: Array(5).fill(null) },
 team_2: { column_A: Array(5).fill(null), column_B: Array(5).fill(null), column_C: Array(5).fill(null), column_D: Array(5).fill(null), column_E: Array(5).fill(null), column_F: Array(5).fill(null), column_G: Array(5).fill(null) },
 team_3: { column_A: Array(5).fill(null), column_B: Array(5).fill(null), column_C: Array(5).fill(null), column_D: Array(5).fill(null), column_E: Array(5).fill(null), column_F: Array(5).fill(null), column_G: Array(5).fill(null) },
};

export const DroppableTable = ({ teamKeys, openTeamIndex }: DroppableTableProps) => {
 const [allData, setAllData] = useState<AllData>(initialData);
 const [isLoading, setIsLoading] = useState<boolean>(true);
 const [popupItem, setPopupItem] = useState<DragItem | null>(null);
 const handleItemClick = (item: DroppableSpot) => {
  if (item) {
   setPopupItem(item as DragItem);
  }
 };
 const handleDropItem = (teamKey: keyof AllData, columnKey: keyof TeamData, spotIndex: number, droppedItem: DragItem) => {
  setAllData((prevData) => {
   if (!prevData[teamKey][columnKey] || prevData[teamKey][columnKey][spotIndex] !== null) {
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

   if (!prevData[teamKey][columnKey]) {
    return prevData;
   }
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

 useEffect(() => {
  const fetchAndInsertData = async () => {
   const { data: existingData, error: fetchError } = await supabase
    .from('teams_data')
    .select('*')
    .single();

   if (fetchError && fetchError.code === 'PGRST116') {
    const { data: insertData, error: insertError } = await supabase
     .from('teams_data')
     .insert([{ id: 1, data: initialData }])
     .select('*')
     .single();
    if (insertError) {
     console.error('Error inserting initial data:', insertError);
    } else if (insertData) {
     setAllData(insertData.data as AllData);
    }
   } else if (fetchError) {
    console.error('Error fetching data:', fetchError);
   } else if (existingData) {
    const oldData = existingData.data as AllData;
    const updatedData = { ...initialData };
    if (oldData) {
     Object.keys(oldData).forEach(teamKey => {
      const team = oldData[teamKey as keyof AllData];
      if (team) {
       Object.keys(team).forEach(columnKey => {
        if (updatedData[teamKey as keyof AllData][columnKey as keyof TeamData]) {
         updatedData[teamKey as keyof AllData][columnKey as keyof TeamData] = team[columnKey as keyof TeamData];
        }
       });
      }
     });
    }
    setAllData(updatedData);
   }
   setIsLoading(false);
  };
  fetchAndInsertData();
 }, []);

 useEffect(() => {
  const saveToSupabase = async () => {
   console.log('Đang lưu dữ liệu...');
   const { data, error } = await supabase
    .from('teams_data')
    .update({ data: allData })
    .eq('id', 1);

   if (error) {
    console.error('Lỗi khi lưu dữ liệu:', error.message);
    console.error('Chi tiết lỗi:', error);
   } else {
    console.log('Lưu dữ liệu thành công!', data);
   }
  };

  const timeoutId = setTimeout(() => {
   if (!isLoading) {
    saveToSupabase();
   }
  }, 1000);

  return () => clearTimeout(timeoutId);
 }, [allData, isLoading]);
 const renderColumn = (teamKey: keyof AllData, columnKey: keyof TeamData, title: string, allData: AllData, handleDropItem: (teamKey: keyof AllData, columnKey: keyof TeamData, spotIndex: number, droppedItem: DragItem) => void, handleDeleteItem: (teamKey: keyof AllData, columnKey: keyof TeamData, spotIndex: number) => void, handleItemClick: (item: DroppableSpot) => void) => {

  if (!allData[teamKey][columnKey]) {
    return null;
  }
  return (

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
 };
 const TeamDetails = ({ teamKey, teamData, handleDropItem, handleDeleteItem, handleItemClick }: { teamKey: keyof AllData | null; teamData: AllData; handleDropItem: (teamKey: keyof AllData, columnKey: keyof TeamData, spotIndex: number, droppedItem: DragItem) => void; handleDeleteItem: (teamKey: keyof AllData, columnKey: keyof TeamData, spotIndex: number) => void; handleItemClick: (item: DroppableSpot) => void; }) => {
  if (!teamKey || !teamData) return null;
  return (

   <div className='grid grid-cols-7 gap-4 text-black'>
    {renderColumn(teamKey, 'column_A', 'Tank', teamData, handleDropItem, handleDeleteItem, handleItemClick)}
    {renderColumn(teamKey, 'column_B', 'Sub Tank', teamData, handleDropItem, handleDeleteItem, handleItemClick)}
    {renderColumn(teamKey, 'column_C', 'Flex', teamData, handleDropItem, handleDeleteItem, handleItemClick)}
    {renderColumn(teamKey, 'column_F', 'Cover', teamData, handleDropItem, handleDeleteItem, handleItemClick)}
    {renderColumn(teamKey, 'column_D', 'DPS', teamData, handleDropItem, handleDeleteItem, handleItemClick)}
    {renderColumn(teamKey, 'column_G', 'Sub Dps', teamData, handleDropItem, handleDeleteItem, handleItemClick)}
    {renderColumn(teamKey, 'column_E', 'Heal', teamData, handleDropItem, handleDeleteItem, handleItemClick)}
   </div>
  );
 };
 if (isLoading) {
  return <div className='p-8 text-center text-xl font-bold'>Đang tải dữ liệu...</div>;
 }

 return (
  <div className='flex flex-col gap-4 w-full'>
   <div className='mt-0'>
    <TeamDetails
     teamKey={teamKeys[openTeamIndex] as keyof AllData} 
     teamData={allData}
     handleDropItem={handleDropItem}
     handleDeleteItem={handleDeleteItem}
     handleItemClick={handleItemClick}
    />
   </div>
   {popupItem && <Popup item={popupItem} onClose={() => setPopupItem(null)} />}
  </div>
 );
};