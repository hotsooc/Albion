'use client';

import { useState, useEffect } from 'react';
import { Avatar, Card, Col, Row, App } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { supabase } from '../../../../lib/supabase/client';
import useTrans from '@/hooks/useTrans';
import { ListSkeleton } from '@/component/Skeleton';

type UserProfile = {
    id: string;
    full_name: string | null;
    role: string;
    avatar_url: string | null;
};

const AboutUsPage = () => {
    const { message } = App.useApp();
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
    const [filter, setFilter] = useState<string>('admin');
    const [loading, setLoading] = useState<boolean>(true);
    const { trans } = useTrans();

    useEffect(() => {
        setLoading(true);
        supabase
            .from('profiles')
            .select('id, full_name, role, avatar_url')
            .then(({ data, error }) => {
                if (error) {
                    message.error(trans.aboutUs.loadUsersError);
                } else {
                    if (data) {
                         setUsers(data as UserProfile[]);
                    }
                }
                setLoading(false);
            });
    }, [trans.aboutUs.loadUsersError]);

    const filteredUsers = users.filter(user => user.role === filter);

    if (loading) {
        return (
            <div className="p-8">
                <ListSkeleton count={5} />
            </div>
        );
    }

    return (
        <div className="p-8 border-2 border-[var(--border-color)] bg-[var(--bg-panel-solid)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-[32px] mx-1 md:mx-6 text-[var(--text-primary)] transition-all duration-300 theme-transition">
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={10}>
                    <Card
                        title={<span className="sora-font font-extrabold text-xl text-[var(--text-primary)]">{trans.aboutUs.manageUsers}</span>}
                        className="shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-2 border-[var(--border-color)] rounded-[24px] bg-[var(--bg-column)] text-[var(--text-primary)] overflow-hidden"
                        styles={{ body: { padding: '16px' } }}
                        extra={
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setFilter('admin');
                                        setSelectedUser(null);
                                    }}
                                    className={`py-1.5 px-4 rounded-full border-2 border-[var(--border-color)] font-extrabold sora-font text-xs cursor-pointer transition-all duration-200 will-change-transform backface-visibility-hidden ${
                                        filter === 'admin' 
                                            ? 'bg-[var(--color-accent)] text-[var(--text-primary)] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -translate-y-[1px]' 
                                            : 'bg-[var(--bg-panel-solid)] text-[var(--text-primary)] hover:bg-[var(--bg-column)] shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px]'
                                    }`}
                                >
                                    {trans.aboutUs.adminLabel}
                                </button>
                                <button
                                    onClick={() => {
                                        setFilter('user');
                                        setSelectedUser(null);
                                    }}
                                    className={`py-1.5 px-4 rounded-full border-2 border-[var(--border-color)] font-extrabold sora-font text-xs cursor-pointer transition-all duration-200 will-change-transform backface-visibility-hidden ${
                                        filter === 'user' 
                                            ? 'bg-[var(--color-accent)] text-[var(--text-primary)] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -translate-y-[1px]' 
                                            : 'bg-[var(--bg-panel-solid)] text-[var(--text-primary)] hover:bg-[var(--bg-column)] shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px]'
                                    }`}
                                >
                                    {trans.aboutUs.cuDoTribe}
                                </button>
                            </div>
                        }
                    >
                        <div className="max-h-[500px] overflow-y-auto pr-1">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map(user => {
                                    const isSelected = selectedUser?.id === user.id;
                                    return (
                                        <div
                                            key={user.id}
                                            onClick={() => setSelectedUser(user)}
                                            className={`p-3.5 mb-3.5 cursor-pointer transition-all border-2 border-[var(--border-color)] rounded-2xl flex items-center gap-4 will-change-transform backface-visibility-hidden ${
                                                isSelected 
                                                    ? 'bg-[var(--color-accent)] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -translate-y-[1px]' 
                                                    : 'bg-[var(--bg-panel-solid)] hover:bg-[var(--bg-column)] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px]'
                                            }`}
                                        >
                                            <Avatar size={44} src={user.avatar_url || undefined} icon={<UserOutlined />} className="border border-[var(--border-color)] flex-shrink-0" />
                                            <span className="font-extrabold text-sm sora-font text-[var(--text-primary)]">{user.full_name}</span>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-gray-500 italic font-medium sora-font">{trans.aboutUs.noUsersFound}</p>
                            )}
                        </div>
                    </Card>
                </Col>
 
                <Col xs={24} lg={14}>
                    <Card
                        title={<span className="sora-font font-extrabold text-xl text-[var(--text-primary)]">{trans.aboutUs.detailInfo}</span>}
                        className="shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-2 border-[var(--border-color)] rounded-[24px] bg-[var(--bg-column)] text-[var(--text-primary)] min-h-[570px] overflow-hidden"
                    >
                        {selectedUser ? (
                            <div className="flex flex-col items-center text-center p-6 border-2 border-[var(--border-color)] rounded-2xl bg-[var(--bg-panel-solid)] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] max-w-md mx-auto my-6">
                                <Avatar 
                                    size={120} 
                                    src={selectedUser.avatar_url || undefined} 
                                    icon={<UserOutlined />}
                                    className="mb-4 border-2 border-[var(--border-color)] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-[var(--bg-panel-solid)]" 
                                />
                                <h2 className="text-2xl font-extrabold text-[var(--text-primary)] sora-font tracking-tight mb-1">
                                    {selectedUser.full_name}
                                </h2>
                                <span className="text-sm font-extrabold text-[var(--text-secondary)] uppercase tracking-wider bg-[var(--bg-panel-solid)] px-3 py-1 border-2 border-[var(--border-color)] rounded-full shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] mt-2">
                                    {selectedUser.role === 'admin' ? trans.aboutUs.admin : trans.aboutUs.member}
                                </span>
                            </div>
                        ) : (
                            <div className="flex justify-center items-center min-h-[460px] text-[var(--text-secondary)] font-bold sora-font">
                                {trans.aboutUs.selectUserPrompt}
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default AboutUsPage;
