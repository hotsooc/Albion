'use client';

import React, { useState, useEffect } from 'react';
import { Avatar, Button, Card, Col, Row, App, Spin, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { supabase } from '../../../../lib/supabase/client';
import useTrans from '@/hooks/useTrans';

const { Title, Text } = Typography;

type UserProfile = {
    id: string;
    full_name: string | null;
    role: string;
    avatar_url: string | null;
};

const SettingPage = () => {
    const { message } = App.useApp();
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
    const [filter, setFilter] = useState<string>('admin');
    const [loading, setLoading] = useState<boolean>(true);
    const { trans } = useTrans();

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('id, full_name, role, avatar_url');

            if (error) {
                message.error(trans.aboutUs.loadUsersError);
            } else {
                if (data) {
                     setUsers(data as UserProfile[]);
                }
            }
            setLoading(false);
        };

        fetchUsers();
    }, [trans.aboutUs.loadUsersError]);

    const filteredUsers = users.filter(user => user.role === filter);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="p-8 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-[32px] ml-1 mr-6 text-black transition-all duration-300">
            <Row gutter={[24, 24]}>
                {/* Users List Column */}
                <Col xs={24} lg={10}>
                    <Card
                        title={<span className="sora-font font-extrabold text-xl text-black">{trans.aboutUs.manageUsers}</span>}
                        className="shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-2 border-black rounded-[24px] bg-[#fcf8f2] text-black overflow-hidden"
                        styles={{ body: { padding: '16px' } }}
                        extra={
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setFilter('admin');
                                        setSelectedUser(null);
                                    }}
                                    className={`py-1.5 px-4 rounded-full border-2 border-black font-extrabold sora-font text-xs cursor-pointer transition-all duration-200 ${
                                        filter === 'admin' 
                                            ? 'bg-[#ebc7b5] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -translate-y-[1px]' 
                                            : 'bg-white text-black hover:bg-[#fcf8f2] shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px]'
                                    }`}
                                >
                                    {trans.aboutUs.adminLabel}
                                </button>
                                <button
                                    onClick={() => {
                                        setFilter('user');
                                        setSelectedUser(null);
                                    }}
                                    className={`py-1.5 px-4 rounded-full border-2 border-black font-extrabold sora-font text-xs cursor-pointer transition-all duration-200 ${
                                        filter === 'user' 
                                            ? 'bg-[#ebc7b5] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -translate-y-[1px]' 
                                            : 'bg-white text-black hover:bg-[#fcf8f2] shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px]'
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
                                            className={`p-3.5 mb-3.5 cursor-pointer transition-all border-2 border-black rounded-2xl flex items-center gap-4 ${
                                                isSelected 
                                                    ? 'bg-[#ebc7b5] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -translate-y-[1px]' 
                                                    : 'bg-white hover:bg-[#fcf8f2] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px]'
                                            }`}
                                        >
                                            <Avatar size={44} src={user.avatar_url || undefined} icon={<UserOutlined />} className="border border-black flex-shrink-0" />
                                            <span className="font-extrabold text-sm sora-font text-black">{user.full_name}</span>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-gray-500 italic font-medium sora-font">{trans.aboutUs.noUsersFound}</p>
                            )}
                        </div>
                    </Card>
                </Col>
 
                {/* User Details Column */}
                <Col xs={24} lg={14}>
                    <Card
                        title={<span className="sora-font font-extrabold text-xl text-black">{trans.aboutUs.detailInfo}</span>}
                        className="shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-2 border-black rounded-[24px] bg-[#fcf8f2] text-black min-h-[570px] overflow-hidden"
                    >
                        {selectedUser ? (
                            <div className="flex flex-col items-center text-center p-6 border-2 border-black rounded-2xl bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] max-w-md mx-auto my-6">
                                <Avatar 
                                    size={120} 
                                    src={selectedUser.avatar_url || undefined} 
                                    icon={<UserOutlined />}
                                    className="mb-4 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-white" 
                                />
                                <h2 className="text-2xl font-extrabold text-black sora-font tracking-tight mb-1">
                                    {selectedUser.full_name}
                                </h2>
                                <span className="text-sm font-extrabold text-[#2d3748] uppercase tracking-wider bg-white px-3 py-1 border-2 border-black rounded-full shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] mt-2">
                                    {selectedUser.role === 'admin' ? trans.aboutUs.admin : trans.aboutUs.member}
                                </span>
                            </div>
                        ) : (
                            <div className="flex justify-center items-center min-h-[460px] text-[#2d3748] font-bold sora-font">
                                {trans.aboutUs.selectUserPrompt}
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default SettingPage;
