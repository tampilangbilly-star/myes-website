import { getLang } from "@/lib/helpers";
import { getSite } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";
import SmartImage from "@/components/SmartImage";

export const metadata = pageMeta("About Us", "Get to know M-YES — a Manado youth community growing in faith and English. Our story, vision, mission and core values.", "/about");

const DEFAULTS = {
  story: {
    en: "Manado Youth English Service (M-YES) was born out of a desire to see a young generation that not only excels in global capacity through English proficiency but also has deep roots of faith in Christ.\n\nWe believe that learning together in a loving community creates a safe, supportive, and enjoyable environment for youth to grow holistically.",
    id: "Manado Youth English Service (M-YES) lahir dari kerinduan untuk melihat generasi muda yang tidak hanya unggul dalam kapasitas global melalui penguasaan bahasa Inggris, tetapi juga memiliki akar iman yang kuat di dalam Kristus.\n\nKami percaya bahwa belajar bersama dalam komunitas yang penuh kasih akan menciptakan lingkungan yang aman, suportif, dan menyenangkan bagi pemuda untuk bertumbuh secara utuh.",
  },
  vision: {
    en: "To become a youth community that grows in faith, serves with love, and develops English proficiency to make a positive impact on society.",
    id: "Menjadi komunitas pemuda yang bertumbuh dalam iman, melayani dengan kasih, dan mengembangkan kemampuan bahasa Inggris untuk memberikan dampak positif bagi masyarakat.",
  },
  mission: {
    en: "To deepen the spiritual life of members through fellowship, discipleship, prayer, and the study of God's Word.\nTo cultivate Christ-like character based on love, integrity, humility, and a heart for service.\nTo provide a supportive, enjoyable, and sustainable environment for learning English among young people.\nTo develop members' communication, leadership, and teamwork skills, preparing them to become influential individuals.",
    id: "Memperdalam kehidupan spiritual anggota melalui persekutuan, pemuridan, doa, dan pendalaman firman Tuhan.\nMenumbuhkan karakter serupa Kristus yang berlandaskan cinta kasih, integritas, kerendahan hati, dan hati yang melayani.\nMenyediakan lingkungan yang suportif, menyenangkan, dan berkelanjutan untuk belajar bahasa Inggris di kalangan pemuda.\nMengembangkan keterampilan komunikasi, kepemimpinan, dan kerja sama anggota untuk mempersiapkan mereka menjadi individu yang berpengaruh.",
  },
};

const VALUES = [
  { icon: "book", en: ["Learn", "Developing our potential through continuous English learning."], id: ["Belajar", "Mengembangkan potensi diri melalui proses belajar bahasa Inggris secara berkelanjutan."] },
  { icon: "sparkle", en: ["Grow", "Growing together in character, faith, and skills as the younger generation."], id: ["Bertumbuh", "Bertumbuh bersama dalam karakter, iman, dan kemampuan sebagai generasi muda."] },
  { icon: "heart", en: ["Impact", "Making a positive influence and becoming a blessing to our community and surroundings."], id: ["Berdampak", "Memberikan pengaruh positif dan menjadi berkat bagi komunitas serta lingkungan sekitar."] },
];

export default async function AboutPage() {
  const lang = await getLang();
  const id = lang === "id";
  const site = await getSite(lang);
  // Teks dari Admin → Pengaturan → Tentang; bila kosong memakai teks bawaan.
  const story = site.get("about_description") || DEFAULTS.story[lang];
  const vision = site.get("vision") || DEFAULTS.vision[lang];
  const missions = (site.get("mission") || DEFAULTS.mission[lang])
    .split("\n")
    .map((s) => s.replace(/^\s*(?:[-•*]|\d+[.)])\s*/, "").trim())
    .filter(Boolean);
  const paragraphs = story.split(/\n+/).filter((p) => p.trim());

  return (
    <>
      <PageHeader
        eyebrow={id ? "Kenali Kami Lebih Dekat" : "Get To Know Us"}
        title={id ? "Tentang M-YES" : "About M-YES"}
        subtitle={id ? "Komunitas pemuda Manado yang bertumbuh dalam iman dan bahasa Inggris." : "A Manado youth community growing in faith and English."}
      />

      {/* CERITA */}
      <section className="section">
        <div className="container-x grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <span className="eyebrow">{id ? "Awal Mula" : "Where It Began"}</span>
            <h2 className="mt-3 text-[1.75rem] font-extrabold sm:text-4xl">{id ? "Cerita Kami" : "Our Story"}</h2>
            <div className="prose-lite mt-5 text-base sm:text-lg">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={120} className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-line shadow-lift">
              <SmartImage src={site.mainBackground || "/sample/venue.webp"} alt={id ? "Kegiatan M-YES" : "M-YES gathering"} fill sizes="(min-width:1024px) 540px, 100vw" className="object-cover" />
            </div>
            <div className="card absolute -bottom-5 left-4 flex items-center gap-3 px-4 py-3 sm:left-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-ink">
                <Icon name="users" />
              </span>
              <span className="text-sm font-semibold leading-tight">
                {id ? "Terbuka untuk" : "Open to"}
                <br />
                <span className="text-ink-muted">{id ? "semua anak muda" : "all young people"}</span>
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* VISI & MISI */}
      <section className="section border-y border-line bg-surface">
        <div className="container-x grid gap-5 lg:grid-cols-[1fr_1.4fr]">
          <Reveal className="relative overflow-hidden rounded-3xl bg-primary p-6 text-primary-ink sm:p-8">
            <div aria-hidden className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/80">{id ? "Arah Kami" : "Our Direction"}</p>
            <h2 className="mt-2 text-3xl font-extrabold text-white">{id ? "Visi" : "Vision"}</h2>
            <p className="relative mt-4 text-lg leading-relaxed text-white/95">{vision}</p>
          </Reveal>
          <Reveal delay={100} className="card p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-strong">{id ? "Langkah Kami" : "Our Steps"}</p>
            <h2 className="mt-2 text-3xl font-extrabold">{id ? "Misi" : "Mission"}</h2>
            <ol className="mt-5 space-y-4">
              {missions.map((m, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft font-display text-sm font-bold text-primary-strong">{i + 1}</span>
                  <p className="pt-1 leading-relaxed text-ink-muted">{m}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* NILAI INTI */}
      <section className="section">
        <div className="container-x">
          <SectionHeading align="center" eyebrow={id ? "Prinsip Kami" : "Our Principles"} title={id ? "Nilai-Nilai Inti" : "Core Values"} />
          <ul className="grid gap-4 sm:grid-cols-3">
            {VALUES.map((v, i) => {
              const [title, text] = v[lang];
              return (
                <Reveal as="li" key={title} delay={i * 90} className="card card-hover p-6 text-center">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                    <Icon name={v.icon} size={26} />
                  </span>
                  <h3 className="mt-4 text-xl font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{text}</p>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}
