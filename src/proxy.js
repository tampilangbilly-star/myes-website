import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Proxy (pengganti middleware.js di Next.js 16).
 * Semua halaman /admin (termasuk /admin/care yang sebelumnya terlewat) wajib login,
 * kecuali /admin/login. Pengecekan kedua dilakukan lagi di server (admin/layout.js & setiap API).
 */
export async function proxy(req) {
  const { pathname } = req.nextUrl;
  const headers = new Headers(req.headers);
  headers.set("x-pathname", pathname);

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      const url = new URL("/admin/login", req.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|webp|svg|gif|ico|txt|xml)$).*)"],
};
