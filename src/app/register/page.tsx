'use client';

import { Button, Card, Form, Input, Typography, message } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabase } from '../../../lib/supabase/client';

const { Title } = Typography;

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });
      console.log(data)

      if (error) {
        throw new Error(error.message);
      }

      message.success('Đăng ký thành công. Vui lòng kiểm tra email để xác nhận.');
      router.push('/login');
    } catch (e) {
      if (e instanceof Error) {
        message.error(e.message || 'Có lỗi xảy ra');
      } else {
        message.error('Có lỗi xảy ra');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-[70vh]'>
      <Card className='max-w-[400px]'>
        <Title level={3} className='text-center'>Đăng ký</Title>
        <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Nhập email' }, { type: 'email', message: 'Email không hợp lệ' }]}>
            <Input prefix={<MailOutlined />} placeholder="you@example.com" autoComplete="email" />
          </Form.Item>
          <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: 'Nhập mật khẩu' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="••••••••" autoComplete="new-password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>Đăng ký</Button>
        </Form>
      </Card>
    </div>
  );
}