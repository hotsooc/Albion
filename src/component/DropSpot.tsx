import { useDrop } from 'react-dnd';
import { Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import useTrans from '@/hooks/useTrans';

type DragItem = {
  id: string;
  name: string;
  detail: string;
  image: string;
  image2: string;
  image3: string;
};

type DropSpotProps<T, C> = {
  teamKey: T;
  columnKey: C;
  spotIndex: number;
  item: DragItem | null;
  onDropItem: (teamKey: T, columnKey: C, spotIndex: number, droppedItem: DragItem) => void;
  onDeleteItem: (teamKey: T, columnKey: C, spotIndex: number) => void;
  onItemClick?: (item: DragItem) => void;
};

export const DropSpotComponent = <T, C>({ teamKey, columnKey, spotIndex, item, onDropItem, onDeleteItem, onItemClick }: DropSpotProps<T, C>) => {
  const { trans } = useTrans();
  const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean }>(() => ({
    accept: 'INPUT_ITEM',
    drop: (droppedItem) => {
      onDropItem(teamKey, columnKey, spotIndex, droppedItem);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const containerClass = `p-1 border-2 border-dashed rounded-2xl transition-all duration-200 ${
    isOver ? 'border-black bg-[#ebbea7]/30 scale-[1.02]' : 'border-gray-200 bg-transparent'
  }`;

  return drop(
    <div className={containerClass}> 
      {item ? (
        <div
          className="flex justify-between items-center bg-white border-2 border-black p-2 rounded-xl cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px] transition-all duration-200 text-black font-bold text-sm"
          onClick={() => {
            if (onItemClick) {
              onItemClick(item);
            }
          }}
        >
          <span>{(trans.items as any)[item.id]?.name || item.name}</span>
          <Button
            type="text"
            danger
            icon={<CloseOutlined className="text-red-500 font-bold" />}
            onClick={(e) => {
              e.stopPropagation();
              onDeleteItem(teamKey, columnKey , spotIndex);
            }}
            className="hover:bg-red-50 !flex !items-center !justify-center !rounded-full !w-6 !h-6 !p-0"
          />
        </div>
      ) : (
        <div className="flex min-h-[44px] text-center text-[#5d6c7b] font-extrabold justify-center items-center tracking-wider">...</div>
      )}
    </div>
  );
};
