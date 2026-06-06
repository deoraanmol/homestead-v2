import type { Listing } from "@/types/listing";

export type PropertyAmenities = {
  school?: { title: string; distance: string };
  hospital?: { title: string; distance: string };
  market?: { title: string; distance: string };
  transport?: { title: string; distance: string };
};

export function getAuditorRating(listingId: string): number {
  let hash = 0;
  for (let i = 0; i < listingId.length; i++) {
    hash = listingId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const normalized = Math.abs(hash % 15) / 10 + 3.5;
  return Math.min(5, Math.round(normalized * 10) / 10);
}

export function getNearbyAmenities(listing: Listing): PropertyAmenities {
  // Read from actual Supabase data if available
  if (listing.amenities) {
    return listing.amenities;
  }

  // Fallback to mock data if amenities not provided
  const seed = listing.bedrooms + listing.bathrooms + listing.location.length;
  return {
    school: {
      title: "Nearby School",
      distance: `${(0.4 + (seed % 8) * 0.15).toFixed(1)} km`,
    },
    hospital: {
      title: "Nearby Hospital",
      distance: `${(0.8 + (seed % 6) * 0.2).toFixed(1)} km`,
    },
    market: {
      title: "Nearby Market",
      distance: `${(0.2 + (seed % 5) * 0.1).toFixed(1)} km`,
    },
    transport: {
      title: "Public Transport",
      distance: `${(0.3 + (seed % 7) * 0.12).toFixed(1)} km`,
    },
  };
}

export function getFullSpecifications(listing: Listing): string {
  return `This ${listing.bedrooms} BHK property in ${listing.location} offers a thoughtfully planned layout suited for modern Tricity living. The home features quality flooring, ample natural light, and well-proportioned rooms that balance comfort with functionality. The kitchen is designed for everyday convenience, while living spaces flow naturally for family gatherings and entertaining guests.

Located in one of the region's most sought-after neighbourhoods, the property benefits from excellent connectivity to major roads, daily conveniences, and established residential infrastructure. ${listing.description} Nearby schools, healthcare facilities, and retail options make this an ideal choice for families and professionals alike.

Construction quality and maintenance standards align with local market expectations for this price segment. Parking arrangements, security provisions, and society amenities (where applicable) add further value. Whether you are purchasing for self-use or long-term investment, this listing represents a well-positioned opportunity in the Chandigarh Tricity market with strong resale potential and rental demand in the surrounding area.`;
}

export const MOCK_DEALER_PHONE = "+91 98765 00000";
