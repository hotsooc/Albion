'use client';

import { useEffect, useState } from 'react';
import { DropSpotComponent } from './DropSpot';
import { allItemsData, ItemType } from '@/store/data';
import { Modal } from 'antd';
import { Database } from '../../lib/database.types';
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
  '7_cols': { [key: string]: DroppableSpot[] };
  '5_cols': { [key: string]: DroppableSpot[] };
  '2_cols': { [key: string]: DroppableSpot[] };
};

type AllData = {
 [key: string]: TeamData;
};

type DroppableTableProps = {
 teamNames: string[];
 teamKeys: string[];
 openTeamIndex: number;
 columnCount: number;
};

const Popup = ({ item, onClose }: { item: DragItem | null; onClose: () => void }) => {
  if (!item) return null;
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

const getInitialTeamData = (): TeamData => ({
  '7_cols': {
    column_A: Array(5).fill(null), column_B: Array(5).fill(null), column_C: Array(5).fill(null),
    column_D: Array(5).fill(null), column_E: Array(5).fill(null), column_F: Array(5).fill(null),
    column_G: Array(5).fill(null)
  },
  '5_cols': {
    column_A: Array(5).fill(null), column_B: Array(5).fill(null), column_C: Array(5).fill(null),
    column_D: Array(5).fill(null), column_E: Array(5).fill(null)
  },
  '2_cols': {
    column_A: Array(5).fill(null), column_B: Array(5).fill(null)
  }
});

type AllDataRow = Database['public']['Tables']['teams_data']['Row'];
type AllDataUpdate = Database['public']['Tables']['teams_data']['Update'];


export const DroppableTable = ({ teamKeys, teamNames, openTeamIndex, columnCount }: DroppableTableProps) => {
 const [allData, setAllData] = useState<AllData>({});
 const [isLoading, setIsLoading] = useState<boolean>(true);
 const [popupItem, setPopupItem] = useState<DragItem | null>(null);

 const handleItemClick = (item: DroppableSpot) => {
  if (item) {
   setPopupItem(item as DragItem);
  }
 };

 const getColumnKey = () => {
    switch(columnCount) {
      case 7: return '7_cols';
      case 5: return '5_cols';
      case 2: return '2_cols';
      default: return '7_cols';
    }
  };

 const handleDropItem = (
    teamKey: string,
    columnKey: string,
    spotIndex: number,
    droppedItem: DragItem
  ) => {
    setAllData((prevData) => {
      const currentViewKey = getColumnKey();
      const currentTeamData = prevData[teamKey]?.[currentViewKey];
      if (!currentTeamData || currentTeamData[columnKey][spotIndex] !== null) {
        return prevData;
      }

      const completeItem = allItemsData.find((item: ItemType) => item.id === droppedItem.id);
      if (!completeItem) {
        return prevData;
      }
      
      const newAllData = JSON.parse(JSON.stringify(prevData));
      newAllData[teamKey][currentViewKey][columnKey][spotIndex] = completeItem;

      return newAllData;
    });
 };

 const handleDeleteItem = (teamKey: string, columnKey: string, spotIndex: number) => {
    setAllData((prevData) => {
      const currentViewKey = getColumnKey();
      const currentTeamData = prevData[teamKey]?.[currentViewKey];
      if (!currentTeamData) {
        return prevData;
      }
      
      const newAllData = JSON.parse(JSON.stringify(prevData));
      newAllData[teamKey][currentViewKey][columnKey][spotIndex] = null;
      
      return newAllData;
    });
 };

 // Sync data from Supabase when component loads and when teamKeys change
 useEffect(() => {
    const fetchData = async () => {
      const { data: existingData, error: fetchError } = await supabase
        .from('teams_data')
        .select('data')
        .eq('id', 1)
        .single();

      const supabaseData = (existingData?.data || {}) as AllData;
      const updatedData: AllData = {};
      
      teamKeys.forEach(key => {
        updatedData[key] = supabaseData[key] || getInitialTeamData();
      });

      Object.keys(supabaseData).forEach(key => {
        if (!teamKeys.includes(key)) {
          delete supabaseData[key];
        }
      });
      
      setAllData(updatedData);
      setIsLoading(false);
    };
    fetchData();
 }, [teamKeys]);

 // Save data to Supabase
 useEffect(() => {
    const saveToSupabase = async () => {
      if (isLoading || Object.keys(allData).length === 0) return;
      console.log('Đang lưu dữ liệu...');

      const updatePayload = { data: allData };
      
      const { error } = await supabase
        .from('teams_data')
        .update(updatePayload)
        .eq('id', 1);

      if (error) {
        console.error('Lỗi khi lưu dữ liệu:', error.message);
      } else {
        console.log('Lưu dữ liệu thành công!');
      }
    };

    const timeoutId = setTimeout(() => {
      saveToSupabase();
    }, 1000);

    return () => clearTimeout(timeoutId);
 }, [allData, isLoading]);

 const renderColumn = (teamKey: string, columnKey: string, title: string) => {
    const currentTeamData = allData[teamKey]?.[getColumnKey()];
    if (!currentTeamData?.[columnKey]) return null;
    return (
      <div key={`${teamKey}-${columnKey}`} className='flex flex-col bg-[#e6f7ff] p-4 rounded-lg gap-2 min-h-[200px]'>
        <h3 className='text-center font-bold text-gray-700'>{title}</h3>
        <div className='flex flex-col gap-2'>
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={`${teamKey}-${columnKey}-${index}`} className='bg-white p-2 rounded-lg'>
              <DropSpotComponent
                teamKey={teamKey}
                columnKey={columnKey}
                spotIndex={index}
                item={currentTeamData[columnKey][index]}
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

 const renderColumnsForView = (teamKey: string) => {
    const currentViewKey = getColumnKey();
    const currentTeamData = allData[teamKey]?.[currentViewKey];
    if (!currentTeamData) return null;
    switch (columnCount) {
      case 7:
        return (
          <div key={`${teamKey}-${currentViewKey}`} className='grid grid-cols-7 gap-4 text-black'>
            {renderColumn(teamKey, 'column_A', 'Tank')}
            {renderColumn(teamKey, 'column_B', 'Sub Tank')}
            {renderColumn(teamKey, 'column_C', 'Flex')}
            {renderColumn(teamKey, 'column_F', 'Cover')}
            {renderColumn(teamKey, 'column_D', 'DPS')}
            {renderColumn(teamKey, 'column_G', 'Sub Dps')}
            {renderColumn(teamKey, 'column_E', 'Heal')}
          </div>
        );
      case 5:
        return (
          <div key={`${teamKey}-${currentViewKey}`} className='grid grid-cols-5 gap-4 text-black'>
            {renderColumn(teamKey, 'column_A', 'Tank')}
            {renderColumn(teamKey, 'column_B', 'Sub Tank')}
            {renderColumn(teamKey, 'column_C', 'Flex (Cover)')}
            {renderColumn(teamKey, 'column_D', 'DPS (Sub DPS)')}
            {renderColumn(teamKey, 'column_E', 'Heal')}
          </div>
        );
      case 2: 
        return (
          <div key={`${teamKey}-${currentViewKey}`} className='grid grid-cols-2 gap-4 text-black'>
            {renderColumn(teamKey, 'column_A', 'Player 1')}
            {renderColumn(teamKey, 'column_B', 'Player 2')}
          </div>
        );
      default:
        return null;
    }
  };
 if (isLoading || Object.keys(allData).length === 0) {
  return <div className='p-8 text-center text-xl font-bold'>Đang tải dữ liệu...</div>;
 }
 
 const currentTeamKey = teamKeys[openTeamIndex];
 if (!currentTeamKey || !allData[currentTeamKey]) {
    return <div className='p-8 text-center text-xl font-bold'>Đang tải dữ liệu...</div>;
 }
 
 return (
  <div className='flex flex-col gap-4 w-full'>
   <div className='mt-0'>
    {renderColumnsForView(currentTeamKey)}
   </div>
   {popupItem && <Popup item={popupItem} onClose={() => setPopupItem(null)} />}
  </div>
 );
};