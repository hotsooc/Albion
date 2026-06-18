'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Button, Form, App, Avatar, Upload } from 'antd';
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
    const { message, modal } = App.useApp();
    const [loading, setLoading] = useState<boolean>(false);
    const [form] = Form.useForm();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const isDisabled = userRole !== 'admin';
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const { trans } = useTrans();

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (user) {
                const { data: profile } = await supabase
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

    const { error: uploadError } = await supabase.storage
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
        
        if (!avatarUrl) return;
        const avatarPath = avatarUrl.split('public/avatars/')[1];
    
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
            title: <span className="sora-font font-extrabold text-lg">{trans.settings.changePasswordTitle}</span>,
            content: (
                <div className="mt-3">
                    <p className="font-bold text-sm mb-2">{trans.settings.enterNewPassword}</p>
                    <Input.Password className="border-2 border-[var(--border-color)] rounded-xl h-10" onChange={(e) => (newPassword = e.target.value)} />
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
            title: <span className="sora-font font-extrabold text-lg text-[var(--color-danger-text)]">{trans.settings.deleteAccountConfirm}</span>,
            content: <p className="font-medium text-sm mt-2">{trans.settings.deleteAccountWarning}</p>,
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
        <div className="bg-[var(--bg-panel-solid)] border-2 border-[var(--border-color)] p-4 md:p-8 rounded-[32px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-w-screen mx-1 md:mx-6 text-[var(--text-primary)] transition-all duration-300 theme-transition">
            {userRole === 'admin' && (
                <div className="mb-8 p-6 bg-[var(--color-accent)]/30 border-2 border-[var(--border-color)] rounded-2xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <h3 className="text-xl font-extrabold sora-font text-[var(--text-primary)]">{trans.settings.adminDashboard}</h3>
                    <p className="mt-2 text-[var(--text-secondary)] font-bold sora-font">{trans.settings.adminAccess}</p>
                </div>
            )}
            <Form
                form={form}
                onFinish={onFinish}
                layout="vertical"
                disabled={loading}
                className="space-y-8"
            >
                {/* Profile Detail and Avatar section */}
                <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
                    <div className="flex-1 w-full">
                        <h2 className="text-2xl font-extrabold mb-6 sora-font tracking-tight text-[var(--text-primary)]">{trans.settings.myProfile}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                            <Form.Item
                                name="firstName"
                                label={<span className="font-bold text-sm text-[var(--text-primary)]">{trans.settings.firstName}</span>}
                                rules={[{ required: true, message: trans.settings.messageFirstName }]}
                            >
                                <Input className="border-2 border-[var(--border-color)] rounded-xl h-11 text-[var(--text-primary)] font-semibold" disabled={isDisabled} />
                            </Form.Item>
                            <Form.Item
                                name="lastName"
                                label={<span className="font-bold text-sm text-[var(--text-primary)]">{trans.settings.lastName}</span>}
                                rules={[{ required: true, message: trans.settings.messageLastName }]}
                            >
                                <Input className="border-2 border-[var(--border-color)] rounded-xl h-11 text-[var(--text-primary)] font-semibold" disabled={isDisabled} />
                            </Form.Item>
                        </div>
                    </div>
                    
                    <div className="flex flex-row gap-5 items-center flex-shrink-0">
                        <Avatar
                            size={100}
                            icon={<UserOutlined />}
                            src={avatarUrl || null}
                            className="bg-[var(--color-accent)] border-[var(--border-color)] border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        />
                        <div className="flex flex-col gap-3">
                            <Upload
                                showUploadList={false}
                                onChange={handleAvatarUpload}
                            >
                                <Button 
                                    icon={<UploadOutlined />} 
                                    className="!w-[160px] border-2 border-[var(--border-color)] !bg-[var(--color-accent)] hover:!bg-[var(--color-accent-hover)] !h-10 !text-sm !font-bold !text-[var(--text-primary)] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px] rounded-full transition-all will-change-transform backface-visibility-hidden"
                                >
                                    {trans.settings.upload}
                                </Button>
                            </Upload>
                            <Button
                                danger
                                onClick={handleRemoveAvatar}
                                disabled={!avatarUrl}
                                className="!w-[160px] !h-10 !text-sm !font-bold border-2 border-[var(--border-color)] rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px] transition-all disabled:opacity-40 will-change-transform backface-visibility-hidden"
                            >
                                {trans.settings.remove}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Account Security */}
                <div className="space-y-4 border-t-2 border-[var(--border-color)] pt-6">
                    <h2 className="text-2xl font-extrabold text-[var(--text-primary)] sora-font tracking-tight">{trans.settings.accountSecurity}</h2>
                    <Form.Item label={<span className="font-bold text-sm text-[var(--text-primary)]">{trans.settings.password}</span>} className="mb-0">
                        <div className="flex flex-row items-center gap-4 max-w-xl">
                            <Input.Password
                                placeholder="••••••••"
                                readOnly
                                className="border-2 border-[var(--border-color)] rounded-xl h-11 flex-grow font-semibold text-[var(--text-primary)]"
                                iconRender={() => <LockOutlined style={{ color: '#000000', fontSize: '16px' }} />}
                            />
                            <Button 
                                onClick={handleChangePassword} 
                                className="border-2 border-[var(--border-color)] !bg-[var(--color-accent)] hover:!bg-[var(--color-accent-hover)] !text-[var(--text-primary)] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px] !font-bold rounded-full !h-11 transition-all flex-shrink-0 will-change-transform backface-visibility-hidden"
                            >
                                {trans.settings.changePassword}
                            </Button>
                        </div>
                    </Form.Item>
                </div>

                {/* Danger Zone */}
                <div className="space-y-4 border-t-2 border-[var(--border-color)] pt-6">
                    <h2 className="text-2xl font-extrabold text-[var(--text-primary)] sora-font tracking-tight">{trans.settings.supportAccess}</h2>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[var(--color-danger-bg)] p-5 rounded-2xl border-2 border-[var(--color-danger-border)] shadow-[3px_3px_0px_0px_rgba(239,68,68,1)] gap-4">
                        <div className="space-y-1">
                            <h3 className="text-[var(--color-danger-text)] font-extrabold text-lg sora-font">{trans.settings.deleteAccountTitle}</h3>
                            <p className="text-sm text-[var(--text-secondary)] font-bold">{trans.settings.deleteAccountDesc}</p>
                        </div>
                        <Button 
                            danger 
                            onClick={handleDeleteAccount} 
                            className="border-2 border-[var(--color-danger-border)] hover:!bg-red-50 !font-bold rounded-full h-11 flex items-center shadow-[2px_2px_0px_0px_rgba(239,68,68,1)] hover:-translate-y-[1px] will-change-transform backface-visibility-hidden"
                        >
                            {trans.settings.deleteAccountButton}
                        </Button>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 border-t-2 border-[var(--border-color)] pt-6">
                    <Button 
                        onClick={() => router.back()} 
                        className="!w-[100px] border-2 border-[var(--border-color)] rounded-full hover:-translate-y-[1px] transition-all font-bold !h-11 will-change-transform backface-visibility-hidden"
                    >
                        {trans.common.cancel}
                    </Button>
                    <Button 
                        type="primary" 
                        htmlType="submit" 
                        loading={loading}
                        className="!w-[100px] border-2 border-[var(--border-color)] !bg-[var(--color-accent)] hover:!bg-[var(--color-accent-hover)] !text-[var(--text-primary)] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px] rounded-full transition-all font-bold !h-11"
                    >
                        {trans.common.save}
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default Profile;
