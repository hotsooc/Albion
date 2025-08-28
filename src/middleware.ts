import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';


export function middleware(req: NextRequest) {
const { pathname } = req.nextUrl;


const isPublic =
pathname === '/login' ||
pathname.startsWith('/_next') ||
pathname.startsWith('/favicon') ||
pathname.startsWith('/api/login');


if (isPublic) return NextResponse.next();


const token = req.cookies.get('token')?.value;
if (!token) {
const url = req.nextUrl.clone();
url.pathname = '/login';
url.searchParams.set('from', pathname);
return NextResponse.redirect(url);
}


return NextResponse.next();
}


export const config = {
matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};