import { NextRequest } from "next/server";
import { updateSession } from "@/app/init-data/auth/session";

export async function middleware(request: NextRequest) { // TODO: do i need this?
  console.log('middleware');
  return await updateSession(request);
}