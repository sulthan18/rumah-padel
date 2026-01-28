import { withAuth } from "next-auth/middleware"

export default withAuth({
    callbacks: {
        authorized: ({ token }) => !!token,
    },
})

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/api/bookings/:path*", // Protect booking APIs
        // "/booking", // Optional: unlock if you want guests to see availability
    ],
}
