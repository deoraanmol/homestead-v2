export type PropertyTypeOption = {
  id: string;
  label: string;
};

/** Mirrors public.property_types seed (excluding internal "unknown" from buyer UI). */
export const PROPERTY_TYPE_OPTIONS: PropertyTypeOption[] = [
  { id: "flat", label: "Flat / Apartment" },
  { id: "house", label: "House" },
  { id: "independent_floor", label: "Independent Floor" },
  { id: "residential_plot", label: "Residential Plot" },
  { id: "villa", label: "Villa" },
  { id: "commercial", label: "Commercial Property" },
  { id: "agri_land", label: "Agricultural Land" },
];

export const PROPERTY_TYPE_LABELS: Record<string, string> = Object.fromEntries(
  [
    { id: "unknown", label: "Unknown" },
    ...PROPERTY_TYPE_OPTIONS,
  ].map((opt) => [opt.id, opt.label])
);

export function getPropertyTypeLabel(id: string | null | undefined): string {
  if (!id) return PROPERTY_TYPE_LABELS.unknown;
  return PROPERTY_TYPE_LABELS[id] ?? id;
}
