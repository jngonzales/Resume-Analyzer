import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  if (!req.auth) {
    const signInUrl = new URL("/auth/signin", req.url)
    return NextResponse.redirect(signInUrl)
  }
})

export const config = {
  matcher: ['/dashboard/:path*', '/analyze/:path*', '/results/:path*'],
}
