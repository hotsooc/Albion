'use client';

import React, { useState, useEffect } from 'react';
import { Avatar, Button, message, Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { supabase } from '../../lib/supabase/client';
import CommentItem from './CommentItem';

import useTrans from '@/hooks/useTrans';

const { TextArea } = Input;

const CommentSection = ({ videoId }: { videoId: string }) => {
    const { trans } = useTrans();
    const [comments, setComments] = useState<any[]>([]);
    const [value, setValue] = useState('');
    const [user, setUser] = useState<any>(null);
    const [userName, setUserName] = useState<string>('Anonymous');
    const [userAvatar, setUserAvatar] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string>('user');

    const fetchComments = async () => {
        if (!videoId) return;

        const { data, error } = await supabase
            .from('comments')
            .select('*, profiles(full_name, avatar_url)')
            .eq('video_id', videoId)
            .order('created_at', { ascending: true });

        if (error) {
            message.error(trans.comment.loadError);
        } else {
            setComments(data);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            let role = 'user';
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('full_name, role, avatar_url')
                    .eq('id', user.id)
                    .single();
                setUserName(profile?.full_name || user.email || 'Anonymous');
                setUserAvatar(profile?.avatar_url || null);
                role = profile?.role || 'user';
            }
            setUserRole(role);
            fetchComments();
        };

        if (videoId) {
            fetchData();
        }
    }, [videoId, trans]);

    const handleSubmit = async () => {
        if (!value.trim()) {
            message.warning(trans.comment.emptyWarning);
            return;
        }
        if (!user) {
            message.error(trans.comment.loginRequired);
            return;
        }

        const newComment = {
            user_id: user.id,
            content: value,
            video_id: videoId,
        };

        const { data, error } = await supabase
            .from('comments')
            .insert(newComment)
            .select('*, profiles(full_name, avatar_url)')
            .single();

        if (error) {
            message.error(trans.comment.submitError);
        } else {
            if (data) {
                setComments([...comments, data]);
                setValue('');
                message.success(trans.comment.submitSuccess);
            }
        }
    };

    const handleDelete = async (commentId: string) => {
        const { error } = await supabase
            .from('comments')
            .delete()
            .eq('id', commentId);

        if (error) {
            message.error(trans.comment.deleteError);
        } else {
            setComments(comments.filter(c => c.id !== commentId));
            message.success(trans.comment.deleteSuccess);
        }
    };

    const handleUpdate = async (commentId: string, newContent: string) => {
        const { error } = await supabase
            .from('comments')
            .update({ content: newContent })
            .eq('id', commentId);

        if (error) {
            message.error(trans.comment.updateError);
            return false;
        } else {
            setComments(comments.map(c => c.id === commentId ? { ...c, content: newContent } : c));
            message.success(trans.comment.updateSuccess);
            return true;
        }
    };

    return (
        <div className="flex flex-col min-h-[400px] p-4 rounded-lg bg-white shadow-xl w-full max-w-2xl mx-auto">
            <div className='flex gap-3 mb-4 w-full'>
                <img src='/image/message 1.png' alt='' width={30} height={15} />
                <span className='text-gray-400 text-[20px]'>Comment</span>
            </div>
            <div className="flex-1 overflow-y-auto max-h-[350px] no-scrollbar pr-2">
                {comments.length > 0 ? (
                    comments.map((comment, index) => (
                        <CommentItem
                            key={comment.id || index}
                            comment={comment}
                            currentUser={user}
                            userRole={userRole}
                            onDelete={handleDelete}
                            onUpdate={handleUpdate} // Sửa ở đây
                        />
                    ))
                ) : (
                    <p className="text-black italic">No comments yet</p>
                )}
            </div>

            <div className="flex items-center mt-4 space-x-2 border-t gap-3 pt-3">
                <Avatar
                    icon={<UserOutlined />}
                    className="flex-shrink-0"
                    src={userAvatar || undefined}
                />
                <TextArea
                    rows={1}
                    className="flex-grow rounded-full !text-black px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={user ? trans.comment.placeholder : trans.comment.loginRequired}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onPressEnter={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit();
                        }
                    }}
                    disabled={!user}
                />
                <Button
                    type="primary"
                    onClick={handleSubmit}
                    disabled={!user || value.trim().length === 0}
                    className="!bg-[#97DDD9] !text-black !border-none"
                >
                    {trans.comment.post}
                </Button>
            </div>
        </div>
    );
};

export default CommentSection;