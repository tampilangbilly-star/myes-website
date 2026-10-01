import Icon from "./Icon";
import Lightbox from "./Lightbox";
import YouTubeLite from "./YouTubeLite";
import EmptyState from "./EmptyState";
import Reveal from "./Reveal";
import { formatDate } from "@/lib/format";

/** Galeri kegiatan mingguan: tiap acara punya video sorotan (opsional) + grid foto rapat. */
export default function WeeklyGallery({ galleries = [], lang = "en" }) {
  const id = lang === "id";
  if (!galleries.length)
    return <EmptyState icon="camera" title={id ? "Belum ada momen yang dibagikan." : "No moments shared yet."} text={id ? "Foto kegiatan terbaru akan tampil di sini." : "Photos from our latest gatherings will appear here."} />;

  return (
    <div className="space-y-6 sm:space-y-8">
      {galleries.map((g) => {
        const title = (id && g.titleId) || g.titleEn;
        const photos = (g.photos || []).map((p) => p.image);
        return (
          <Reveal as="article" key={g.id} className="card p-4 sm:p-6">
            <header className="flex flex-col gap-1 border-b border-line pb-4 sm:flex-row sm:items-end sm:justify-between">
              <h3 className="text-xl font-bold leading-snug sm:text-2xl">{title}</h3>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-strong">
                <Icon name="calendar" size={16} /> {formatDate(g.activityDate, lang, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </span>
            </header>
            <div className={g.video && photos.length ? "mt-5 grid gap-6 lg:grid-cols-2" : "mt-5"}>
              {g.video && (
                <div>
                  <p className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-ink-muted">
                    <Icon name="video" size={16} /> {id ? "Video Sorotan" : "Highlight Video"}
                  </p>
                  <YouTubeLite url={g.video} title={title} />
                </div>
              )}
              {photos.length > 0 && (
                <div>
                  <p className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-ink-muted">
                    <Icon name="camera" size={16} /> {id ? "Galeri Foto" : "Photo Gallery"} <span className="text-ink-soft">({photos.length})</span>
                  </p>
                  <Lightbox images={photos} lang={lang} alt={title} limit={9} cols={g.video ? "grid-cols-3" : "grid-cols-3 sm:grid-cols-4 lg:grid-cols-6"} />
                </div>
              )}
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
