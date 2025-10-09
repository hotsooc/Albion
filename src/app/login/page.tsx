// file: src/app/login/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Form, Input, Typography, Divider, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { supabase } from "../../../lib/supabase/client";
import { Baloo_2 } from "next/font/google";

const { Paragraph, Link } = Typography;

type LoginValues = {
 username: string;
 password: string;
};

const balooFont = Baloo_2({
 subsets: ['vietnamese'],
 weight: ['800'],
});

export default function LoginPage() {
 const [loading, setLoading] = useState(false);
 const router = useRouter();

 useEffect(() => {
  const { data: authListener } = supabase.auth.onAuthStateChange(
   async (event, session) => {
    if (session) {
     const user = session.user;

     const { data: profile, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

     if (error && error.code === 'PGRST116') {
      const userName = user.user_metadata?.full_name || user.email;

      const { error: createError } = await supabase
       .from('profiles')
       .insert({ id: user.id, full_name: userName });
      
      if (createError) {
       console.error('Lỗi khi tạo hồ sơ người dùng:', createError.message);
       message.error('Lỗi khi tạo hồ sơ. Vui lòng thử lại.');
       return;
      }
     } else if (error && error.code !== 'PGRST116') {
      console.error('Lỗi khi lấy hồ sơ người dùng:', error.message);
      message.error('Không thể tải hồ sơ người dùng. Vui lòng thử lại.');
      return;
     }
     
     // Chuyển hướng sau khi đã xác nhận người dùng và hồ sơ
     router.push('/home');
    }
   }
  );

  // Dọn dẹp listener khi component unmount
  return () => {
   authListener.subscription.unsubscribe();
  };
 }, [router]);

 const handleGoogleLogin = async () => {
  setLoading(true);
  const { error } = await supabase.auth.signInWithOAuth({
   provider: 'google',
   options: {
    redirectTo: window.location.origin,
   },
  });
  if (error) {
   setLoading(false);
   message.error(error.message);
  } 
 };

 const onFinish = async (values: LoginValues) => {
  setLoading(true);
  const { error } = await supabase.auth.signInWithPassword({
   email: values.username,
   password: values.password,
  });

  setLoading(false);

  if (error) {
   message.error(error.message);
  }
 };

 return (
  <div className="grid grid-cols-5 min-h-screen">
   <div
    className="col-span-2 bg-cover bg-center h-full hidden md:flex"
    style={{ backgroundImage: "url('/image/albion.png')" }}
   ></div>

   <div className="col-span-3 flex items-center justify-center p-4">
    <div className="w-full max-w-[75vh] p-8 flex flex-col items-center justify-center">
     <div className="flex flex-col items-center mb-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/image/XHCN_icon.png" alt="XHCN Logo" className="w-16 h-20 mb-4" />
      <span className={`${balooFont.className} text-center text-[48px] text-[#686868]`}>
       Welcome to XHCN
      </span>
     </div>

     <Form layout="vertical" onFinish={onFinish} requiredMark={false} className="w-full">
      <label className="block text-[#686868] text-[20px] font-medium mb-2">
       User
      </label>
      <Form.Item
       name="username"
       rules={[{ required: true, message: "Please input your Username!" }]}
      >
       <Input
        prefix={<UserOutlined />}
        placeholder="Username"
        size="large"
        className="rounded-[12px] h-[60px] text-lg border-none"
       />
      </Form.Item>

      <label className="block text-[#686868] text-[20px] font-medium mb-2">
       Password
      </label>
      <Form.Item
       name="password"
       rules={[{ required: true, message: "Please input your Password!" }]}
      >
       <Input.Password
        prefix={<LockOutlined />}
        placeholder="Password"
        size="large"
        className="rounded-[12px] h-[60px] text-lg border-none"
       />
      </Form.Item>

      <div className="text-left mb-4">
       <Link href="#" className="text-[#3299FF] text-[20px] hover:underline">
        Forgot Password?
       </Link>
      </div>

      <Form.Item>
       <Button
        type="primary"
        htmlType="submit" 
        block
        loading={loading}
        size="large"
        className="bg-[#3299FF] hover:bg-[#2A82D1] border-none h-[60px]"
       >
        <span className="text-lg font-bold">Log in</span>
       </Button>
      </Form.Item>
     </Form>

     <Divider plain className="text-[#686868]">OR</Divider>
     <Button
      icon={<img src="/image/google_icon.png" alt="Google" className="w-5 h-5" />}
      size="large"
      block
      onClick={handleGoogleLogin}
      className="flex items-center justify-center space-x-2 rounded-full h-[60px]"
     >
      <span className="text-lg font-bold text-[#686868]">Continue with Google</span>
     </Button>

     <Paragraph className="text-center mt-4 text-[#686868]">
      Don&apos;t have account?{" "}
      <Link href="/register" className="text-[#3299FF] hover:underline">
       Sign Up
      </Link>
     </Paragraph>
    </div>
   </div>
  </div>
 );
}