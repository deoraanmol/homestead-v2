"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn, listingGalleryImages } from "@/lib/utils";

type Props = {
  imageUrl: string;
  title: string;
  className?: string;
  aspectClass?: string;
};

export function PropertyGallery({
  imageUrl,
  title,
  className,
  aspectClass = "aspect-[16/10] sm:aspect-[16/9]",
}: Props) {
  const images = listingGalleryImages(imageUrl);
  const hasMultiple = images.length > 1;
  const [index, setIndex] = useState(0);
  const current = images[index] ?? images[0];

  const goPrev = useCallback(() => {
    setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  }, [images.length]);

  const goNext = useCallback(() => {
    setIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  }, [images.length]);

  useEffect(() => {
    setIndex(0);
  }, [imageUrl]);

  useEffect(() => {
    if (!hasMultiple) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hasMultiple, goPrev, goNext]);

  return (
    <div className={cn("relative overflow-hidden bg-slate-100", aspectClass, className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={current}
        src={current}
        alt={`${title} — photo ${index + 1}`}
        className="h-full w-full object-cover"
      />

      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/95 p-2.5 text-slate-800 shadow-md transition hover:bg-white"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/95 p-2.5 text-slate-800 shadow-md transition hover:bg-white"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-slate-900/50 px-2.5 py-1.5 backdrop-blur-sm">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={cn(
                  "h-2 w-2 rounded-full transition",
                  i === index ? "bg-white" : "bg-white/40 hover:bg-white/70"
                )}
                aria-label={`View image ${i + 1}`}
              />
            ))}
          </div>
          <span className="absolute left-3 top-3 rounded-lg bg-slate-900/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {index + 1} / {images.length}
          </span>
        </>
      )}
    </div>
  );
}
