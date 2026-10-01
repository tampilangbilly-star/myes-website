import Link from "next/link";
import prisma from "@/lib/prisma";
import { safe } from "@/lib/data";
import Icon from "@/components/Icon";
import { AdminTitle } from "@/components/admin/ResourceList";

export const metadata = { title: "Dashboard" };

const fmt = (v, withTime = false) =>
  v ? new Date(v).toLocaleString("id-ID", { day: "numeric", month: "short", ...(withTime ? { hour: "2-digit", minute: "2-digit" } : { year: "numeric" }), timeZone: "Asia/Makassar" }) : "—";

export default async function Dashboard() {
  const [slides, personnel, programs, news, missions, speakers, galleries, care, moments, unread, messages, latestNews, latestGallery] = await Promise.all([
    safe(prisma.slide.count({ where: { isActive: true } }), 0),
    safe(prisma.personnel.count({ where: { isActive: true } }), 0),
    safe(prisma.program.count({ where: { isActive: true } }), 0),
    safe(prisma.news.count({ where: { isActive: true } }), 0),
    safe(prisma.mission.count({ where: { isActive: true } }), 0),
    safe(prisma.guestSpeaker.count({ where: { isActive: true } }), 0),
    safe(prisma.activityGallery.count(), 0),
    safe(prisma.careActivity.count(), 0),
    safe(prisma.homeMoment.count({ where: { isActive: true } }), 0),
    safe(prisma.contactMessage.count({ where: { isRead: false } }), 0),
    safe(prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 5 })),
    safe(prisma.news.findMany({ orderBy: { updatedAt: "desc" }, take: 4 })),
    safe(prisma.activityGallery.findMany({ orderBy: { createdAt: "desc" }, take: 3, include: { _count: { select: { photos: true } } } })),
  ]);

  const stats = [
    { href: "/admin/messages", label: "Pesan belum dibaca", value: unread, icon: "inbox", highlight: unread > 0 },
    { href: "/admin/slides", label: "Slide aktif", value: slides, icon: "image" },
    { href: "/admin/news", label: "Berita aktif", value: news, icon: "news" },
    { href: "/admin/guest-speakers", label: "Guest speaker", value: speakers, icon: "mic" },
    { href: "/admin/programs", label: "Program", value: programs, icon: "book" },
    { href: "/admin/personnel", label: "Personalia", value: personnel, icon: "users" },
    { href: "/admin/weekly-activities", label: "Galeri mingguan", value: galleries, icon: "video" },
    { href: "/admin/missions", label: "Mission trip", value: missions, icon: "plane" },
    { href: "/admin/care", label: "Kegiatan Care", value: care, icon: "heart" },
    { href: "/admin/home-moments", label: "Momen beranda", value: moments, icon: "camera" },
  ];

  const quick = [
    { href: "/admin/news/new", label: "Tulis berita", icon: "news" },
    { href: "/admin/weekly-activities", label: "Unggah galeri", icon: "camera" },
    { href: "/admin/slides/new", label: "Slide baru", icon: "image" },
    { href: "/admin/guest-speakers", label: "Guest speaker", icon: "mic" },
  ];

  return (
    <>
      <AdminTitle title="Dashboard" subtitle="Ringkasan konten website M-YES." />

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <li key={s.href}>
            <Link href={s.href} className={`card card-hover flex h-full flex-col gap-3 p-4 ${s.highlight ? "border-primary/40 bg-primary-soft/40" : ""}`}>
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.highlight ? "bg-primary text-primary-ink" : "bg-primary-soft text-primary"}`}>
                <Icon name={s.icon} size={20} />
              </span>
              <span>
                <span className="block font-display text-2xl font-extrabold tabular-nums sm:text-3xl">{s.value}</span>
                <span className="block text-xs font-medium text-ink-muted sm:text-sm">{s.label}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <section className="mt-6" aria-labelledby="quick">
        <h2 id="quick" className="sr-only">
          Aksi cepat
        </h2>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {quick.map((q) => (
            <li key={q.label}>
              <Link href={q.href} className="btn-soft w-full justify-start">
                <Icon name="plus" size={18} /> {q.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <section className="card p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold">Pesan terbaru</h2>
            <Link href="/admin/messages" className="btn-ghost btn-sm">
              Semua <Icon name="arrow-right" size={16} />
            </Link>
          </div>
          {messages.length ? (
            <ul className="divide-y divide-line">
              {messages.map((m) => (
                <li key={m.id} className="flex gap-3 py-3">
                  <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${m.isRead ? "bg-line" : "bg-primary"}`} />
                  <div className="min-w-0 flex-1">
                    <p className="flex justify-between gap-2">
                      <span className={`truncate ${m.isRead ? "font-semibold" : "font-extrabold"}`}>{m.name}</span>
                      <span className="shrink-0 text-xs text-ink-soft">{fmt(m.createdAt, true)}</span>
                    </p>
                    <p className="line-clamp-1 text-sm text-ink-muted">{m.message}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-6 text-center text-sm text-ink-soft">Belum ada pesan.</p>
          )}
        </section>

        <section className="card p-4 sm:p-5">
          <h2 className="mb-3 text-lg font-bold">Aktivitas konten terbaru</h2>
          <ul className="divide-y divide-line">
            {latestNews.map((n) => (
              <li key={`n${n.id}`}>
                <Link href={`/admin/news/${n.id}`} className="flex items-center gap-3 py-3 hover:text-primary">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                    <Icon name="news" size={17} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{n.titleEn}</span>
                    <span className="block text-xs text-ink-soft">Berita · diperbarui {fmt(n.updatedAt)}</span>
                  </span>
                </Link>
              </li>
            ))}
            {latestGallery.map((g) => (
              <li key={`g${g.id}`}>
                <Link href="/admin/weekly-activities" className="flex items-center gap-3 py-3 hover:text-primary">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                    <Icon name="camera" size={17} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{g.titleEn}</span>
                    <span className="block text-xs text-ink-soft">
                      Galeri · {g._count.photos} foto · {fmt(g.activityDate)}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
            {!latestNews.length && !latestGallery.length && <li className="py-6 text-center text-sm text-ink-soft">Belum ada konten.</li>}
          </ul>
        </section>
      </div>
    </>
  );
}
