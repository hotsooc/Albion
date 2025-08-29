
import { useDrop } from 'react-dnd';
import { Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

type DragItem = {
  id: string;
  name: string;
  detail: string;
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
  const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean }>(() => ({
    accept: 'INPUT_ITEM',
    drop: (droppedItem) => {
      onDropItem(teamKey, columnKey, spotIndex, droppedItem);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const style = {
    border: isOver ? '2px dashed #4096ff' : '1px solid #d9d9d9',
    opacity: isOver && !item ? 0.7 : 1,
  };

  return drop(
    <div
      className='p-2 border border-solid rounded-lg'
      style={style}
    > 
      {item ? (
        <div
          className='flex justify-between items-center bg-[#edebeb] p-2 rounded-lg cursor-pointer'
          onClick={() => {
            if (onItemClick) {
              onItemClick(item);
            }
          }}
        >
          <span>{item.name}</span>
          <Button
            type="text"
            danger
            icon={<CloseOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              onDeleteItem(teamKey, columnKey , spotIndex);
            }}
          />
        </div>
      ) : (
        <div className='flex min-h-[50px] text-center text-black justify-center items-center'>...</div>
      )}
    </div>
  );
};