const { PrismaClient } = require("@prisma/client");
// Catatan: Jika proyek Anda menggunakan 'bcrypt', ubah 'bcryptjs' di bawah menjadi 'bcrypt'
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const email = "admin@myes.com"; // Sesuaikan dengan email login yang Anda inginkan di gambar
  const password = "password123"; // Sesuaikan dengan password yang Anda inginkan

  // Mengacak password demi keamanan (sesuai standar NextAuth)
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email: email },
    update: { password: hashedPassword }, // Jika email sudah ada, cukup perbarui passwordnya
    create: {
      name: "Billy Tampilang", // Nama admin
      email: email,
      password: hashedPassword,
    },
  });

  console.log(
    "✅ Berhasil! Akun admin telah dibuat/diperbarui dengan email:",
    user.email,
  );
}

main()
  .catch((e) => {
    console.error("❌ Terjadi kesalahan:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
