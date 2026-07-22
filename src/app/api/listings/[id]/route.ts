import { NextResponse } from "next/server";
import { MOCK_LISTINGS } from "@/data/mock-listings";
import { fetchListingById, getSupabaseServiceClient, isSupabaseConfigured } from "@/lib/supabase";
import { generateListingCrux } from "@/lib/ai";
import type { Listing } from "@/types/listing";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const listingId = String(id ?? "").trim();

    if (!listingId) {
      return NextResponse.json({ error: "Listing id is required" }, { status: 400 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: "Database configuration error" }, { status: 500 });
    }

    const listing = await fetchListingById(listingId);
    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    if (!listing.aiCrux?.trim()) {
      const aiCrux = await generateListingCrux(listing);
      const finalCrux = aiCrux || (listing.description ? listing.description.slice(0, 30) : "Great Value");

      return NextResponse.json({
        data: {
          ...listing,
          aiCrux: finalCrux,
        },
      });
    }

    return NextResponse.json({ data: listing });
  } catch (error) {
    console.error("Listing API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch listing" },
      { status: 500 }
    );
  }
}
