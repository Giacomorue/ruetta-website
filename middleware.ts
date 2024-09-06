import { auth } from "@/auth";
import { adminRoute, authRoute } from "./routes";
import { NextResponse } from "next/server";

export default auth((req) => {

  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isAuthRoute = nextUrl.pathname.includes(authRoute);
  const isAdminRoute = nextUrl.pathname.startsWith(adminRoute);

  if(isAuthRoute && isLoggedIn){
    return NextResponse.redirect(new URL("/admin", nextUrl));
  }

  if(isAuthRoute && !isLoggedIn){
    return;
  }

  if(isAdminRoute && !isAuthRoute && !isLoggedIn){
    return NextResponse.redirect(new URL("/admin/auth", nextUrl));
  }
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
