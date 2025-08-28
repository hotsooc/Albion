'use client';

import { Button, Layout, Typography, message } from 'antd';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

const { Header } = Layout;
const { Title } = Typography;

export default function AppHeader({ loggedIn }: { loggedIn: boolean }) {
const router = useRouter();
const pathname = usePathname();

const onLogout = async () => {
    try {
        const res = await fetch('/api/logout', { method: 'POST' });
    if (!res.ok) throw new Error('Logout failed');
        message.success('Đã đăng xuất');
        router.replace('/login');
    } catch (e: any) {
        message.error(e.message || 'Có lỗi khi đăng xuất');
    }
};


const goHome = () => {
    if (loggedIn) router.push('/dashboard');
    else router.push('/login');
};


return (
    <Header style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Title level={4} style={{ color: '#fff', margin: 0, cursor: 'pointer' }} onClick={goHome}>
            My AntD App
        </Title>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            {loggedIn ? (
            <>
            {pathname !== '/dashboard' && (
                <Link href="/dashboard"><Button>Dashboard</Button></Link>
            )}
                <Button type="primary" onClick={onLogout}>Đăng xuất</Button>
            </>
            ) : (
            pathname !== '/login' && (
            <Link href="/login"><Button type="primary">Đăng nhập</Button></Link>
            )
            )}
        </div>
    </Header>
     );
    }