import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Ambil mode aplikasi dari environment variable
  // Default ke 'PUBLIC' jika tidak diisi
  const appMode = process.env.NEXT_PUBLIC_APP_MODE || 'PUBLIC';

  // Jika mode PUBLIC, blokir akses ke semua rute yang dimulai dengan /admin
  if (appMode === 'PUBLIC' && pathname.startsWith('/admin')) {
    // Kita "tenggelamkan" aksesnya ke halaman 404 agar seolah-olah tidak ada
    return NextResponse.rewrite(new URL('/404', request.url));
  }

  return NextResponse.next();
}

// Hanya jalankan middleware pada rute admin
export const config = {
  matcher: ['/admin/:path*'],
};
