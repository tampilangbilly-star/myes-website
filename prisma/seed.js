const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Admin User
  await prisma.user.upsert({
    where: { email: 'admin@myes.com' },
    update: {},
    create: { name: 'Admin M-YES', email: 'admin@myes.com', password: bcrypt.hashSync('myes2026', 12) },
  });

  // Settings
  const settings = [
    { key: 'about_description', valueEn: 'A church-based community dedicated to empowering youth through free English education and spiritual growth.', valueId: 'Komunitas berbasis gereja yang berdedikasi memberdayakan pemuda melalui pendidikan Bahasa Inggris gratis dan pertumbuhan rohani.', group: 'about' },
    { key: 'vision', valueEn: 'To become a leading youth community that produces a generation fluent in English and rooted in faith.', valueId: 'Menjadi komunitas pemuda terkemuka yang menghasilkan generasi fasih berbahasa Inggris dan berakar dalam iman.', group: 'about' },
    { key: 'mission', valueEn: "Provide free English learning programs for youth.\nIntegrate English learning with worship.\nBuild a supportive community.\nEquip youth with language skills.", valueId: "Menyediakan program belajar Bahasa Inggris gratis.\nMengintegrasikan pembelajaran dengan ibadah.\nMembangun komunitas yang mendukung.\nMembekali pemuda dengan keterampilan bahasa.", group: 'about' },
    { key: 'social_instagram', valueEn: 'https://instagram.com/myes.manado', group: 'social' },
    { key: 'social_facebook', valueEn: 'https://facebook.com/myesmanado', group: 'social' },
    { key: 'social_tiktok', valueEn: 'https://tiktok.com/@myesmanado', group: 'social' },
    { key: 'social_whatsapp', valueEn: 'https://chat.whatsapp.com/', group: 'social' },
    { key: 'social_youtube', valueEn: '', group: 'social' },
    { key: 'main_background', valueEn: '', group: 'general' },
    { key: 'contact_email', valueEn: 'myes.manado@gmail.com', valueId: 'myes.manado@gmail.com', group: 'contact' },
    { key: 'contact_phone', valueEn: '+62 xxx-xxxx-xxxx', valueId: '+62 xxx-xxxx-xxxx', group: 'contact' },
    { key: 'contact_address', valueEn: 'Manado, North Sulawesi, Indonesia', valueId: 'Manado, Sulawesi Utara, Indonesia', group: 'contact' },
    { key: 'contact_schedule', valueEn: 'Every Saturday, 17:00 - 18:30 WITA', valueId: 'Setiap Sabtu, 17:00 - 18:30 WITA', group: 'contact' },
  ];
  for (const s of settings) {
    await prisma.setting.upsert({ where: { key: s.key }, update: s, create: s });
  }

  // Default Slides
  const slides = [
    { type: 'activities', sortOrder: 1, overlineEn: 'OUR ACTIVITIES', overlineId: 'KEGIATAN KAMI', titleEn: 'English worship & fellowship every Saturday', titleId: 'Ibadah & persekutuan Bahasa Inggris setiap Sabtu', descriptionEn: 'Join us for free English learning through worship and community.', descriptionId: 'Bergabunglah untuk belajar Bahasa Inggris gratis melalui ibadah dan komunitas.', buttonTextEn: 'Join Now', buttonTextId: 'Bergabung', buttonLink: '/contact', backgroundColor: '#0a1628' },
    { type: 'social_media', sortOrder: 2, overlineEn: 'CONNECT WITH US', overlineId: 'TERHUBUNG DENGAN KAMI', titleEn: 'Follow our social media & join the community', titleId: 'Ikuti media sosial kami & gabung komunitas', descriptionEn: 'Stay updated with our latest activities.', descriptionId: 'Tetap update dengan kegiatan terbaru kami.', backgroundColor: '#0d2847' },
    { type: 'news', sortOrder: 3, overlineEn: 'LATEST NEWS', overlineId: 'BERITA TERBARU', titleEn: 'New batch registration is now open!', titleId: 'Pendaftaran batch baru sudah dibuka!', descriptionEn: 'Free for all youth in Manado.', descriptionId: 'Gratis untuk semua pemuda di Manado.', buttonTextEn: 'Read More', buttonTextId: 'Selengkapnya', buttonLink: '/news', backgroundColor: '#1a5276' },
    { type: 'mission_trip', sortOrder: 4, overlineEn: 'MISSION TRIP', overlineId: 'MISI PERJALANAN', titleEn: 'Island outreach — teaching English across SITARO', titleId: 'Penjangkauan pulau — mengajar Bahasa Inggris di SITARO', descriptionEn: 'Bringing free English education to remote communities.', descriptionId: 'Membawa pendidikan Bahasa Inggris gratis ke komunitas terpencil.', buttonTextEn: 'Learn More', buttonTextId: 'Selengkapnya', buttonLink: '/mission', backgroundColor: '#0d2847' },
  ];
  for (const s of slides) { await prisma.slide.create({ data: s }); }

  // Sample Personnel
  const roles = [['Advisor','Pembina'],['Chairman','Ketua'],['Vice Chairman','Wakil Ketua'],['Secretary','Sekretaris'],['Treasurer','Bendahara'],['Worship Coordinator','Koordinator Ibadah'],['Education Coordinator','Koordinator Pendidikan'],['Media & Documentation','Media & Dokumentasi']];
  for (let i = 0; i < roles.length; i++) {
    await prisma.personnel.create({ data: { name: '-', roleEn: roles[i][0], roleId: roles[i][1], sortOrder: i + 1 } });
  }

  // Sample Programs
  const programs = [
    { emoji: '📖', titleEn: 'English Worship Service', titleId: 'Ibadah Bahasa Inggris', descriptionEn: 'Weekly worship conducted entirely in English.', descriptionId: 'Ibadah mingguan sepenuhnya dalam Bahasa Inggris.', sortOrder: 1 },
    { emoji: '🎓', titleEn: 'English Learning Class', titleId: 'Kelas Bahasa Inggris', descriptionEn: 'Structured English classes covering grammar and conversation.', descriptionId: 'Kelas Bahasa Inggris terstruktur.', sortOrder: 2 },
    { emoji: '🎤', titleEn: 'Public Speaking Practice', titleId: 'Latihan Berbicara', descriptionEn: 'Practice sessions for speeches and presentations.', descriptionId: 'Sesi latihan pidato dan presentasi.', sortOrder: 3 },
    { emoji: '🤝', titleEn: 'Fellowship & Discussion', titleId: 'Persekutuan & Diskusi', descriptionEn: 'Group discussions in English about faith and growth.', descriptionId: 'Diskusi kelompok dalam Bahasa Inggris.', sortOrder: 4 },
  ];
  for (const p of programs) { await prisma.program.create({ data: p }); }

  // Activities
  const worship = [
    { time: '17:00 - 17:15', activityEn: 'Opening Prayer', activityId: 'Doa Pembukaan', descriptionEn: 'Opening prayer and welcome in English', descriptionId: 'Doa pembukaan dalam Bahasa Inggris' },
    { time: '17:15 - 17:45', activityEn: 'Praise & Worship', activityId: 'Pujian & Penyembahan', descriptionEn: 'Singing English worship songs', descriptionId: 'Menyanyikan lagu pujian Bahasa Inggris' },
    { time: '17:45 - 18:15', activityEn: 'Bible Reading & Sharing', activityId: 'Pembacaan & Sharing Firman', descriptionEn: 'Scripture reading in English', descriptionId: 'Pembacaan Alkitab dalam Bahasa Inggris' },
    { time: '18:15 - 18:30', activityEn: 'Closing & Fellowship', activityId: 'Penutup & Persekutuan', descriptionEn: 'Closing prayer and fellowship', descriptionId: 'Doa penutup dan persekutuan' },
  ];
  for (let i = 0; i < worship.length; i++) {
    await prisma.activity.create({ data: { ...worship[i], type: 'worship', sortOrder: i + 1 } });
  }

  const learning = [
    { time: '17:00 - 17:10', activityEn: 'Warm Up', activityId: 'Pemanasan', descriptionEn: 'Ice-breaking and vocabulary review', descriptionId: 'Ice-breaking dan review kosakata' },
    { time: '17:10 - 17:40', activityEn: 'Main Lesson', activityId: 'Pelajaran Utama', descriptionEn: 'Grammar or themed lesson', descriptionId: 'Tata bahasa atau pelajaran tema' },
    { time: '17:40 - 18:10', activityEn: 'Practice Session', activityId: 'Sesi Praktik', descriptionEn: 'Role-play, debate, or presentation', descriptionId: 'Bermain peran, debat, atau presentasi' },
    { time: '18:10 - 18:30', activityEn: 'Wrap Up', activityId: 'Penutup', descriptionEn: 'Summary and assignment', descriptionId: 'Ringkasan dan tugas' },
  ];
  for (let i = 0; i < learning.length; i++) {
    await prisma.activity.create({ data: { ...learning[i], type: 'learning', sortOrder: i + 1 } });
  }

  // Missions
  await prisma.mission.create({ data: { titleEn: 'Community English Camp', titleId: 'Kamp Bahasa Inggris Komunitas', dateLabelEn: 'Upcoming', dateLabelId: 'Akan Datang', descriptionEn: 'A weekend English camp for youth in rural areas.', descriptionId: 'Kamp akhir pekan untuk pemuda di daerah pedesaan.', sortOrder: 1 } });
  await prisma.mission.create({ data: { titleEn: 'Island Outreach', titleId: 'Penjangkauan Pulau', dateLabelEn: 'Annual Program', dateLabelId: 'Program Tahunan', descriptionEn: 'Teaching English on remote islands.', descriptionId: 'Mengajar Bahasa Inggris di pulau terpencil.', sortOrder: 2 } });

  // News
  await prisma.news.create({ data: { titleEn: 'New Batch Registration Open', titleId: 'Pendaftaran Batch Baru Dibuka', tagEn: 'Event', tagId: 'Acara', contentEn: 'Registration for the new batch is now open!', contentId: 'Pendaftaran batch baru sudah dibuka!', publishedAt: new Date() } });

  console.log('✅ Database seeded successfully!');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
