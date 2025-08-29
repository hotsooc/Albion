'use client';

import { Button, message } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import useScrollThreshold from './useIsScroll';

export default function AppHeader({ loggedIn }: { loggedIn: boolean }) {
const router = useRouter();

const onLogout = async () => {
    try {
        const res = await fetch('/api/logout', { method: 'POST' });
    if (!res.ok) throw new Error('Logout failed');
        message.success('Đã đăng xuất');
        router.replace('/login');
    } catch (e) {
        if (e instanceof Error) {
            message.error(e.message || 'Có lỗi khi đăng xuất');
        } else {
            message.error('Có lỗi khi đăng xuất');
        }
    }
};

const goHome = () => {
    if (loggedIn) router.push('/');
    else router.push('/login');
};
const isScroll = useScrollThreshold(10)

return (
    <section className={clsx("sticky flex flex-row justify-between items-center px-[80px] bg-gradient-to-r from-sky-200 to-green-200 z-10 w-full h-[50px] left-0 top-0 bg-[#FDF6EB] ", isScroll && "transition-all shadow-md")}>
        <div className='text-xl text-shadow ml-[200px] font-bold text-center cursor-pointer' onClick={goHome}>
            Albion - XHCN Guild
        </div>
        <div className='flex items-center gap-2 ml-auto'>
            <>
                <Link href="/teammate"><Button>Xếp Team</Button></Link>
                <Button type="primary" onClick={onLogout}>Đăng xuất</Button>
            </>
        </div>
    </section>
     );
    }