'use client';

import { Button, Card, Form, Input, Typography, message } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

const { Title, Paragraph } = Typography;

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { email: string; password: string }) => {
  setLoading(true);
  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.message || 'Đăng nhập thất bại');
  }
  message.success('Đăng nhập thành công');
  router.push('/')

  const from = params.get('from');
    router.replace(from || '/teammate');
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
        <Title level={3} className='text-center'>Đăng nhập</Title>
          <Paragraph type="secondary" className='text-center'>
            Demo tài khoản: <strong>admin@gmail.com</strong> / <strong>admin123</strong>
          </Paragraph>
        <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Nhập email' }, { type: 'email', message: 'Email không hợp lệ' }]}>
            <Input prefix={<MailOutlined />} placeholder="you@example.com" autoComplete="email" />
          </Form.Item>
          <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: 'Nhập mật khẩu' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="••••••••" autoComplete="current-password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>Đăng nhập</Button>
        </Form>
      </Card>
    </div>
  );
}