import React, { useState } from 'react';
import { Avatar, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import moment from 'moment';

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

const CommentSection = () => {
  const [comments, setComments] = useState<any[]>([]);
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    if (!value.trim()) return;
    setComments([
      ...comments,
      {
        author: 'User',
        content: value,
        datetime: moment().toISOString(),
      },
    ]);
    setValue('');
  };

  return (
    <div className="flex flex-col h-[500px] p-4 rounded-lg bg-white shadow-sm w-full max-w-2xl mx-auto">
      <div className="flex-1 overflow-y-auto pr-2">
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <CommentItem
              key={index}
              author={comment.author}
              content={comment.content}
              datetime={comment.datetime}
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
        />
        <Button type="primary" onClick={handleSubmit}>
          Gửi
        </Button>
      </div>
    </div>
  );
};

export default CommentSection;
