import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AdminTitle } from "@/components/admin/ResourceList";
import PasswordForm from "@/components/admin/PasswordForm";

export const metadata = { title: "Akun" };

export default async function Page() {
  const session = await getServerSession(authOptions);
  return (
    <>
      <AdminTitle title="Akun & Password" subtitle={`Masuk sebagai ${session?.user?.email}`} />
      <div className="card max-w-xl p-4 sm:p-6">
        <h2 className="text-lg font-bold">Ganti password</h2>
        <p className="mt-1 text-sm text-ink-muted">Gunakan minimal 10 karakter, campuran huruf, angka, dan simbol. Jangan pakai password bawaan.</p>
        <div className="mt-5">
          <PasswordForm />
        </div>
      </div>
    </>
  );
}
