import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// import components
import { authRoutes, protectedRoutes } from "@/components/Router/routes";
const PUBLIC_FILE = /\.(.*)$/;
export function middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/socket.io") ||
    request.nextUrl.pathname.includes("/api/") ||
    PUBLIC_FILE.test(request.nextUrl.pathname)
  ) {
    return;
  }

  const currentUser = request.cookies.get("loggedin");
  console.log(request.nextUrl.pathname, "------14",currentUser);
  if (
    protectedRoutes.includes(request.nextUrl.pathname) &&
    !currentUser?.value
  ) {
    console.log();
    request.cookies.delete("loggedin");
    const response = NextResponse.redirect(new URL("/login", request.url));
    console.log(request.url, "------26");
    response.cookies.delete("loggedin");
    return response;
  }

  if (authRoutes.includes(request.nextUrl.pathname) && currentUser?.value) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next|favicon.ico|socket.io).*)",
  ],
};
