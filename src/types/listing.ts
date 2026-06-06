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
}

export type ListingInput = Omit<Listing, "id" | "created_at">;

export type DataSource = "supabase" | "mock";
