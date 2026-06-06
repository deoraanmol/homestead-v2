import type { Dealer, DealerTestimonial } from "@/types/dealer";

export const MOCK_DEALERS: Dealer[] = [
  {
    id: "dealer-1",
    name: "Rajesh Malhotra",
    photoUrl:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80",
    coverUrl:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80",
    rating: 4.8,
    yearsExperience: 12,
    area: "Chandigarh & Panchkula",
    activeListings: 18,
    bio: "Specialist in premium apartments and independent floors across Sector 17–22.",
    phone: "+91 98765 43210",
    email: "rajesh.malhotra@homestead.in",
    certifications: ["RERA Registered", "CREDAI Member"],
    biography:
      "Rajesh has helped over 400 families find homes in the Tricity over the past twelve years. He focuses on transparent transactions, verified titles, and end-to-end support from site visits to registration. His clients value his deep knowledge of Chandigarh's sector layout and Panchkula's gated communities.",
    lat: 30.7333,
    lng: 76.7794,
    listingIds: ["mock-1", "mock-3"],
  },
  {
    id: "dealer-2",
    name: "Simran Kaur",
    photoUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80",
    coverUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
    rating: 4.6,
    yearsExperience: 8,
    area: "Mohali & Zirakpur",
    activeListings: 14,
    bio: "Trusted advisor for first-time buyers in Mohali phases and Zirakpur corridors.",
    phone: "+91 98155 66778",
    email: "simran.kaur@homestead.in",
    certifications: ["RERA Registered", "NAR India Affiliate"],
    biography:
      "Simran specialises in mid-segment homes for young professionals and growing families. She maintains strong relationships with local builders and provides honest guidance on connectivity, schools, and resale potential across Mohali's IT corridor and Zirakpur's VIP Road belt.",
    lat: 30.7046,
    lng: 76.7179,
    listingIds: ["mock-2", "mock-4"],
  },
  {
    id: "dealer-3",
    name: "Amit Verma",
    photoUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
    coverUrl:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
    rating: 4.9,
    yearsExperience: 15,
    area: "Full Tricity",
    activeListings: 26,
    bio: "Veteran broker covering luxury villas, plots, and commercial spaces Tricity-wide.",
    phone: "+91 99888 77665",
    email: "amit.verma@homestead.in",
    certifications: ["RERA Registered", "CREDAI Member", "Certified Property Consultant"],
    biography:
      "Amit is one of the Tricity's most experienced property consultants, with a portfolio spanning luxury villas in Panchkula, builder floors in Chandigarh, and investment plots along the Chandigarh–Mohali expressway. He is known for meticulous due diligence and personalised service for NRI clients.",
    lat: 30.6943,
    lng: 76.8606,
    listingIds: ["mock-1", "mock-2", "mock-3"],
  },
  {
    id: "dealer-4",
    name: "Priya Sharma",
    photoUrl:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80",
    coverUrl:
      "https://images.unsplash.com/photo-1600566753190-17f0baa8a6a3?w=1200&q=80",
    rating: 4.5,
    yearsExperience: 6,
    area: "Chandigarh East & Mohali",
    activeListings: 11,
    bio: "Focused on family homes near schools, parks, and metro connectivity.",
    phone: "+91 98760 12345",
    email: "priya.sharma@homestead.in",
    certifications: ["RERA Registered"],
    biography:
      "Priya helps families navigate the Tricity market with clarity and patience. She prioritises neighbourhoods with strong school access, daily conveniences, and safe communities — particularly in Chandigarh's southern sectors and Mohali's Phase 3–8 belt.",
    lat: 30.72,
    lng: 76.75,
    listingIds: ["mock-4"],
  },
];

export const MOCK_DEALER_TESTIMONIALS: Record<string, DealerTestimonial[]> = {
  "dealer-1": [
    {
      id: "t1",
      author: "Ankit & Neha",
      rating: 5,
      text: "Rajesh guided us through every step of buying our Sector 17 apartment. Transparent, responsive, and genuinely cared about our budget.",
      date: "Jan 2026",
    },
    {
      id: "t2",
      author: "Harpreet Singh",
      rating: 5,
      text: "Excellent knowledge of Panchkula societies. Closed our villa deal in three weeks with zero surprises.",
      date: "Nov 2025",
    },
  ],
  "dealer-2": [
    {
      id: "t3",
      author: "Rahul Mehta",
      rating: 4,
      text: "Simran made our first home purchase in Mohali stress-free. Very patient with all our questions.",
      date: "Dec 2025",
    },
  ],
  "dealer-3": [
    {
      id: "t4",
      author: "Dr. Kavita R.",
      rating: 5,
      text: "Amit handled our NRI purchase remotely with impeccable documentation support. Highly recommended.",
      date: "Feb 2026",
    },
    {
      id: "t5",
      author: "Vikram S.",
      rating: 5,
      text: "Deep market insight and honest advice. Found us a plot that appreciated within a year.",
      date: "Oct 2025",
    },
  ],
  "dealer-4": [
    {
      id: "t6",
      author: "Meera Joshi",
      rating: 4,
      text: "Priya understood exactly what we needed for our kids' school commute. Great experience overall.",
      date: "Jan 2026",
    },
  ],
};

export function getDealerById(id: string): Dealer | undefined {
  return MOCK_DEALERS.find((d) => d.id === id);
}

export function getDealerTestimonials(dealerId: string): DealerTestimonial[] {
  return MOCK_DEALER_TESTIMONIALS[dealerId] ?? [];
}
