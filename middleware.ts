import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/auth';

// Add routes that should be protected
const protectedRoutes = ['/', '/new', '/edit'];
const publicRoutes = ['/login', '/api/auth/login'];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some(route => path === route || path.startsWith('/edit/'));
  const isPublicRoute = publicRoutes.includes(path);

  const session = req.cookies.get('session')?.value;
  
  let payload = null;
  if (session) {
    try {
      payload = await decrypt(session);
    } catch (e) {
      // Invalid session
    }
  }

  // Redirect to /login if the user is not authenticated and trying to access a protected route
  if (isProtectedRoute && !payload) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  // Redirect to / if the user is authenticated and trying to access a public route (like /login)
  if (isPublicRoute && payload && !path.startsWith('/api')) {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
