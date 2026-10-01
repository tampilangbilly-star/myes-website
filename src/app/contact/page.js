import { getLang } from "@/lib/helpers";
import { getSite } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import Icon from "@/components/Icon";

export const metadata = pageMeta("Contact Us", "Get in touch with M-YES via WhatsApp, email, Instagram or visit our basecamp in Manado.", "/contact");

export default async function ContactPage() {
  const lang = await getLang();
  const id = lang === "id";
  const site = await getSite(lang);
  const c = site.contact;
  const waText = encodeURIComponent(`Halo kak ${c.adminName}, saya ingin bertanya seputar komunitas M-YES!`);

  const channels = [
    { icon: "whatsapp", label: "WhatsApp", value: c.phone, href: `https://wa.me/${c.phoneDigits}?text=${waText}`, tone: "bg-[#25D366]/15 text-[#128C3E]", external: true },
    { icon: "mail", label: "Email", value: c.email, href: `mailto:${c.email}`, tone: "bg-danger/10 text-danger" },
    site.socials.instagram && { icon: "instagram", label: "Instagram", value: "@" + (site.socials.instagram.split("/").filter(Boolean).pop() || "m-yes"), href: site.socials.instagram, tone: "bg-[#C13584]/10 text-[#C13584]", external: true },
    site.socials.whatsapp && { icon: "users", label: id ? "Grup WhatsApp" : "WhatsApp Group", value: id ? "Gabung komunitas" : "Join the community", href: site.socials.whatsapp, tone: "bg-primary-soft text-primary", external: true },
  ].filter(Boolean);

  return (
    <>
      <PageHeader eyebrow={id ? "Hubungi Kami" : "Get In Touch"} title={id ? "Hubungi Kami" : "Contact Us"} subtitle={id ? "Pilih jalur komunikasi di bawah ini untuk terhubung dengan kami:" : "Choose a communication channel below to connect with us:"} />

      <section className="section">
        <div className="container-x">
          <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {channels.map((ch, i) => (
              <Reveal as="li" key={ch.label} delay={i * 60}>
                <a href={ch.href} target={ch.external ? "_blank" : undefined} rel={ch.external ? "noopener noreferrer" : undefined} className="card card-hover flex h-full flex-col gap-3 p-4 sm:p-5">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${ch.tone}`}>
                    <Icon name={ch.icon} />
                  </span>
                  <span>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">{ch.label}</span>
                    <span className="mt-0.5 block break-words text-sm font-bold sm:text-base">{ch.value}</span>
                  </span>
                </a>
              </Reveal>
            ))}
          </ul>

          <div className="mt-8 grid gap-5 lg:mt-10 lg:grid-cols-[1.1fr_1fr]">
            <Reveal className="card p-5 sm:p-8">
              <h2 className="text-2xl font-extrabold">{id ? "Atau Kirim Pesan Langsung" : "Or Send a Direct Message"}</h2>
              <p className="mt-1.5 text-ink-muted">{id ? "Isi formulir di bawah ini dan tim kami akan segera merespons Anda." : "Fill out the form below and our team will get back to you shortly."}</p>
              <div className="mt-6">
                <ContactForm lang={lang} />
              </div>
            </Reveal>
            <Reveal delay={100} className="card flex flex-col overflow-hidden">
              <iframe src={c.mapEmbed} title={id ? "Peta lokasi M-YES" : "M-YES location map"} className="block aspect-[4/3] w-full border-0 lg:aspect-auto lg:flex-1" loading="lazy" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
              <div className="space-y-3 p-5 sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-strong">{id ? "Lokasi" : "Location"} · {c.area}</p>
                <p className="flex gap-3 text-ink-muted">
                  <Icon name="pin" className="mt-0.5 shrink-0 text-primary" /> {c.address}
                </p>
                {c.schedule && (
                  <p className="flex gap-3 text-ink-muted">
                    <Icon name="clock" className="mt-0.5 shrink-0 text-primary" /> {c.schedule}
                  </p>
                )}
                <a href={c.mapUrl} target="_blank" rel="noopener noreferrer" className="btn-outline w-full">
                  <Icon name="external" size={18} /> {id ? "Buka di Google Maps" : "Open in Google Maps"}
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
