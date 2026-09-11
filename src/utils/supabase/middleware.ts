import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/auth');
  const isPublicRoute = request.nextUrl.pathname === '/';

  if (!user && !isAuthRoute && !isPublicRoute) {
    // Redirect unauthenticated users to login
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (user) {
    // Enforce multi-tenancy: extract tenant_id
    // This assumes tenant_id is stored in user_metadata during onboarding
    const tenantId = user.user_metadata?.tenant_id;
    
    if (!tenantId && request.nextUrl.pathname !== '/onboarding') {
      // Redirect to onboarding to establish tenant workspace
      const url = request.nextUrl.clone();
      url.pathname = '/onboarding';
      return NextResponse.redirect(url);
    }

    if (tenantId && (isAuthRoute || request.nextUrl.pathname === '/onboarding')) {
      // Authenticated users with a workspace shouldn't see login or onboarding pages
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
