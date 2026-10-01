import prisma from "@/lib/prisma";
import { getLang, t } from "@/lib/helpers";
import { safe } from "@/lib/data";
import { pageMeta } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import SmartImage from "@/components/SmartImage";
import EmptyState from "@/components/EmptyState";
import Icon from "@/components/Icon";

export const metadata = pageMeta("Personnel", "The M-YES ministry structure — centered on Christ and driven by love.", "/personnel");

const GROUP_TITLES = {
  pembina: { id: "Dewan Pembina", en: "Board of Advisors" },
  pengurus: { id: "Pengurus Inti", en: "Core Committee" },
  bidang: { id: "Bidang-Bidang", en: "Divisions" },
  lainnya: { id: "Lainnya", en: "Others" },
};

export default async function PersonnelPage() {
  const lang = await getLang();
  const id = lang === "id";
  const items = await safe(prisma.personnel.findMany({ where: { isActive: true }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] }));

  // Pengelompokan sama seperti sebelumnya (berdasarkan kategori di admin)
  const pembina = { leaders: [], members: [] };
  const pengurus = [];
  const bidang = [];
  const lainnya = [];
  for (const p of items) {
    const m = { ...p, displayRole: t(p, "role", lang) || (id ? "Anggota" : "Member") };
    const cat = p.category || "Lainnya";
    if (cat === "Pembina") (/(ketua|sekretaris)/i.test(p.roleId || "") || /(ketua|sekretaris|chair|secretary)/i.test(p.roleEn) ? pembina.leaders : pembina.members).push(m);
    else if (cat === "Pengurus Inti") pengurus.push(m);
    else if (cat === "Bidang-Bidang") bidang.push(m);
    else lainnya.push(m);
  }

  return (
    <>
      <PageHeader
        eyebrow={id ? "Tim Kami" : "Our Team"}
        title={id ? "Personalia Organisasi" : "Organization Personnel"}
        subtitle={id ? "Struktur pelayanan kami yang berpusat pada Kristus dan digerakkan oleh kasih." : "Our ministry structure, centered on Christ and driven by love."}
      />

      <section className="section">
        <div className="container-x">
          {/* 1. TUHAN YESUS — Kepala organisasi, selalu paling atas */}
          <Reveal className="mx-auto max-w-2xl text-center">
            <div className="relative mx-auto overflow-hidden rounded-3xl bg-ink shadow-lift ring-4 ring-gold/30">
              <div className="relative aspect-[16/9]">
                <SmartImage src="/jesus-christ.jpg" alt="Jesus Christ" fill priority sizes="(min-width:768px) 672px, 100vw" className="object-cover" />
              </div>
            </div>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-gold/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-warning">
              <Icon name="sparkle" size={14} /> {id ? "Kepala" : "The Head"}
            </p>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Jesus Christ</h2>
            <p className="mt-2 text-lg text-ink-muted">{id ? "Kepala Gereja & Pusat Pelayanan" : "Head of the Church & Center of Ministry"}</p>
            <p className="mt-2 text-sm italic text-ink-soft">{id ? "“Dialah kepala tubuh, yaitu jemaat.” — Kolose 1:18" : "“And He is the head of the body, the church.” — Colossians 1:18"}</p>
          </Reveal>

          <div aria-hidden className="mx-auto my-12 h-12 w-px bg-gradient-to-b from-gold/60 to-transparent sm:my-16" />

          {!items.length && <EmptyState icon="users" title={id ? "Data personalia belum tersedia." : "No personnel yet."} />}

          {(pembina.leaders.length > 0 || pembina.members.length > 0) && (
            <Group title={GROUP_TITLES.pembina[lang]}>
              {pembina.leaders.length > 0 && <RectGrid people={pembina.leaders} lang={lang} />}
              {pembina.members.length > 0 && <CircleGrid people={pembina.members} className={pembina.leaders.length ? "mt-8" : ""} />}
            </Group>
          )}
          {pengurus.length > 0 && (
            <Group title={GROUP_TITLES.pengurus[lang]}>
              <RectGrid people={pengurus} lang={lang} />
            </Group>
          )}
          {bidang.length > 0 && (
            <Group title={GROUP_TITLES.bidang[lang]}>
              <CircleGrid people={bidang} />
            </Group>
          )}
          {lainnya.length > 0 && (
            <Group title={GROUP_TITLES.lainnya[lang]}>
              <CircleGrid people={lainnya} />
            </Group>
          )}
        </div>
      </section>
    </>
  );
}

function Group({ title, children }) {
  return (
    <section className="mb-14 last:mb-0 sm:mb-20">
      <Reveal className="mb-6 flex items-center gap-4 sm:mb-8">
        <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-transparent to-line" />
        <h2 className="rounded-full border border-line bg-surface px-5 py-2 text-center text-sm font-extrabold uppercase tracking-[0.16em] shadow-card sm:text-base">{title}</h2>
        <span aria-hidden className="h-px flex-1 bg-gradient-to-l from-transparent to-line" />
      </Reveal>
      {children}
    </section>
  );
}

function Avatar({ person, sizes, className }) {
  return person.photo ? (
    <SmartImage src={person.photo} alt={person.name} fill sizes={sizes} className={className} />
  ) : (
    <span className="absolute inset-0 flex items-center justify-center bg-primary-soft text-primary">
      <Icon name="user" size={40} />
    </span>
  );
}

/** Kartu persegi (pimpinan): 2 kolom di HP. */
function RectGrid({ people, lang }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
      {people.map((p, i) => {
        const bio = t(p, "bio", lang);
        return (
          <Reveal as="li" key={p.id} delay={(i % 4) * 70} className="card card-hover overflow-hidden">
            <div className="relative aspect-[4/5] bg-line">
              <Avatar person={p} sizes="(min-width:1024px) 270px, (min-width:640px) 33vw, 50vw" className="object-cover" />
            </div>
            <div className="p-3 sm:p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-primary-strong sm:text-xs">{p.displayRole}</p>
              <h3 className="mt-1 text-[0.95rem] font-bold leading-snug sm:text-lg">{p.name}</h3>
              {bio && <p className="mt-1.5 line-clamp-3 hidden text-sm leading-relaxed text-ink-muted sm:block">{bio}</p>}
            </div>
          </Reveal>
        );
      })}
    </ul>
  );
}

/** Foto bulat (anggota): 3 kolom di HP. */
function CircleGrid({ people, className = "" }) {
  return (
    <ul className={`grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 sm:gap-x-5 lg:grid-cols-6 ${className}`}>
      {people.map((p, i) => (
        <Reveal as="li" key={p.id} delay={(i % 6) * 50} className="text-center">
          <div className="relative mx-auto aspect-square w-full max-w-[128px] overflow-hidden rounded-full bg-line ring-4 ring-surface shadow-card">
            <Avatar person={p} sizes="128px" className="object-cover" />
          </div>
          <h3 className="mt-3 text-sm font-bold leading-snug sm:text-base">{p.name}</h3>
          <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary-strong sm:text-xs">{p.displayRole}</p>
        </Reveal>
      ))}
    </ul>
  );
}
