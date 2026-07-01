'use client';

import { useEffect, useState } from 'react';
import { DropSpotComponent } from './DropSpot';
import { ItemType } from '@/store/data';
import { Modal } from 'antd';
import { supabase } from '../../lib/supabase/client';
import useTrans from '@/hooks/useTrans';
type DragItem = {
 id: string;
 name: string;
 detail: string;
 image: string;
 image2: string;
 image3: string;
};

type DroppableSpot = DragItem | null;

// Baloo font removed

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
  const { trans } = useTrans();
  if (!item) return null;
  return (
   <Modal
     open={true}
     footer={null}
     onCancel={onClose}
     centered
     width="max(1000px, 75vh)"
     maskClosable={false}
     zIndex={100}
     destroyOnClose={true}
     className="sircle-modal"
   >
      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_2.8fr] gap-6 text-[var(--text-primary)] p-2">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-extrabold sora-font border-b-2 border-[var(--border-color)] pb-2 mb-2 text-[var(--text-primary)]">
            {trans.aboutUs.detailInfo}
          </h2>
          <div className="flex flex-col gap-2">
            <p className="text-sm">
              <strong className="text-[var(--text-primary)] sora-font">{trans.common.name}:</strong> <br />
              <span className="font-extrabold text-[var(--color-accent)] bg-[var(--text-primary)] dark:text-[var(--color-accent)] dark:bg-[var(--color-accent)]/20 px-3 py-1 rounded-full inline-block mt-1">
                {(trans.items as any)[item.id]?.name || item.name}
              </span>
            </p>
            <p className="text-sm leading-relaxed whitespace-pre-line">
              <strong className="text-[var(--text-primary)] sora-font">{trans.common.detailLabel}</strong> <br />
              {(trans.items as any)[item.id]?.detail || item.detail}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center items-stretch mt-2 md:mt-10">
          {item.image && (
            <div className="flex flex-col text-center border-2 border-[var(--border-color)] rounded-2xl items-center gap-2 p-3 bg-[var(--bg-panel-solid)] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-1">
              <span className="font-bold text-xs sora-font">{trans.build.hellgate}</span>
              <img src={item.image} alt="" className="h-auto max-h-[260px] object-contain rounded-xl border border-gray-100 w-full" />
            </div>
          )}
          {item.image2 && (
            <div className="flex flex-col text-center border-2 border-[var(--border-color)] rounded-2xl items-center gap-2 p-3 bg-[var(--bg-panel-solid)] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-1">
              <span className="font-bold text-xs sora-font">{trans.build.corrupted}</span>
              <img src={item.image2} alt="" className="h-auto max-h-[260px] object-contain rounded-xl border border-gray-100 w-full" />
            </div>
          )}
          {item.image3 && (
            <div className="flex flex-col text-center border-2 border-[var(--border-color)] rounded-2xl items-center gap-2 p-3 bg-[var(--bg-panel-solid)] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-1">
              <span className="font-bold text-xs sora-font">{trans.build.openworld}</span>
              <img src={item.image3} alt="" className="h-auto max-h-[260px] object-contain rounded-xl border border-gray-100 w-full" />
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

export const DroppableTable = ({ teamKeys, teamNames: _teamNames, openTeamIndex, columnCount, builds }: DroppableTableProps & { builds: ItemType[] }) => {
 const [allData, setAllData] = useState<AllData>({});
 const [isLoading, setIsLoading] = useState<boolean>(true);
 const [popupItem, setPopupItem] = useState<DragItem | null>(null);
 const { trans } = useTrans();

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

      const completeItem = builds.find((item: ItemType) => item.id === droppedItem.id);
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

 useEffect(() => {
    const fetchData = () => {
      supabase
        .from('teams_data')
        .select('data')
        .eq('id', 1)
        .single()
        .then(({ data: existingData }) => {
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
        });
    };
    fetchData();
 }, [teamKeys]);

 useEffect(() => {
    const saveToSupabase = () => {
      if (isLoading || Object.keys(allData).length === 0) return;

      const updatePayload = { data: allData };
      
      supabase
        .from('teams_data')
        .update(updatePayload)
        .eq('id', 1)
        .then(({ error }) => {
          if (error) {
          } else {
          }
        });
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
       <div 
         key={`${teamKey}-${columnKey}`} 
         className="flex flex-col p-4 rounded-[24px] gap-3 min-h-[200px] bg-[var(--bg-panel-solid)] border-2 border-[var(--border-color)] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 text-[var(--text-primary)]"
       >
         <h3 className="text-center font-extrabold text-[var(--text-primary)] tracking-tight sora-font text-[15px] border-b border-gray-150 pb-2 mb-1">{title}</h3>
         <div className='flex flex-col gap-2'>
           {Array.from({ length: 5 }).map((_, index) => (
             <div 
               key={`${teamKey}-${columnKey}-${index}`} 
               className='rounded-lg'
             >
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
          <div key={`${teamKey}-${currentViewKey}`} className='grid grid-cols-7 gap-4 text-[var(--text-primary)]'>
            {renderColumn(teamKey, 'column_A', trans.teammate.roles.tank)}
            {renderColumn(teamKey, 'column_B', trans.teammate.roles.subTank)}
            {renderColumn(teamKey, 'column_C', trans.teammate.roles.flex)}
            {renderColumn(teamKey, 'column_F', trans.teammate.roles.cover)}
            {renderColumn(teamKey, 'column_D', trans.teammate.roles.dps)}
            {renderColumn(teamKey, 'column_G', trans.teammate.roles.subDps)}
            {renderColumn(teamKey, 'column_E', trans.teammate.roles.heal)}
          </div>
        );
      case 5:
        return (
          <div key={`${teamKey}-${currentViewKey}`} className='grid grid-cols-5 gap-4 text-[var(--text-primary)]'>
            {renderColumn(teamKey, 'column_A', trans.teammate.roles.tank)}
            {renderColumn(teamKey, 'column_B', trans.teammate.roles.subTank)}
            {renderColumn(teamKey, 'column_C', trans.teammate.roles.flexCover)}
            {renderColumn(teamKey, 'column_D', trans.teammate.roles.dpsSubDps)}
            {renderColumn(teamKey, 'column_E', trans.teammate.roles.heal)}
          </div>
        );
      case 2: 
        return (
          <div key={`${teamKey}-${currentViewKey}`} className='grid grid-cols-2 gap-4 text-[var(--text-primary)]'>
            {renderColumn(teamKey, 'column_A', trans.teammate.roles.player1)}
            {renderColumn(teamKey, 'column_B', trans.teammate.roles.player2)}
          </div>
        );
      default:
        return null;
    }
  };
 if (isLoading || Object.keys(allData).length === 0) {
  return <div className='p-8 text-center text-xl font-bold'>{trans.loading}</div>;
 }
 
 const currentTeamKey = teamKeys[openTeamIndex];
 if (!currentTeamKey || !allData[currentTeamKey]) {
    return <div className='p-8 text-center text-xl font-bold'>{trans.loading}</div>;
 }
 
 return (
   <div className='flex flex-col gap-4 w-full theme-transition'>
   <div className='mt-0'>
    {renderColumnsForView(currentTeamKey)}
   </div>
   {popupItem && <Popup item={popupItem} onClose={() => setPopupItem(null)} />}
  </div>
 );
};
