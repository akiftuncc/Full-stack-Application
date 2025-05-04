import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Roles, Routes } from "./lib/constants/enums";

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get("auth-token");

  const isProtectedRoute =
    request.nextUrl.pathname.startsWith(Routes.LESSONS) ||
    request.nextUrl.pathname.startsWith(Routes.PROFILE) ||
    request.nextUrl.pathname.startsWith(Routes.ADMIN) ||
    request.nextUrl.pathname.startsWith(Routes.SETTINGS);

  if (isProtectedRoute && !authToken) {
    return NextResponse.redirect(new URL(Routes.LOGIN, request.url));
  }

  if (request.nextUrl.pathname.startsWith(Routes.ADMIN) && authToken) {
    try {
      const tokenData = JSON.parse(atob(authToken.value.split(".")[1]));
      if (tokenData.role !== Roles.ADMIN) {
        return NextResponse.redirect(new URL(Routes.HOME, request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL(Routes.LOGIN, request.url));
    }
  }

  if (
    (request.nextUrl.pathname === Routes.LOGIN ||
      request.nextUrl.pathname === Routes.REGISTER) &&
    authToken
  ) {
    try {
      const tokenData = JSON.parse(atob(authToken.value.split(".")[1]));
      const currentTime = Math.floor(Date.now() / 1000);

      if (tokenData.exp && tokenData.exp > currentTime) {
        return NextResponse.redirect(new URL(Routes.PROFILE, request.url));
      }
    } catch (error) {
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    `${Routes.LESSONS}/:path*`,
    `${Routes.PROFILE}/:path*`,
    `${Routes.ADMIN}/:path*`,
    `${Routes.LOGIN}`,
    `${Routes.REGISTER}`,
  ],
};
