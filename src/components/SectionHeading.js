import Reveal from "./Reveal";

export default function SectionHeading({ eyebrow, title, subtitle, align = "left", action }) {
  return (
    <Reveal className={`mb-8 flex flex-col gap-4 sm:mb-10 ${align === "center" ? "items-center text-center" : "sm:flex-row sm:items-end sm:justify-between"}`}>
      <div className={align === "center" ? "max-w-2xl" : "max-w-2xl"}>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2 className="mt-3 text-[1.75rem] font-extrabold leading-tight sm:text-4xl">{title}</h2>
        {subtitle && <p className="mt-3 leading-relaxed text-ink-muted">{subtitle}</p>}
      </div>
      {action}
    </Reveal>
  );
}
