'use client';

import { useDrag } from 'react-dnd';

type DragItem = {
  id: string;
  name: string;
};
 
type DraggableItemProps = {
  item: DragItem;
};

export const DraggableItem: React.FC<DraggableItemProps> = ({ item}) => {
  const [{ isDragging }, drag] = useDrag<DragItem, void, { isDragging: boolean }>(() => ({
    type: 'INPUT_ITEM',
    item: { id: item.id, name: item.name },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return drag(
    <div className='flex justify-between items-center bg-[#f5f5f5] border p-2 cursor-move rounded-lg mb-1'>
      <span>{item.name}</span>
    </div>
  );
};