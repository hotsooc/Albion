import { NextResponse } from 'next/server';


export async function POST(req: Request) {
    const { email, password } = await req.json();


    const OK = email === 'admin@gmail.com' && password === 'admin123';


    if (!OK) {
        return NextResponse.json({ message: 'Sai tài khoản hoặc mật khẩu' }, { status: 401 });
    }


    const token = 'mock-token-abc123';
    const user = { name: 'Admin', email };


    const res = NextResponse.json({ user, token });
        res.cookies.set({
        name: 'token',
        value: token,
        httpOnly: false, 
        path: '/',
        maxAge: 60 * 60 * 24, 
        sameSite: 'lax',
    });
        return res;
}