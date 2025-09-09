// file: src/app/login/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Form, Input, Typography, Divider } from "antd";
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
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push("/home");
      }
    };
    checkUser();
  }, [router]);

  useEffect(() => {
    const {data: authListener} = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log(event)
        if (session) {
          router.push('/home')
        }
      }
    )
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router])

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) {
      alert(error.message);
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
      return alert(error.message);
    } 
  };

  return (
    <div className="grid grid-cols-5 min-h-screen">
      <div
        className="col-span-2 bg-cover bg-center h-full hidden md:flex"
        style={{ backgroundImage: "url('/albion.png')" }}
      ></div>

      <div className="col-span-3 flex items-center justify-center p-4">
        <div className="w-full max-w-[75vh] p-8 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/XHCN_icon.png" alt="XHCN Logo" className="w-16 h-20 mb-4" />
            <span className={`${balooFont.className} text-center text-[48px] text-[#686868]`}>
              Welcome to XHCN
            </span>
          </div>

          <Form layout="vertical" onFinish={onFinish} requiredMark={false} className="w-full">
            <Form.Item
              name="username"
              rules={[{ required: true, message: "Please input your Username!" }]}
            >
              <span className="text-[#686868] text-[20px] font-medium">User</span>
              <Input
                prefix={<UserOutlined />}
                placeholder="Username"
                size="large"
                className="rounded-[12px] h-[60px] text-lg border-none"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: "Please input your Password!" }]}
            >
              <span className="text-[#686868] text-[20px] font-medium">Password</span>
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
            icon={<img src="/google_icon.png" alt="Google" className="w-5 h-5" />}
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