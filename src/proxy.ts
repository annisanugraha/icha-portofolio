import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const appMode = process.env.NEXT_PUBLIC_APP_MODE || 'PUBLIC';

  // 1. Jika mode PUBLIC, semua yang berbau /admin jadi 404 (Hiding the admin existence)
  if (appMode === 'PUBLIC' && pathname.startsWith('/admin')) {
    return NextResponse.rewrite(new URL('/404', request.url));
  }

  // 2. Jika mode ADMIN, proteksi dengan Authentication
  if (appMode === 'ADMIN' && pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const session = request.cookies.get('admin_session');
    
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
