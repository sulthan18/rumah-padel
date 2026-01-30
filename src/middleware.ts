import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    function middleware(req) {
        const isAuth = !!req.nextauth.token
        const isAuthPage = req.nextUrl.pathname.startsWith("/auth")

        if (isAuthPage) {
            if (isAuth) {
                return NextResponse.redirect(new URL("/", req.url))
            }
            return null
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => true, // We handle redirects in the middleware function above
        },
    }
)

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/auth/:path*", // Intercept auth pages
        "/api/bookings/:path*",
    ],
}
