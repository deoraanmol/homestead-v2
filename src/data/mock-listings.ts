import type { Listing } from "@/types/listing";

export const MOCK_LISTINGS: Listing[] = [
  {
    id: "mock-1",
    title: "Sector 17 Premium Apartment",
    description:
      "Bright 4 BHK with modular kitchen, covered parking, and walking distance to Elante Mall and Sector 17 plaza.",
    price: 12500000,
    location: "Sector 17, Chandigarh",
    bedrooms: 4,
    bathrooms: 3,
    image_url:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80,https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80,https://images.unsplash.com/photo-1600566753190-17f0baa8a6a3?w=800&q=80",
    property_type_id: "flat",
    property_type: "Flat / Apartment",
  },
  {
    id: "mock-2",
    title: "Mohali Independent Floor",
    description:
      "Spacious 2 BHK independent floor near Phase 7 market, 24×7 security, and quick access to Chandigarh–Mohali highway.",
    price: 7500000,
    location: "Sector 70, Mohali",
    bedrooms: 2,
    bathrooms: 2,
    image_url:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    property_type_id: "independent_floor",
    property_type: "Independent Floor",
  },
  {
    id: "mock-3",
    title: "Panchkula Villa with Garden",
    description:
      "3 BHK villa in a gated society with landscaped garden, servant quarter, and proximity to Pinjore–Kalka road.",
    price: 18500000,
    location: "Sector 20, Panchkula",
    bedrooms: 3,
    bathrooms: 3,
    image_url:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
    property_type_id: "villa",
    property_type: "Villa",
  },
  {
    id: "mock-4",
    title: "Zirakpur Family Home",
    description:
      "4 BHK builder floor on a quiet street near VIP Road, double parking, and easy connectivity to Chandigarh airport.",
    price: 5500000,
    location: "Zirakpur, Mohali District",
    bedrooms: 4,
    bathrooms: 2,
    image_url: "",
    property_type_id: "house",
    property_type: "House",
  },
];
