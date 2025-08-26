import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/**
 * Next.js Middleware for Route Protection
 * 
 * This middleware runs on the edge and handles:
 * - Authentication checks for protected routes
 * - Supabase session validation
 * - Automatic redirects for unauthenticated users
 * 
 * Protected routes:
 * - /dashboard/* - All dashboard pages
 * - /app/* - App-specific routes
 * - /admin/* - Admin-only routes
 */
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Create Supabase client for server-side operations
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => req.cookies.get(name)?.value,
        set: (name: string, value: string, options: any) => {
          res.cookies.set({ name, value, ...options });
        },
        remove: (name: string, options: any) => {
          res.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // Get current user from Supabase session
  const { data: { user }, error } = await supabase.auth.getUser();

  // Define protected route patterns
  const protectedRoutes = [
    '/dashboard',
    '/app',
    '/admin',
    '/account',
    '/profile',
    '/settings'
  ];

  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  );

  // If accessing protected route without authentication
  if (isProtectedRoute && !user) {
    const url = req.nextUrl.clone();
    url.pathname = '/auth/sign-in';
    url.searchParams.set('redirect', req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // If accessing auth pages while already authenticated, redirect to dashboard
  if (user && req.nextUrl.pathname.startsWith('/auth')) {
    const url = req.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // Allow access to auth routes for unauthenticated users
  if (req.nextUrl.pathname.startsWith('/auth')) {
    return res;
  }

  // Continue with the request
  return res;
}

/**
 * Middleware Configuration
 * 
 * Matcher patterns for routes that should trigger this middleware
 * - Excludes static files, API routes, and Next.js internals
 * - Includes all page routes that need authentication checks
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     * - auth routes (sign-in, sign-up, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public|auth).*)',
  ],
};
