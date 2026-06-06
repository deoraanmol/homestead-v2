export type Dealer = {
  id: string;
  name: string;
  photoUrl: string;
  coverUrl: string;
  rating: number;
  yearsExperience: number;
  area: string;
  activeListings: number;
  bio: string;
  phone: string;
  email: string;
  certifications: string[];
  biography: string;
  lat: number;
  lng: number;
  listingIds: string[];
};

export type DealerTestimonial = {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
};
