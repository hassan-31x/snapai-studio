import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { DEFAULT_LOGIN_REDIRECT, authRoutes } from "@/routes";
export default auth((request) => {
  const path = request.nextUrl.pathname;
  if (path.startsWith("/api/auth")) return NextResponse.next();
  const protectedRoute = [
    "/dashboard",
    "/generate",
    "/submissions",
    "/settings",
    "/editor",
  ].some((route) => path === route || path.startsWith(`${route}/`));
  if (!request.auth && protectedRoute)
    return NextResponse.redirect(new URL("/auth/login", request.nextUrl));
  if (request.auth && authRoutes.includes(path))
    return NextResponse.redirect(
      new URL(DEFAULT_LOGIN_REDIRECT, request.nextUrl),
    );
  return NextResponse.next();
});
export const config = {
  matcher: ["/((?!_next|.*\\.(?:png|jpg|jpeg|svg|webp|ico|woff2|css|js)$).*)"],
};
