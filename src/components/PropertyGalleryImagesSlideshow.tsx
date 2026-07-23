"use client";

import { useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type Props = {
  images: string[];
  index: number;
  title: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export function PropertyGalleryImagesSlideshow({
  images,
  index,
  title,
  onClose,
  onPrev,
  onNext,
}: Props) {

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    }

    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose, onPrev, onNext]);


  return (
    <div
      className="
        fixed inset-0 z-[99999]
        flex items-center justify-center
        bg-emerald-950/95
        backdrop-blur-sm
      "
      onClick={onClose}
    >

      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        className="
          absolute right-4 top-4
          rounded-full
          bg-white/10
          p-3
          text-white
          hover:bg-white/20
        "
      >
        <X className="h-7 w-7" />
      </button>


      {/* Counter */}
      <div
        className="
          absolute top-5 left-1/2
          -translate-x-1/2
          rounded-full
          bg-black/30
          px-4 py-2
          text-sm text-white
        "
      >
        {index + 1} / {images.length}
      </div>


      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="
            absolute left-3 md:left-8
            rounded-full
            bg-white/10
            p-3
            text-white
          "
        >
          <ChevronLeft className="h-8 w-8" />
        </button>
      )}
      <div
        className="
          flex
          h-[85vh]
          w-[95vw]
          max-w-7xl
          items-center
          justify-center
        "
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={images[index]}
          alt={`${title} — photo ${index + 1}`}
          className="
            h-full
            w-full
            rounded-xl
            object-contain
            shadow-2xl
          "
        />
      </div>
      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="
            absolute right-3 md:right-8
            rounded-full
            bg-white/10
            p-3
            text-white
          "
        >
          <ChevronRight className="h-8 w-8" />
        </button>
      )}

    </div>
  );
}