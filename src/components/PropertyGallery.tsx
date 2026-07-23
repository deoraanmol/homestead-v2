"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { PropertyGalleryImagesSlideshow } from "./PropertyGalleryImagesSlideshow";

type Props = {
  imageUrls?: string[];
  title: string;
  className?: string;
  aspectClass?: string;
};

export function PropertyGallery({
  imageUrls,
  title,
  className,
  aspectClass = "aspect-[16/10] sm:aspect-[16/9]",
}: Props) {
  const images = imageUrls || [];
  const hasMultiple = images.length > 1;
  const [index, setIndex] = useState(0);
  const [isSlideshowOpen, setIsSlideshowOpen] = useState(false);
  const current = images[index] ?? images[0];

  const goPrev = useCallback(() => {
    setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  }, [images.length]);

  const goNext = useCallback(() => {
    setIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  }, [images.length]);

  useEffect(() => {
    setIndex(0);
  }, [imageUrls]);

  useEffect(() => {
    if (!hasMultiple) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hasMultiple, goPrev, goNext]);

  const openSlideshow = (i:number) => {
    setIndex(i);
    setIsSlideshowOpen(true);
  };

  return (
    <div className={cn("relative overflow-hidden bg-slate-100 rounded-xl", className)}>

      {/* Desktop gallery */}
      <div className="hidden md:block">

        {images.length === 1 && (
          <div className="h-[520px] overflow-hidden rounded-xl">
            <div 
              className="h-[520px] overflow-hidden rounded-xl cursor-pointer"
              onClick={() => openSlideshow(0)}
            >
              <img
                src={images[0]}
                alt={`${title} — photo 1`}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        )}


        {images.length === 2 && (
          <div className="grid grid-cols-2 gap-2 h-[520px]">

            {images.map((img, i) => (
              <div
                key={img}
                className="overflow-hidden rounded-xl cursor-pointer"
                onClick={() => openSlideshow(i)}
              >
                <img
                  src={img}
                  alt={`${title} — photo ${i + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}

          </div>
        )}


        {images.length >= 3 && (
          <div className="grid grid-cols-[2fr_1fr] gap-2 h-[520px]">

            {/* Main image */}
            <div
              className="overflow-hidden rounded-xl cursor-pointer"
              onClick={() => openSlideshow(0)}
            >
              <img
                src={images[0]}
                alt={`${title} — photo 1`}
                className="h-full w-full object-cover"
              />
            </div>


            {/* Right side */}
            <div className="grid grid-rows-3 gap-2 min-h-0">

              {images.slice(1, 4).map((img, i) => (
                <div
                  key={img}
                  className="relative min-h-0 overflow-hidden rounded-xl cursor-pointer group"
                  onClick={() => openSlideshow(i + 1)}
                >
                  <img
                    src={img}
                    alt={`${title} — photo ${i + 2}`}
                    className="
                      absolute inset-0
                      h-full w-full
                      object-cover
                      transition-transform
                      duration-300
                      group-hover:scale-105
                    "
                  />

                  {i === 2 && images.length > 4 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <span className="text-lg font-semibold text-white">
                        +{images.length - 4} photos
                      </span>
                    </div>
                  )}
                </div>
              ))}

            </div>

          </div>
        )}
      </div>


      {/* Mobile gallery */}
      <div
        className={cn(
          "md:hidden relative overflow-hidden cursor-pointer",
          aspectClass
        )}
        onClick={() => openSlideshow(index)}
      >

        <img
          src={current}
          alt={`${title} — photo ${index + 1}`}
          className="h-full w-full object-cover"
        />

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2"
            >
              <ChevronLeft className="h-5 w-5"/>
            </button>

            <button
              type="button"
              onClick={goNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2"
            >
              <ChevronRight className="h-5 w-5"/>
            </button>
          </>
        )}

      </div>
      {isSlideshowOpen && (
        <PropertyGalleryImagesSlideshow
          images={images}
          index={index}
          title={title}
          onClose={() => setIsSlideshowOpen(false)}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}
    </div>
  );
}
