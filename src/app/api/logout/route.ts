// file: src/app/api/logout/route.ts

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// This is the function that handles POST requests to this API route
export async function POST() {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  // Sign out the user
  const { error } = await supabase.auth.signOut();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
}

// You can also add a GET handler if you want to allow logout via a simple link
// export async function GET() {
//   const cookieStore = cookies();
//   const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
//   
//   const { error } = await supabase.auth.signOut();
// 
//   if (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// 
//   return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
// }