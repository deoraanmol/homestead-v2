export type AmenityDetail = {
  title: string;
  distance: string;
};

export type AmenitiesData = {
  school?: AmenityDetail;
  hospital?: AmenityDetail;
  market?: AmenityDetail;
  transport?: AmenityDetail;
};

export interface Listing {
  id: string;
  created_at?: string;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  image_url: string;
  amenities?: AmenitiesData;
  like_count?: number;
  property_type: string;
  property_type_id: string;
  aiCrux: string;
}

export type ListingInput = Omit<Listing, "id" | "created_at" | "like_count" | "property_type">;

export type DataSource = "supabase" | "mock";
