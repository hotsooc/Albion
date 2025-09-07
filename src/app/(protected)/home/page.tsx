import Image from 'next/image'
import React from 'react'

export default function home() {
  return (
    <section className='flex flex-col justify-center items-center h-screen'>
      <div className='flex flex-col text-black text-[50px] font-bold'>Chào mừng mấy thằng nô lệ</div>
      <div className='flex flex-col gap-4 mt-8'>
        <span className='text-black text-[30px] text-center font-bold'>Điển hình của súc vật bị chó đuổi</span>
        <span className='text-black text-[25px] text-center font-bold'>Ví dụ bên dưới</span>
        <div className='flex flex-row gap-4'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/cho_duoi_part2.png" alt='' width={700} height={500} className='rounded-lg' />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/cho_duoi_part1.png" alt='' width={700} height={500} className='rounded-lg' />
        </div>
      </div>
    </section>
  )
}
