import { NextRequest } from "next/server";
// import { updateSession } from "@/app/auth/session";

// TODO: runs to many times on one request
//        probably because of img, ico... GET requests, so I need to restrict them
export async function middleware(request: NextRequest) { // TODO: do i need this?
  // console.log('middleware');
  // return await updateSession(request); // TODO: caches and do not update session expire time
}
// test commit