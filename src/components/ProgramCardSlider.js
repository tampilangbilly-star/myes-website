import ImageFader from "./ImageFader";

/** Foto kartu program (fade otomatis) atau emoji bila belum ada foto. */
export default function ProgramCardSlider({ images = [], emoji = "📖", title = "Program", className = "aspect-[4/3]" }) {
  if (!images.length)
    return (
      <div className={`flex items-center justify-center bg-primary-soft text-5xl ${className}`} aria-hidden>
        {emoji}
      </div>
    );
  return <ImageFader images={images} alt={title} className={`bg-line ${className}`} sizes="(min-width:1024px) 360px, (min-width:640px) 50vw, 100vw" />;
}
