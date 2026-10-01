"use client";
import { useState } from "react";
import Icon from "./Icon";
import { youtubeId } from "@/lib/youtube";

/** Embed YouTube ringan: iframe baru dimuat setelah diklik (hemat data & cepat di HP). */
export default function YouTubeLite({ url, title = "Video" }) {
  const [play, setPlay] = useState(false);
  const id = youtubeId(url);
  if (!id) return null;
  return (
    <div className="relative aspect-video overflow-hidden rounded-xl bg-ink">
      {play ? (
        <iframe className="absolute inset-0 h-full w-full" src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`} title={title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
      ) : (
        <button type="button" onClick={() => setPlay(true)} className="group absolute inset-0 h-full w-full" aria-label={`Play: ${title}`}>
          <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" className="h-full w-full object-cover opacity-90 transition group-hover:opacity-100" />
          <span className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-lift transition group-hover:scale-105">
            <Icon name="play" size={26} />
          </span>
        </button>
      )}
    </div>
  );
}
