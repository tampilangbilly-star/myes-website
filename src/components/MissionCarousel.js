import ImageFader from "./ImageFader";

/** Foto mission trip — utuh (tidak terpotong), berganti tiap 3 detik. */
export default function MissionCarousel({ images = [], title = "Mission Trip" }) {
  if (!images.length) return null;
  return <ImageFader images={images} alt={title} fit="contain" interval={3000} className="aspect-[4/3] rounded-2xl bg-bg sm:aspect-[16/10]" sizes="(min-width:1024px) 640px, 100vw" />;
}
