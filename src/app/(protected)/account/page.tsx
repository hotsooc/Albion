'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Button, Form, message, Modal } from 'antd';
import { supabase } from '../../../../lib/supabase/client';
import { LockOutlined } from '@ant-design/icons';
import { User } from '@supabase/supabase-js';

const Profile = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [modal, contextHolder] = Modal.useModal();
    const isDisabled = userRole !== 'admin';

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (user) {
                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('full_name, role')
                    .eq('id', user.id)
                    .single();

                if (profile) {
                    setUserRole(profile.role);
                    const full_name = profile.full_name || user.email || '';
                    const [firstName, ...lastNameParts] = full_name.split(' ');
                    const lastName = lastNameParts.join(' ');
                    form.setFieldsValue({ firstName, lastName, email: user.email });
                } else {
                    console.error("Error fetching profile:", error);
                    message.error("Lỗi khi lấy thông tin hồ sơ. Vui lòng kiểm tra kết nối hoặc thiết lập profiles.");
                }
            }
        };
        fetchUserData();
    }, [form]);

    const updateProfile = async (fullName: string) => {
        if (!user) {
            message.error("Người dùng chưa được xác thực.");
            return;
        }

        // Cập nhật bảng profiles
        const { error: profileError } = await supabase
            .from('profiles')
            .update({ full_name: fullName })
            .eq('id', user.id);

        if (profileError) {
            console.error("Lỗi khi cập nhật profiles:", profileError);
            throw new Error(profileError.message);
        }

        // Cập nhật metadata của user trong auth.users
        const { error: authError } = await supabase.auth.updateUser({
            data: { full_name: fullName },
        });

        if (authError) {
            console.error("Lỗi khi cập nhật auth.users:", authError);
            throw new Error(authError.message);
        }
    };

    const onFinish = async (values: any) => {
        if (isDisabled) {
            message.error('Bạn không có quyền cập nhật hồ sơ này.');
            return;
        }

        setLoading(true);
        const fullName = `${values.firstName} ${values.lastName}`.trim();
        try {
            await updateProfile(fullName);
            message.success('Cập nhật hồ sơ thành công!');
        } catch (error: any) {
            message.error('Lỗi khi cập nhật hồ sơ: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = () => {
        let newPassword = '';
        modal.confirm({
            title: 'Thay đổi mật khẩu',
            content: (
                <div>
                    <p>Vui lòng nhập mật khẩu mới:</p>
                    <Input.Password onChange={(e) => (newPassword = e.target.value)} />
                </div>
            ),
            onOk: async () => {
                if (!newPassword || newPassword.length < 6) {
                    message.error('Mật khẩu phải có ít nhất 6 ký tự.');
                    return Promise.reject();
                }
                setLoading(true);
                const { error } = await supabase.auth.updateUser({ password: newPassword });
                setLoading(false);

                if (error) {
                    message.error('Lỗi khi đổi mật khẩu: ' + error.message);
                    return Promise.reject();
                } else {
                    message.success('Mật khẩu đã được đổi thành công!');
                }
            },
        });
    };

    const handleDeleteAccount = async () => {
        if (!user || !user.id) {
            message.error('Không tìm thấy người dùng.');
            return;
        }
        modal.confirm({
            title: 'Bạn có chắc chắn muốn xóa tài khoản?',
            content: 'Thao tác này sẽ xóa vĩnh viễn tài khoản của bạn và không thể hoàn tác.',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                setLoading(true);
                try {
                    const { data, error } = await supabase.functions.invoke('delete-user-account', {
                        body: { userIdToDelete: user.id },
                    });
                    if (error) {
                        throw error;
                    }
                    await supabase.auth.signOut();
                    message.success('Tài khoản đã được xóa thành công.');
                    setTimeout(() => {
                        router.push('/login');
                    }, 1000);
                } catch (err: any) {
                    message.error('Lỗi khi xóa tài khoản: ' + err.message);
                } finally {
                    setLoading(false);
                }
            },
        });
    };

    return (
        <div className="bg-[#E4FFFE] p-8 rounded-xl shadow-xl max-w-screen ml-4 mr-10">
            {userRole === 'admin' && (
                <div className="mb-8 p-6 bg-blue-100 border border-blue-400 rounded-lg">
                    <h3 className="text-xl font-bold text-blue-700">Admin Dashboard</h3>
                    <p className="mt-2 text-blue-600">Bạn có quyền truy cập quản trị.</p>
                </div>
            )}
            <Form
                form={form}
                onFinish={onFinish}
                layout="vertical"
                disabled={loading}
                className="space-y-8"
            >
                <div>
                    <h2 className="text-xl font-bold mb-6 text-gray-800">My Profile</h2>
                    <div className="flex !w-[1020px] space-x-4 gap-5">
                        <Form.Item
                            name="firstName"
                            label="First Name"
                            className="flex-1"
                            rules={[{ required: true, message: 'Please enter your first name!' }]}
                        >
                            <Input size="large" disabled={isDisabled} />
                        </Form.Item>
                        <Form.Item
                            name="lastName"
                            label="Last Name"
                            className="flex-1"
                            rules={[{ required: true, message: 'Please enter your last name!' }]}
                        >
                            <Input size="large" disabled={isDisabled} />
                        </Form.Item>
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-700">Account Security</h2>
                    <Form.Item label="Email" className="mb-0">
                        <div className="flex items-center !justify-between !gap-5">
                            <div className='w-[500px]'>
                                <Input
                                    value={user?.email || ''}
                                    readOnly
                                    className="flex-1"
                                    size="large"
                                    suffix={<LockOutlined style={{ color: '#ccc', fontSize: '16px' }} />}
                                />
                            </div>
                        </div>
                    </Form.Item>
                    <Form.Item label="Password" className="mb-0">
                        <div className="flex items-center !justify-between !gap-5">
                            <div className='w-[500px]'>
                                <Input.Password
                                    placeholder="••••••••"
                                    readOnly
                                    className="flex-1"
                                    size="large"
                                    iconRender={() => <LockOutlined style={{ color: '#ccc', fontSize: '16px' }} />}
                                />
                            </div>
                            <Button onClick={handleChangePassword} className="ml-4 !bg-[#97DDD9] !border-none" size="large">Change Password</Button>
                        </div>
                    </Form.Item>
                </div>

                <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-700">Support Access</h2>
                    <div className="flex justify-between items-center bg-white p-5 rounded-md border border-red-400">
                        <div className="space-y-1">
                            <h3 className="text-red-500 font-bold text-lg">Delete my account</h3>
                            <p className="text-sm text-gray-600">Permanently delete the account and remove access from all workspaces.</p>
                        </div>
                        <Button danger onClick={handleDeleteAccount} size="large">Delete Account</Button>
                    </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 gap-5">
                    <Button onClick={() => router.back()} size="large" className='!w-[91px]'>
                        Cancel
                    </Button>
                    <Button type="primary" htmlType="submit" className='!bg-[#97DDD9] !border-none !text-black !w-[91px]' loading={loading} size="large">
                        Save
                    </Button>
                </div>
            </Form>
            {contextHolder}
        </div>
    );
};

export default Profile;