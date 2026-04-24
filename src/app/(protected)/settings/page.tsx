'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Button, Form, message, Modal, Avatar, Upload } from 'antd';
import { supabase } from '../../../../lib/supabase/client';
import { LockOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import { User } from '@supabase/supabase-js';
import useTrans from '@/hooks/useTrans';

type ProfileData = {
    full_name: string | null;
    role: string | null;
    avatar_url: string | null;
};

const Profile = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [form] = Form.useForm();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [modal, contextHolder] = Modal.useModal();
    const isDisabled = userRole !== 'admin';
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const { trans } = useTrans();

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (user) {
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
                    message.error(trans.settings.fetchProfileError);
                }
            }
        };
        fetchUserData();
    }, [form, trans.settings.fetchProfileError]);
    
   const handleAvatarUpload = async (info: any) => {
    if (!user) {
        message.error(trans.settings.unauthenticatedError);
        return;
    }

    const file = info.file.originFileObj;
    

    setLoading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`; 

    const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true,
        });

    if (uploadError) {
        message.error(`${trans.common.error}: ${uploadError.message}`);
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
            message.error(`Error: ${updateError.message}`);
        } else {
            setAvatarUrl(publicUrl);
            message.success(trans.settings.uploadAvatarSuccess);
        }
    } else {
        message.error(trans.settings.urlError);
    }

    setLoading(false);
};
    const handleRemoveAvatar = async () => {
        if (!user) return message.error(trans.settings.unauthenticatedError);
        setLoading(true);
        
        const avatarPath = (avatarUrl as String).split('public/avatars/')[1];
    
        const { error: deleteError } = await supabase.storage
            .from('avatars')
            .remove([avatarPath]);
    
        if (deleteError) {
            message.error(`Error: ${deleteError.message}`);
            setLoading(false);
            return;
        }
    
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ avatar_url: null })
            .eq('id', user.id);
    
        if (updateError) {
            message.error(`Error: ${updateError.message}`);
        } else {
            setAvatarUrl(null);
            message.success(trans.settings.removeAvatarSuccess);
        }
    
        setLoading(false);
    };

    const updateProfile = async (fullName: string) => {
        if (!user) {
            message.error(trans.settings.unauthenticatedError);
            return;
        }

        const { error: profileError } = await supabase
            .from('profiles')
            .update({ full_name: fullName })
            .eq('id', user.id);

        if (profileError) {
            throw new Error(profileError.message);
        }

        const { error: authError } = await supabase.auth.updateUser({
            data: { full_name: fullName },
        });

        if (authError) {
            throw new Error(authError.message);
        }
    };

    const onFinish = async (values: any) => {
        if (isDisabled) {
            message.error(trans.settings.permissionDenied);
            return;
        }

        setLoading(true);
        const fullName = `${values.firstName} ${values.lastName}`.trim();
        try {
            await updateProfile(fullName);
            message.success(trans.settings.updateProfileSuccess);
        } catch (error: any) {
            message.error('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = () => {
        let newPassword = '';
        modal.confirm({
            title: trans.settings.changePasswordTitle,
            content: (
                <div>
                    <p>{trans.settings.enterNewPassword}</p>
                    <Input.Password onChange={(e) => (newPassword = e.target.value)} />
                </div>
            ),
            onOk: async () => {
                if (!newPassword || newPassword.length < 6) {
                    message.error(trans.settings.passwordLengthError);
                    return Promise.reject();
                }
                setLoading(true);
                const { error } = await supabase.auth.updateUser({ password: newPassword });
                setLoading(false);

                if (error) {
                    message.error('Error: ' + error.message);
                    return Promise.reject();
                } else {
                    message.success(trans.settings.passwordChangeSuccess);
                }
            },
        });
    };

    const handleDeleteAccount = async () => {
        if (!user || !user.id) {
            message.error(trans.settings.userNotFound);
            return;
        }
        modal.confirm({
            title: trans.settings.deleteAccountConfirm,
            content: trans.settings.deleteAccountWarning,
            okText: trans.settings.deleteAccountButton,
            okType: 'danger',
            cancelText: trans.common.cancel,
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
                    message.success(trans.settings.deleteAccountSuccess);
                    setTimeout(() => {
                        router.push('/login');
                    }, 1000);
                } catch (err: any) {
                    message.error('Error: ' + err.message);
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
                    <h3 className="text-xl font-bold text-blue-700">{trans.settings.adminDashboard}</h3>
                    <p className="mt-2 text-blue-600">{trans.settings.adminAccess}</p>
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
                        <h2 className="text-xl font-bold mb-6 text-gray-800">{trans.settings.myProfile}</h2>
                        <div className="flex w-[470px] space-x-4 gap-5">
                            <Form.Item
                                name="firstName"
                                label={trans.settings.firstName}
                                className="flex-1"
                                rules={[{ required: true, message: trans.settings.messageFirstName }]}
                            >
                                <Input size="large" disabled={isDisabled} />
                            </Form.Item>
                            <Form.Item
                                name="lastName"
                                label={trans.settings.lastName}
                                className="flex-1"
                                rules={[{ required: true, message: trans.settings.messageLastName }]}
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
                                <Button icon={<UploadOutlined />} className="!w-[200px] !border-none !bg-[#97DDD9] !h-[46px] !text-[18px] !font-bold !text-black !hover:bg-[#97DDD9]" size="large">{trans.settings.upload}</Button>
                            </Upload>
                            <Button
                                danger
                                onClick={handleRemoveAvatar}
                                size="large"
                                disabled={!avatarUrl}
                                className='!text-[18px] !w-[200px]'
                            >
                                {trans.settings.remove}
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-700">{trans.settings.accountSecurity}</h2>
                    <Form.Item label={trans.settings.password} className="mb-0">
                        <div className="flex items-center !justify-between !gap-5">
                            <div className='w-auto'>
                                <Input.Password
                                    placeholder="••••••••"
                                    readOnly
                                    className="flex-1"
                                    size="large"
                                    iconRender={() => <LockOutlined style={{ color: '#ccc', fontSize: '16px' }} />}
                                />
                            </div>
                            <Button onClick={handleChangePassword} className="ml-4 !bg-[#97DDD9] !border-none" size="large">{trans.settings.changePassword}</Button>
                        </div>
                    </Form.Item>
                </div>

                <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-700">{trans.settings.supportAccess}</h2>
                    <div className="flex justify-between items-center bg-white p-5 rounded-md border border-red-400">
                        <div className="space-y-1">
                            <h3 className="text-red-500 font-bold text-lg">{trans.settings.deleteAccountTitle}</h3>
                            <p className="text-sm text-gray-600">{trans.settings.deleteAccountDesc}</p>
                        </div>
                        <Button danger onClick={handleDeleteAccount} size="large">{trans.settings.deleteAccountButton}</Button>
                    </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 gap-5">
                    <Button onClick={() => router.back()} size="large" className='!w-[91px]'>
                        {trans.common.cancel}
                    </Button>
                    <Button type="primary" htmlType="submit" className='!bg-[#97DDD9] !border-none !text-black !w-[91px]' loading={loading} size="large">
                        {trans.common.save}
                    </Button>
                </div>
            </Form>
            {contextHolder}
        </div>
    );
};

export default Profile;
