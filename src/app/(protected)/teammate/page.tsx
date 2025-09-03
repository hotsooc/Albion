'use client';

import { Card } from 'antd';
import { DragSourceContainer } from '@/component/DragTable';
import DragDropProvider from '@/component/DndProvider';
import { DroppableTable } from '@/component/DropTable';
import VideoPage from '@/component/Video';

export default function TeammatePage() {
  return (
    <Card>
      <DragDropProvider>
        <div className='grid grid-cols-[2fr_4fr] gap-4'>
          <div className='sticky top-4 h-full'>
            <DragSourceContainer />
          </div>
          <DroppableTable />
        </div>
      </DragDropProvider>
      <div className='flex mt-4'>
        <VideoPage />
      </div>
    </Card>
  );
}