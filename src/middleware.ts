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
            authorized: ({ token, req }) => {
                const isAuthPage = req.nextUrl.pathname.startsWith("/auth")
                const isPublicBookingApi = req.nextUrl.pathname.startsWith("/api/bookings/available")

                // Allow access to auth pages so middleware function can handle them
                if (isAuthPage || isPublicBookingApi) {
                    return true
                }

                // Protect other matched routes (dashboard, api)
                return !!token
            },
        },
    }
)

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/auth/:path*",
        "/api/bookings/:path*",
    ],
}
