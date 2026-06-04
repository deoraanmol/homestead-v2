import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80";

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function listingImage(url: string | null | undefined): string {
  const images = listingGalleryImages(url);
  return images[0] ?? PLACEHOLDER_IMAGE;
}

/** Supports comma-separated URLs in image_url without schema changes. */
export function listingGalleryImages(url: string | null | undefined): string[] {
  const trimmed = url?.trim() ?? "";
  if (!trimmed) return [PLACEHOLDER_IMAGE];

  if (trimmed.includes(",")) {
    const parts = trimmed
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
    return parts.length > 0 ? parts : [PLACEHOLDER_IMAGE];
  }

  return [trimmed];
}
