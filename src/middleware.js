import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/admin/login", // Arahkan ke sini jika belum login
  },
});

// Tentukan rute mana saja yang harus dikunci dengan password
export const config = {
  matcher: [
    "/admin",
    "/admin/settings",
    "/admin/personnel/:path*",
    "/admin/news/:path*",
    "/admin/activities/:path*",
    "/admin/missions/:path*",
    "/admin/programs/:path*",
    "/admin/slides/:path*",
    "/admin/guest-speakers/:path*",
    "/admin/messages/:path*",
    "/admin/weekly-activities/:path*",
  ],
};
