import Icon from "./Icon";
import Lightbox from "./Lightbox";
import YouTubeLite from "./YouTubeLite";
import EmptyState from "./EmptyState";
import Reveal from "./Reveal";
import { formatDate } from "@/lib/format";

/** Galeri M-YES Care: judul, tanggal, deskripsi, foto (lightbox + unduh) dan video YouTube. */
export default function CareGallery({ activities = [], lang = "en" }) {
  const id = lang === "id";
  if (!activities.length) return <EmptyState icon="heart" title={id ? "Belum ada kegiatan M-YES Care." : "No M-YES Care activities yet."} />;

  return (
    <div className="space-y-6 sm:space-y-8">
      {activities.map((item) => {
        const title = (id && item.titleId) || item.titleEn;
        const description = (id && item.descriptionId) || item.descriptionEn;
        const images = (item.media || []).filter((m) => m.type === "IMAGE").map((m) => m.url);
        const videos = (item.media || []).filter((m) => m.type === "YOUTUBE");
        return (
          <Reveal as="article" key={item.id} className="card p-4 sm:p-7">
            <h3 className="text-xl font-bold leading-snug sm:text-2xl">{title}</h3>
            <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-medium text-primary-strong">
              <Icon name="calendar" size={16} /> {formatDate(item.activityDate, lang)}
            </p>
            {description && <p className="mt-4 whitespace-pre-line leading-relaxed text-ink-muted">{description}</p>}
            {images.length > 0 && (
              <div className="mt-6">
                <p className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-ink-muted">
                  <Icon name="camera" size={16} /> {id ? "Galeri Foto" : "Photo Gallery"}
                </p>
                <Lightbox images={images} lang={lang} alt={title} limit={12} />
              </div>
            )}
            {videos.length > 0 && (
              <div className="mt-6">
                <p className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-ink-muted">
                  <Icon name="video" size={16} /> {id ? "Video Kegiatan" : "Activity Videos"}
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {videos.map((v) => (
                    <YouTubeLite key={v.id} url={v.url} title={title} />
                  ))}
                </div>
              </div>
            )}
          </Reveal>
        );
      })}
    </div>
  );
}
