'use client';

import { Card } from 'antd';
import { DragSourceContainer } from '@/component/DragTable';
import DragDropProvider from '@/component/DndProvider';
import { DroppableTable } from '@/component/DropTable';

export default function DashboardPage() {
  return (
    <Card>
      <DragDropProvider>
        <div className='grid grid-cols-[2fr_4fr] gap-4'>
          {/* Thêm một div bọc để điều khiển vị trí cuộn */}
          <div className='sticky top-4 h-[100vh]'>
            <DragSourceContainer />
          </div>
          <DroppableTable />
        </div>
      </DragDropProvider>
    </Card>
  );
}