import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname

  // Check if the path is /profile
  if (path === "/profile") {
    // Get the user role from the request headers or cookies
    const userRole = request.cookies.get("userRole")?.value

    // Redirect based on user role
    if (userRole === "candidate") {
      return NextResponse.redirect(new URL("/candidate/profile", request.url))
    } else if (userRole === "recruiter") {
      return NextResponse.redirect(new URL("/recruiter/profile", request.url))
    }
  }

  // Check if the path matches /[role]/profile
  const roleMatch = path.match(/^\/([^/]+)\/profile$/)
  if (roleMatch) {
    const role = roleMatch[1]
    const userRole = request.cookies.get("userRole")?.value

    // If user is not authenticated, redirect to login
    if (!userRole) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }

    // If user role doesn't match the route, redirect to their correct profile
    if (userRole !== role) {
      return NextResponse.redirect(new URL(`/${userRole}/profile`, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/profile", "/:role/profile"],
} 