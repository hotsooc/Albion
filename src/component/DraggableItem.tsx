'use client';

import { useDrag } from 'react-dnd';
import useTrans from '@/hooks/useTrans';


type DragItem = {
  id: string;
  name: string;
};
 
type DraggableItemProps = {
  item: DragItem;
};

export const DraggableItem: React.FC<DraggableItemProps> = ({ item}) => {
  const { trans } = useTrans();

  const [{ isDragging }, drag] = useDrag<DragItem, void, { isDragging: boolean }>(() => ({
    type: 'INPUT_ITEM',
    item: { id: item.id, name: item.name },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return drag(
    <div 
      className={`flex justify-between items-center bg-[var(--bg-panel-solid)] border-2 border-[var(--border-color)] p-2.5 cursor-move rounded-xl mb-1.5 transition-all duration-200 hover:-translate-y-[1px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-[var(--text-primary)] font-bold text-sm will-change-transform backface-visibility-hidden theme-transition ${
        isDragging ? 'opacity-40' : ''
      }`}
    > 
      <span>{(trans.items as any)[item.id]?.name || item.name}</span>
    </div>
  );
};
