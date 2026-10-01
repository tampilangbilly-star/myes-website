import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { safe } from "@/lib/data";
import AdminShell from "@/components/admin/AdminShell";

export const metadata = { title: { default: "Admin", template: "%s · Admin M-YES" }, robots: { index: false, follow: false } };

/**
 * Proteksi admin di SERVER (bukan hanya di browser):
 * proxy.js sudah mengarahkan tamu ke /admin/login, dan layout ini memeriksa ulang sesi
 * sebelum merender halaman admin apa pun. Semua API juga memeriksa sesi sendiri.
 */
export default async function AdminLayout({ children }) {
  const pathname = (await headers()).get("x-pathname") || "";
  if (pathname.startsWith("/admin/login")) return children;

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect(`/admin/login?callbackUrl=${encodeURIComponent(pathname || "/admin")}`);

  const unread = await safe(prisma.contactMessage.count({ where: { isRead: false } }), 0);
  return (
    <AdminShell user={{ name: session.user.name || "Admin", email: session.user.email }} unread={unread}>
      {children}
    </AdminShell>
  );
}
