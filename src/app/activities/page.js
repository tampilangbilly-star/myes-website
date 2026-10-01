import prisma from "@/lib/prisma";
import { getLang, t } from "@/lib/helpers";
import { getSite } from "@/lib/site";
import { safe } from "@/lib/data";
import { pageMeta } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import SmartImage from "@/components/SmartImage";
import WeeklyGallery from "@/components/WeeklyGallery";
import Icon from "@/components/Icon";

export const metadata = pageMeta("Weekly Activities", "M-YES Friday: interactive English learning followed by worship together. See the schedule and gallery.", "/activities");

// Dua sesi utama (seperti sebelumnya). Rundown detail diambil dari Admin → Jadwal (tipe learning / worship).
const SESSIONS = [
  { type: "learning", time: "17:30 - 18:30", en: "English Learning", id: "English Learning", desc: { en: "An interactive and fun session to sharpen your English grammar, vocabulary, and conversation skills.", id: "Sesi interaktif dan menyenangkan untuk mengasah kemampuan tata bahasa, kosakata, dan percakapan bahasa Inggris Anda." } },
  { type: "worship", time: "18:30 - selesai", en: "Worship Together", id: "Worship Together", desc: { en: "An intimate time to praise, worship, and listen to the truth of God's Word together with the community.", id: "Waktu yang intim untuk memuji, menyembah, dan mendengarkan kebenaran Firman Tuhan bersama komunitas." } },
];

// "17:00 - 17:10" + ... + "17:45 - 18:15" → "17:00 - 18:15"
function rangeOf(items) {
  const times = items.flatMap((a) => a.time.match(/\d{1,2}[:.]\d{2}/g) || []);
  if (!times.length) return "";
  return times.length > 1 ? `${times[0]} - ${times[times.length - 1]}` : times[0];
}

export default async function ActivitiesPage() {
  const lang = await getLang();
  const id = lang === "id";
  const site = await getSite(lang);
  const [schedule, galleries] = await Promise.all([
    safe(prisma.activity.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }] })),
    safe(prisma.activityGallery.findMany({ where: { isActive: true }, include: { photos: { orderBy: { id: "asc" } } }, orderBy: { activityDate: "desc" } })),
  ]);
  const sessions = SESSIONS;

  return (
    <>
      <PageHeader
        eyebrow={id ? "Setiap Jumat" : "Every Friday"}
        title="M-YES Friday"
        subtitle={id ? "Akhiri pekanmu dengan bertumbuh bersama kami setiap hari Jumat melalui pembelajaran bahasa Inggris interaktif dan persekutuan rohani yang hangat." : "Wrap up your week and grow with us every Friday through interactive English learning and warm spiritual fellowship."}
      />

      <section className="section">
        <div className="container-x">
          <ol className="grid gap-5 md:grid-cols-2">
            {sessions.map((s, i) => {
              const items = schedule.filter((a) => a.type === s.type);
              return (
                <Reveal as="li" key={s.type} delay={i * 100} className="card card-hover flex flex-col overflow-hidden">
                  <div className="relative aspect-[16/9] bg-line">
                    <SmartImage src={s.type === "learning" ? "/learn-img.jpeg" : "/worship-img.jpeg"} alt="" fill sizes="(min-width:768px) 560px, 100vw" className="object-cover" />
                    <span className="absolute left-3 top-3 rounded-full bg-surface/95 px-3 py-1 text-xs font-bold text-primary-strong shadow-card">{id ? ["Sesi Pertama", "Sesi Kedua"][i] : ["First Session", "Second Session"][i]}</span>
                  </div>
                  <div className="flex-1 p-5 sm:p-6">
                    <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary-strong">
                      <Icon name="clock" size={16} /> {rangeOf(items) || s.time} WITA
                    </p>
                    <h2 className="mt-2 flex items-center gap-2 text-2xl font-extrabold">
                      <Icon name={s.type === "learning" ? "book" : "heart"} className="text-primary" /> {s[lang]}
                    </h2>
                    <p className="mt-2 leading-relaxed text-ink-muted">{s.desc[lang]}</p>
                    {items.length > 0 && (
                      <ol className="mt-5 space-y-0 border-t border-line pt-4">
                        {items.map((a) => (
                          <li key={a.id} className="relative flex gap-3 pb-4 pl-5 last:pb-0 before:absolute before:left-[5px] before:top-2 before:h-full before:w-px before:bg-line last:before:hidden">
                            <span aria-hidden className="absolute left-0 top-1.5 h-[11px] w-[11px] rounded-full border-2 border-primary bg-surface" />
                            <div className="min-w-0">
                              <p className="text-xs font-bold tabular-nums text-primary-strong">{a.time}</p>
                              <p className="font-semibold">{t(a, "activity", lang)}</p>
                              {t(a, "description", lang) && <p className="text-sm text-ink-muted">{t(a, "description", lang)}</p>}
                            </div>
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </ol>
          <Reveal className="mt-5 flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <p className="flex items-start gap-3 text-sm text-ink-muted">
              <Icon name="pin" className="mt-0.5 shrink-0 text-primary" />
              <span>
                <strong className="text-ink">M-YES Basecamp</strong> — {site.contact.address}
              </span>
            </p>
            <a href={site.contact.mapUrl} target="_blank" rel="noopener noreferrer" className="btn-outline btn-sm shrink-0">
              <Icon name="external" size={16} /> Google Maps
            </a>
          </Reveal>
        </div>
      </section>

      <section className="section border-t border-line bg-surface">
        <div className="container-x">
          <SectionHeading eyebrow={id ? "Momen Kami" : "Our Moments"} title={id ? "Galeri Kegiatan" : "Activities Gallery"} />
          <WeeklyGallery galleries={galleries} lang={lang} />
        </div>
      </section>
    </>
  );
}
