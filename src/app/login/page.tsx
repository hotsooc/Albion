"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Form, Input, Typography, Divider } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { supabase } from "../../../lib/supabase/client";

const { Title, Paragraph, Link } = Typography;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values: any) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: values.username, // Sử dụng 'username' như trong form
      password: values.password,
    });

    setLoading(false);

    if (error) {
      return alert(error.message);
    } else {
      router.push("/home");
    }
  };

  return (
    <div className="grid grid-cols-5 min-h-screen">
      <div 
        className="col-span-2 bg-cover bg-center h-full hidden md:flex" 
        style={{ backgroundImage: "url('/albion.png')" }}
      >
      </div>

      <div className="col-span-3 flex items-center justify-center p-4 ">
        <Card className="max-w-md w-full p-8 shadow-2xl rounded-xl">
          <div className="flex flex-col items-center mb-6">
            <img src="/XHCN_icon.png" alt="XHCN Logo" className="w-12 h-16 mb-4" /> 
            <Title level={2} className="text-center text-gray-800">
              Welcome to XHCN
            </Title>
          </div>

          <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
            <Form.Item
              name="username"
              rules={[{ required: true, message: "Please input your Username!" }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Username"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: "Please input your Password!" }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                size="large"
              />
            </Form.Item>

            <div className="text-right mb-4">
              <Link href="#" className="text-blue-500 hover:underline">
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
                className="bg-blue-500 hover:bg-blue-600 border-none"
              >
                Log in
              </Button>
            </Form.Item>
          </Form>

          <Divider plain>OR</Divider>

          <Button
            icon={<img src="/google_icon.png" alt="Google" className="w-5 h-5" />} 
            size="large"
            block
            className="flex items-center justify-center space-x-2"
          >
            <span>Continue with Google</span>
          </Button>

          <Paragraph className="text-center mt-4 text-gray-600">
            Don't have account?{" "}
            <Link href="#" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </Paragraph>
        </Card>
      </div>
    </div>
  );
}