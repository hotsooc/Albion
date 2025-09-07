'use client';

import VideoPage from '@/component/Video'
import React from 'react'

export default function BuildPage() {
  return (
    <div className='flex mt-4 sticky no-scrollbar overflow-auto w-full'>
        <VideoPage />
    </div>
  )
}
