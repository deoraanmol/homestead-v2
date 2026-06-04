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
}

export type ListingInput = Omit<Listing, "id" | "created_at">;

export type DataSource = "supabase" | "mock";
