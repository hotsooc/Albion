// file: src/app/signup/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Form, Input, Typography, Divider } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { supabase } from '../../../lib/supabase/client';
import { Baloo_2 } from 'next/font/google';

const { Paragraph, Link } = Typography;

type SignupValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

const balooFont = Baloo_2({
  subsets: ['vietnamese'],
  weight: ['800'],
});

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [form] = Form.useForm();

  const onFinish = async (values: SignupValues) => {
  setLoading(true);

  const { data, error } = await supabase.auth.signUp({
    email: values.email,
    password: values.password,
  });
  console.log(data)

  setLoading(false);

  if (error) {
    alert(error.message);
  } else {
    alert('Tạo tài khoản thành công! Vui lòng kiểm tra email để xác nhận.');
    router.push('/login');
  }
};

  const handleGoogleSignup = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) {
      alert(error.message);
    }
  };

  return (
    <div className='grid grid-cols-5 min-h-screen'>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <div 
        className='col-span-2 bg-cover bg-center h-full hidden md:flex' 
        style={{ backgroundImage: "url('/image/albion.png')" }}
      >
      </div>

      <div className='col-span-3 flex items-center justify-center p-4 '>
        <div className='w-full max-w-[75vh] p-8 flex flex-col items-center justify-center'>
          <div className='flex flex-col items-center mb-6'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src='/image/XHCN_icon.png' alt='XHCN Logo' className='w-12 h-16 mb-4' />
            <div className={`${balooFont.className} text-center text-[48px] text-[#686868]`}>
              Welcome to XHCN
            </div>
          </div>

          <Form form={form} layout='vertical' onFinish={onFinish} requiredMark={false} className='w-full'>
            <label className="block text-[#686868] text-[20px] font-medium mb-2">
              Email
            </label>
            <Form.Item
              name='email'
              rules={[{ required: true, message: 'Please input your Email!' }, { type: 'email', message: 'The input is not a valid E-mail!' }]}
            >
              <Input
                prefix={<MailOutlined />} 
                placeholder='Email'
                size='large'
                className="rounded-[12px] h-[60px] text-lg border-none"
              />
            </Form.Item>

            <label className="block text-[#686868] text-[20px] font-medium mb-2">
              Password
            </label>
            <Form.Item
              name='password'
              rules={[{ required: true, message: 'Please input your Password!' }, { min: 6, message: 'Password must be at least 6 characters!' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder='Password'
                size='large'
                className="rounded-[12px] h-[60px] text-lg border-none"
              />
            </Form.Item>

            <label className="block text-[#686868] text-[20px] font-medium mb-2">
              Confirm Password
            </label>
            <Form.Item
              name='confirmPassword' 
              dependencies={['password']}
              hasFeedback
              rules={[
                { required: true, message: 'Please confirm your password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder='Confirm Password'
                size='large'
                className="rounded-[12px] h-[60px] text-lg border-none"
              />
            </Form.Item>
            
            <Form.Item>
              <Button
                type='primary'
                htmlType='submit'
                block
                loading={loading}
                size='large'
                className='bg-blue-500 hover:bg-blue-600 border-none'
              >
                Sign up
              </Button>
            </Form.Item>
          </Form>

          <Divider plain>OR</Divider>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <Button
            icon={<img src='/image/google_icon.png' alt='Google' className='w-5 h-5' />}
            size='large'
            block
            onClick={handleGoogleSignup} // Thêm handler Google signup
            className='flex items-center justify-center space-x-2'
          >
            <span>Continue with Google</span>
          </Button>

          <Paragraph className='text-center mt-4 text-gray-600'>
            Already have an account?{' '}
            <Link href='/login' className='text-blue-500 hover:underline'>
              Log in
            </Link>
          </Paragraph>
        </div>
      </div>
    </div>
  );
}