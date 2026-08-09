export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/calculator/:path*",
    "/history/:path*",
    "/topup/:path*",
    "/admin/:path*",
  ],
};
