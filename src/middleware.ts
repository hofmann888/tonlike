import { NextRequest, NextResponse } from "next/server";
import { AppEnvEnum } from "./lib/definitions";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (pathname === '/' && process.env.NEXT_PUBLIC_APP_ENV === AppEnvEnum.PROD) {
    return NextResponse.redirect(new URL('/earn', request.url));
  }
}