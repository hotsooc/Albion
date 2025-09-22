'use client';

import React from 'react';
import { Avatar, Button, Dropdown, MenuProps, message } from 'antd';
import { UserOutlined, MoreOutlined } from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/vi';
import { supabase } from '../../lib/supabase/client';

moment.locale('vi');

/**
 * Kiểu dữ liệu cho dữ liệu bình luận, bao gồm thông tin user đã join.
 * Bạn cần đảm bảo truy vấn của mình trả về cấu trúc dữ liệu này.
 * Ví dụ: select('*, profiles(full_name, avatar_url)')
 */
type CommentData = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
};

type CommentItemProps = {
  comment: CommentData;
  currentUser: {
    id: string;
  } | null;
  userRole: string | null;
  onDelete: (commentId: string) => void;
  onEdit: (commentId: string, content: string) => void;
};

const CommentItem = ({ comment, currentUser, userRole, onDelete, onEdit }: CommentItemProps) => {
  const isOwner = currentUser && currentUser.id === comment.user_id;
  const canDelete = isOwner || userRole === 'admin';
  const canEdit = isOwner;

  const items: MenuProps['items'] = [];
  if (canEdit) {
    items.push({
      key: 'edit',
      label: 'Sửa',
      onClick: () => onEdit(comment.id, comment.content),
    });
  }
  if (canDelete) {
    items.push({
      key: 'delete',
      label: 'Xóa',
      danger: true,
      onClick: () => onDelete(comment.id),
    });
  }
  const userName = comment.profiles?.full_name;
  const userAvatar = comment.profiles?.avatar_url;

  return (
    <div className="flex items-start space-x-3 mb-4 p-2 gap-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
      <Avatar 
        icon={<UserOutlined />} 
        className="flex-shrink-0" 
        src={userAvatar || undefined} 
      />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-semibold text-gray-800">{userName}</span>
            <span className="text-xs text-gray-500 ml-2">{moment(comment.created_at).fromNow()}</span>
          </div>
          
          {items.length > 0 && (
            <Dropdown menu={{ items }} trigger={['click']}>
              <Button type="text" icon={<MoreOutlined className="text-gray-500" />} />
            </Dropdown>
          )}
        </div>
        <p className="text-gray-700 mt-1">{comment.content}</p>
      </div>
    </div>
  );
};

export default CommentItem;