'use client';

import React, { useState, useEffect } from 'react';
import { Avatar, Button, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/vi';
import { supabase } from '../../lib/supabase/client';

moment.locale('vi');

const CommentItem = ({ author, content, datetime }: any) => (
  <div className="flex items-start space-x-3 mb-4">
    <Avatar icon={<UserOutlined />} />
    <div>
      <div className="flex items-center space-x-2">
        <span className="font-semibold text-gray-800">{author}</span>
        <span className="text-xs text-gray-500">{moment(datetime).fromNow()}</span>
      </div>
      <p className="text-gray-700">{content}</p>
    </div>
  </div>
);

const CommentSection = ({ videoId }: { videoId: string }) => {
    const [comments, setComments] = useState<any[]>([]);
    const [value, setValue] = useState('');
    const [user, setUser] = useState<any>(null);
    const [userName, setUserName] = useState<string>('Anonymous');

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('full_name')
                    .eq('id', user.id)
                    .single();
                setUserName(profile?.full_name || user.email || 'Anonymous');
            }

            // Lọc bình luận theo videoId
            const { data, error } = await supabase
                .from('comments')
                .select('*')
                .eq('video_id', videoId) // Thêm điều kiện lọc
                .order('created_at', { ascending: true });

            if (error) {
                console.error("Error fetching comments:", error.message);
                message.error("Lỗi khi tải bình luận.");
            } else {
                setComments(data);
            }
        };

        if (videoId) { // Chỉ fetch khi có videoId
          fetchData();
        }
    }, [videoId]); // Thêm videoId vào dependency array

    const handleSubmit = async () => {
        if (!value.trim()) {
            message.warning("Vui lòng nhập bình luận.");
            return;
        }

        if (!user) {
            message.error("Bạn cần đăng nhập để bình luận.");
            return;
        }

        const newComment = {
            user_id: user.id,
            user_name: userName,
            content: value,
            video_id: videoId, // Thêm videoId vào đối tượng bình luận mới
        };
        
        const { data, error } = await supabase
            .from('comments')
            .insert(newComment)
            .select();

        if (error) {
            console.error("Error submitting comment:", error.message);
            message.error("Lỗi khi gửi bình luận.");
        } else {
            setComments([...comments, data[0]]);
            setValue('');
            message.success("Bình luận đã được gửi thành công!");
        }
    };

    return (
      <div className="flex flex-col h-[500px] p-4 rounded-lg bg-white shadow-sm w-full max-w-2xl mx-auto">
        <div className="flex-1 overflow-y-auto pr-2">
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <CommentItem
                key={comment.id || index}
                author={comment.user_name || 'Anonymous'}
                content={comment.content}
                datetime={comment.created_at}
              />
            ))
          ) : (
            <p className="text-black italic">Chưa có bình luận nào</p>
          )}
        </div>
  
        <div className="flex items-center mt-4 space-x-2 border-t gap-3 pt-3">
          <Avatar icon={<UserOutlined />} />
          <input
            type="text"
            className="flex-grow border border-gray-300 rounded-full !text-black px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Viết bình luận..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            disabled={!user}
          />
          <Button 
            type="primary" 
            onClick={handleSubmit}
            disabled={!user || value.trim().length === 0}
          >
            Gửi
          </Button>
        </div>
      </div>
    );
};

export default CommentSection;