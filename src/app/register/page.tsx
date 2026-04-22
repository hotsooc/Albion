'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Form, Input, Typography, Divider } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { supabase } from '../../../lib/supabase/client';
import { Baloo_2 } from 'next/font/google';
import useTrans from '@/hooks/useTrans';

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
  const { trans } = useTrans();

  const onFinish = async (values: SignupValues) => {
  setLoading(true);

  const { data, error } = await supabase.auth.signUp({
    email: values.email,
    password: values.password,
  });

  setLoading(false);

  if (error) {
    alert(error.message);
  } else {
    alert(trans.register.signUpSuccess);
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
              {trans.register.title}
            </div>
          </div>

          <Form form={form} layout='vertical' onFinish={onFinish} requiredMark={false} className='w-full'>
            <label className="block text-[#686868] text-[20px] font-medium mb-2">
              {trans.register.email}
            </label>
            <Form.Item
              name='email'
              rules={[{ required: true, message: trans.register.messageEmail }, { type: 'email', message: trans.register.messageEmailInvalid }]}
            >
              <Input
                prefix={<MailOutlined />} 
                placeholder={trans.register.email}
                size='large'
                className="rounded-[12px] h-[60px] text-lg border-none"
              />
            </Form.Item>

            <label className="block text-[#686868] text-[20px] font-medium mb-2">
              {trans.register.password}
            </label>
            <Form.Item
              name='password'
              rules={[{ required: true, message: trans.register.messagePassword }, { min: 6, message: trans.register.messagePasswordMin }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder={trans.register.password}
                size='large'
                className="rounded-[12px] h-[60px] text-lg border-none"
              />
            </Form.Item>

            <label className="block text-[#686868] text-[20px] font-medium mb-2">
              {trans.register.confirmPassword}
            </label>
            <Form.Item
              name='confirmPassword' 
              dependencies={['password']}
              hasFeedback
              rules={[
                { required: true, message: trans.register.messageConfirmPassword },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error(trans.register.messageConfirmPasswordMismatch));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder={trans.register.confirmPassword}
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
                {trans.register.signUp}
              </Button>
            </Form.Item>
          </Form>

          <Divider plain>{trans.register.or}</Divider>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <Button
            icon={<img src='/image/google_icon.png' alt='Google' className='w-5 h-5' />}
            size='large'
            block
            onClick={handleGoogleSignup} // Thêm handler Google signup
            className='flex items-center justify-center space-x-2'
          >
            <span>{trans.register.continueWithGoogle}</span>
          </Button>

          <Paragraph className='text-center mt-4 text-gray-600'>
            {trans.register.alreadyHaveAccount}{' '}
            <Link href='/login' className='text-blue-500 hover:underline'>
              {trans.register.login}
            </Link>
          </Paragraph>
        </div>
      </div>
    </div>
  );
}