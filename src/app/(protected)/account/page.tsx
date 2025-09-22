'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Button, Form, message, Modal, Avatar, Upload } from 'antd';
import { supabase } from '../../../../lib/supabase/client';
import { LockOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import { User } from '@supabase/supabase-js';

// Khai báo một kiểu dữ liệu mới cho Profile để TypeScript hiểu
type ProfileData = {
    full_name: string | null;
    role: string | null;
    avatar_url: string | null;
};

const Profile = () => {
    // Khai báo kiểu dữ liệu rõ ràng cho các state
    const [loading, setLoading] = useState<boolean>(false);
    const [form] = Form.useForm();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [modal, contextHolder] = Modal.useModal();
    const isDisabled = userRole !== 'admin';
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (user) {
                // Ép kiểu dữ liệu cho profile nhận được từ Supabase
                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('full_name, role, avatar_url')
                    .eq('id', user.id)
                    .single() as { data: ProfileData, error: any };

                if (profile) {
                    setUserRole(profile.role);
                    setAvatarUrl(profile.avatar_url);
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
    
    const handleAvatarUpload = async (info: any) => {
        if (!user) return message.error('Người dùng chưa được xác thực.');
        setLoading(true);
        const file = info.file.originFileObj;
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}.${fileExt}`;
        const filePath = `avatars/${fileName}`;
    
        const { data, error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: true,
            });
    
        if (uploadError) {
            message.error(`Lỗi tải ảnh: ${uploadError.message}`);
            setLoading(false);
            return;
        }
    
        const publicUrl = supabase.storage.from('avatars').getPublicUrl(filePath).data?.publicUrl;
    
        if (publicUrl) {
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', user.id);
    
            if (updateError) {
                message.error(`Lỗi cập nhật hồ sơ: ${updateError.message}`);
            } else {
                setAvatarUrl(publicUrl);
                message.success('Tải ảnh đại diện thành công!');
            }
        } else {
            message.error('Không thể lấy URL ảnh công khai.');
        }
    
        setLoading(false);
    };

    const handleRemoveAvatar = async () => {
        if (!user) return message.error('Người dùng chưa được xác thực.');
        setLoading(true);
        
        // Cần lấy file path từ URL để xóa
        const avatarPath = (avatarUrl as String).split('public/avatars/')[1];
    
        const { error: deleteError } = await supabase.storage
            .from('avatars')
            .remove([avatarPath]);
    
        if (deleteError) {
            message.error(`Lỗi xóa ảnh: ${deleteError.message}`);
            setLoading(false);
            return;
        }
    
        // Xóa URL khỏi bảng profiles
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ avatar_url: null })
            .eq('id', user.id);
    
        if (updateError) {
            message.error(`Lỗi cập nhật hồ sơ: ${updateError.message}`);
        } else {
            setAvatarUrl(null);
            message.success('Đã xóa ảnh đại diện thành công!');
        }
    
        setLoading(false);
    };

    const updateProfile = async (fullName: string) => {
        if (!user) {
            message.error("Người dùng chưa được xác thực.");
            return;
        }

        const { error: profileError } = await supabase
            .from('profiles')
            .update({ full_name: fullName })
            .eq('id', user.id);

        if (profileError) {
            console.error("Lỗi khi cập nhật profiles:", profileError);
            throw new Error(profileError.message);
        }

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
        <div className="bg-gradient-to-br from-[#E4FFFE] to-[#8BDDFB] p-8 rounded-xl shadow-xl max-w-screen ml-1 mr-10">
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
                <div className='flex justify-between items-start mb-0'>
                    <div>
                        <h2 className="text-xl font-bold mb-6 text-gray-800">My Profile</h2>
                        <div className="flex w-[1020px] space-x-4 gap-5">
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
                    <div className="flex flex-rows gap-4 items-center">
                        <Avatar
                            size={120}
                            icon={<UserOutlined />}
                            src={avatarUrl || null}
                            className="bg-[#77BFFA] border-white border-2"
                        />
                        <div className="flex flex-col mt-4 gap-5">
                            <Upload
                                showUploadList={false}
                                onChange={handleAvatarUpload}
                            >
                                <Button icon={<UploadOutlined />} className="!w-[200px] !border-none !bg-[#97DDD9] !h-[46px] !text-[18px] !font-bold !text-black !hover:bg-[#97DDD9]" size="large">Upload</Button>
                            </Upload>
                            <Button
                                danger
                                onClick={handleRemoveAvatar}
                                size="large"
                                disabled={!avatarUrl}
                                className='!text-[18px] !w-[200px]'
                            >
                                Remove
                            </Button>
                        </div>
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