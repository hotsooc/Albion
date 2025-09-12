'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Button, Form, message, Modal } from 'antd';
import { supabase } from '../../../../lib/supabase/client';
import { LockOutlined, EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'; 
import { User } from '@supabase/supabase-js';

const Profile = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    const [modal, contextHolder] = Modal.useModal();

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            if (user) {
                const full_name = user.user_metadata?.full_name || user.email || '';
                const [firstName, ...lastNameParts] = full_name.split(' ');
                const lastName = lastNameParts.join(' ');
                form.setFieldsValue({ firstName, lastName, email: user.email });
            }
        };
        fetchUser();
    }, [form]);

    const onFinish = async (values: any) => {
        setLoading(true);
        const fullName = `${values.firstName} ${values.lastName}`.trim();
        const { error } = await supabase.auth.updateUser({
            data: {
                full_name: fullName,
            },
        });
        setLoading(false);
        if (error) {
            message.error('Lỗi khi cập nhật hồ sơ: ' + error.message);
        } else {
            message.success('Cập nhật hồ sơ thành công!');
            // window.location.reload(); 
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

    const handleChangeEmail = () => {
        let newEmail = '';
        modal.confirm({
            title: 'Thay đổi Email',
            content: (
                <div>
                    <p>Địa chỉ email hiện tại của bạn là: **{user?.email}**</p>
                    <p>Vui lòng nhập địa chỉ email mới:</p>
                    <Input onChange={(e) => (newEmail = e.target.value)} />
                </div>
            ),
            onOk: async () => {
                if (!newEmail || !/^\S+@\S+\.\S+$/.test(newEmail)) {
                    message.error('Vui lòng nhập một địa chỉ email hợp lệ.');
                    return Promise.reject();
                }
                
                setLoading(true);
                const { error } = await supabase.auth.updateUser({ email: newEmail });
                setLoading(false);

                if (error) {
                    if (error.message.includes('email_address_invalid')) {
                        message.error('Địa chỉ email này đã được sử dụng. Vui lòng thử một địa chỉ khác.');
                    } else {
                        message.error('Lỗi khi đổi email: ' + error.message);
                    }
                    return Promise.reject();
                } else {
                    message.success('Vui lòng kiểm tra email của bạn để xác minh địa chỉ email mới.');
                    // setUser(prev => prev ? {...prev, email: newEmail} : null); 
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
            <div className="bg-[#E4FFFE] p-8 rounded-xl shadow-xl max-w-screen mr-10">
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
                                <Input size="large" /> 
                            </Form.Item>
                            <Form.Item
                                name="lastName"
                                label="Last Name"
                                className="flex-1"
                                rules={[{ required: true, message: 'Please enter your last name!' }]}
                            >
                                <Input size="large" />
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
                              <Button onClick={handleChangeEmail} className="ml-4 !bg-[#97DDD9] !border-none" size="large">Change email</Button>
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