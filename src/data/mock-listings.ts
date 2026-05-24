import type { Listing } from "@/types/listing";

export const MOCK_LISTINGS: Listing[] = [
  {
    id: "mock-1",
    title: "Modern Hillside Retreat",
    description:
      "Sun-drenched contemporary home with floor-to-ceiling windows, an open-plan kitchen, and a private deck overlooking native bushland.",
    price: 875000,
    location: "Byron Bay, NSW",
    bedrooms: 4,
    bathrooms: 3,
    image_url:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
  },
  {
    id: "mock-2",
    title: "Coastal Apartment",
    description:
      "Walk to the beach from this bright two-bedroom apartment featuring ocean glimpses, secure parking, and a resort-style pool.",
    price: 620000,
    location: "Bondi, NSW",
    bedrooms: 2,
    bathrooms: 2,
    image_url:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
  },
  {
    id: "mock-3",
    title: "Heritage Terrace",
    description:
      "Restored Victorian terrace with original fireplaces, a north-facing courtyard garden, and easy access to cafes and trams.",
    price: 1150000,
    location: "Fitzroy, VIC",
    bedrooms: 3,
    bathrooms: 2,
    image_url:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
  },
  {
    id: "mock-4",
    title: "Family Suburban Home",
    description:
      "Spacious brick home on a quiet cul-de-sac with a large backyard, double garage, and close to top-rated schools.",
    price: 740000,
    location: "Paddington, QLD",
    bedrooms: 4,
    bathrooms: 2,
    image_url: "",
  },
];
