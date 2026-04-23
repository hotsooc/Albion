'use client';

import React, { useState, useEffect } from 'react';
import { Avatar, Button, Card, Col, Row, message, Spin, Typography } from 'antd';
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
        <div className="p-8 bg-[#E4FFFE] rounded-xl ml-1 mr-10">
            <Row gutter={24}>
                <Col span={10}>
                    <Card
                        title={trans.aboutUs.manageUsers}
                        className="shadow-lg rounded-lg"
                        extra={
                            <div className="flex gap-2">
                                <Button
                                    type={filter === 'admin' ? 'primary' : 'default'}
                                    onClick={() => {
                                        setFilter('admin');
                                        setSelectedUser(null);
                                    }}
                                    className={filter === 'admin' ? '!bg-[#97DDD9]' : ''}
                                >
                                    {trans.aboutUs.adminLabel}
                                </Button>
                                <Button
                                    type={filter === 'user' ? 'primary' : 'default'}
                                    onClick={() => {
                                        setFilter('user');
                                        setSelectedUser(null);
                                    }}
                                    className={filter === 'user' ? '!bg-[#97DDD9]' : ''}
                                >
                                    {trans.aboutUs.cuDoTribe}
                                </Button>
                            </div>
                        }
                    >
                        <div className="max-h-[500px] overflow-y-auto">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map(user => (
                                    <div
                                        key={user.id}
                                        onClick={() => setSelectedUser(user)}
                                        className={`p-4 mb-2 cursor-pointer transition-colors rounded-lg flex items-center gap-4 
                                            ${selectedUser?.id === user.id ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                                    >
                                        <Avatar size={48} src={user.avatar_url || undefined} icon={<UserOutlined />} />
                                        <Text strong>{user.full_name}</Text>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 italic">{trans.aboutUs.noUsersFound}</p>
                            )}
                        </div>
                    </Card>
                </Col>

                <Col span={14}>
                    <Card
                        title={trans.aboutUs.detailInfo}
                        className="shadow-lg rounded-lg min-h-[570px]"
                    >
                        {selectedUser ? (
                            <div className="flex flex-col items-center text-center p-6">
                                <Avatar 
                                    size={150} 
                                    src={selectedUser.avatar_url || undefined} 
                                    icon={<UserOutlined />}
                                    className="mb-4" 
                                />
                                <Title level={2} className="!mb-1">
                                    {selectedUser.full_name}
                                </Title>
                                <Text type="secondary" className="text-lg">
                                    {selectedUser.role === 'admin' ? trans.aboutUs.admin : trans.aboutUs.member}
                                </Text>
                            </div>
                        ) : (
                            <div className="flex justify-center items-center min-h-[500px] text-gray-400 italic">
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
