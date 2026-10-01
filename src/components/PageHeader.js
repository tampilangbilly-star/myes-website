import Reveal from "./Reveal";

/** Pembuka halaman dalam: terang, tipografi tegas, aksen lembut. */
export default function PageHeader({ eyebrow, title, subtitle, children }) {
  return (
    <header className="relative overflow-hidden border-b border-line bg-surface">
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-16 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />
      <div className="container-x relative py-12 sm:py-16">
        <Reveal>
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h1 className="mt-4 max-w-3xl text-[2rem] font-extrabold leading-[1.1] sm:text-5xl">{title}</h1>
          {subtitle && <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">{subtitle}</p>}
          {children}
        </Reveal>
      </div>
    </header>
  );
}
