import {
  createClient,
  type Session,
  type SupabaseClient,
  type User,
} from "@supabase/supabase-js";
import type { Listing } from "@/types/listing";
import type { UserProfile, UserRole } from "@/types/user";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export function isSupabaseConfigured(): boolean {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey
  );
}

let client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (!client) {
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return client;
}

export type AuthState = {
  session: Session | null;
  user: User | null;
};

export async function getAuthSession(): Promise<AuthState> {
  const supabase = getSupabaseClient();
  if (!supabase) return { session: null, user: null };

  const { data, error } = await supabase.auth.getSession();
  if (error) return { session: null, user: null };

  const session = data.session;
  return { session, user: session?.user ?? null };
}

export function onAuthStateChange(
  callback: (state: AuthState) => void
): () => void {
  const supabase = getSupabaseClient();
  if (!supabase) return () => {};

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    callback({ session, user: session?.user ?? null });
  });

  return () => subscription.unsubscribe();
}

export async function signInWithPassword(
  email: string,
  password: string
): Promise<{ error?: string }> {
  const supabase = getSupabaseClient();
  if (!supabase) return { error: "Supabase not configured" };

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  return {};
}

export async function signOut(): Promise<{ error?: string }> {
  const supabase = getSupabaseClient();
  if (!supabase) return { error: "Supabase not configured" };

  const { error } = await supabase.auth.signOut();
  if (error) return { error: error.message };
  return {};
}

export type ListingsQuery = {
  page?: number;
  pageSize?: number;
};

export type ListingsPagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
};

export type ListingsResult = {
  data: Listing[];
  source: "supabase" | "mock";
  error?: string;
  pagination?: ListingsPagination;
};

export type MutationResult = {
  ok: boolean;
  error?: string;
};

function mapRow(row: Record<string, unknown>): Listing {
  const relationalTypes = row.property_types as { label?: string } | undefined;
  const propertyTypeId = String(row.property_type_id ?? "unknown");
  const derivedLabel =
    relationalTypes?.label ??
    (propertyTypeId === "unknown" ? "Unknown" : propertyTypeId);

  return {
    id: String(row.id),
    created_at: row.created_at ? String(row.created_at) : undefined,
    title: String(row.title ?? ""),
    description: String(row.description ?? ""),
    price: Number(row.price ?? 0),
    location: String(row.location ?? ""),
    bedrooms: Number(row.bedrooms ?? 0),
    bathrooms: Number(row.bathrooms ?? 0),
    image_url: String(row.image_url ?? ""),
    amenities: row.amenities ?? {},
    like_count: Number(row.like_count ?? 0),
    property_type: String(derivedLabel),
    property_type_id: propertyTypeId,
  };
}

export async function fetchListingsFromSupabase(
  query: ListingsQuery = {}
): Promise<ListingsResult> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { data: [], source: "mock", error: "Supabase not configured" };
  }

  const page = Math.max(1, query.page ?? 1);
  // Default keeps admin / legacy callers loading a full working set.
  const pageSize = Math.min(100, Math.max(1, query.pageSize ?? 100));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  try {
    const { data, error, count } = await supabase
      .from("listings")
      .select("*, property_types(label)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      return { data: [], source: "mock", error: error.message };
    }

    const listings = (data ?? []).map(mapRow);
    const listingIds = listings.map((l) => l.id);
    const likeCounts = await fetchListingLikeCounts(listingIds);

    const listingsWithLikes = listings.map((listing) => ({
      ...listing,
      like_count: likeCounts[listing.id] ?? 0,
    }));

    const total = count ?? listingsWithLikes.length;
    const totalPages = total === 0 ? 0 : Math.ceil(total / pageSize);

    return {
      data: listingsWithLikes,
      source: "supabase",
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown fetch error";
    return { data: [], source: "mock", error: message };
  }
}

export async function fetchListingById(id: string): Promise<Listing | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("listings")
      .select("*, property_types(label)")
      .eq("id", id)
      .maybeSingle();
    if (error || !data) return null;
    return mapRow(data);
  } catch {
    return null;
  }
}

export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, role, created_at")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) return null;
  return {
    id: String(data.id),
    role: data.role as UserRole,
    created_at: data.created_at ? String(data.created_at) : undefined,
  };
}

export async function ensureUserProfile(userId: string): Promise<UserRole> {
  const supabase = getSupabaseClient();
  if (!supabase) return "buyer";

  const existing = await fetchUserProfile(userId);
  if (existing) return existing.role;

  const { data, error } = await supabase
    .from("profiles")
    .insert({ id: userId, role: "buyer" })
    .select("role")
    .single();

  if (error) {
    const retry = await fetchUserProfile(userId);
    return retry?.role ?? "buyer";
  }

  return (data.role as UserRole) ?? "buyer";
}

export async function fetchSavedListingIds(userId: string): Promise<string[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("saved_properties")
    .select("listing_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map((row) => String(row.listing_id));
}

export async function saveListingForUser(
  userId: string,
  listingId: string
): Promise<MutationResult> {
  const supabase = getSupabaseClient();
  if (!supabase) return { ok: false, error: "Supabase not configured" };

  const { error } = await supabase
    .from("saved_properties")
    .upsert({ user_id: userId, listing_id: listingId }, { onConflict: "user_id,listing_id" });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function unsaveListingForUser(
  userId: string,
  listingId: string
): Promise<MutationResult> {
  const supabase = getSupabaseClient();
  if (!supabase) return { ok: false, error: "Supabase not configured" };

  const { error } = await supabase
    .from("saved_properties")
    .delete()
    .eq("user_id", userId)
    .eq("listing_id", listingId);

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function fetchListingLikeCounts(
  listingIds: string[]
): Promise<Record<string, number>> {
  const supabase = getSupabaseClient();
  if (!supabase || listingIds.length === 0) return {};

  try {
    const { data, error } = await supabase
      .from("saved_properties")
      .select("listing_id")
      .in("listing_id", listingIds);

    if (error || !data) return {};

    const counts: Record<string, number> = {};
    for (const id of listingIds) {
      counts[id] = 0;
    }
    for (const row of data) {
      const id = String(row.listing_id);
      counts[id] = (counts[id] ?? 0) + 1;
    }
    return counts;
  } catch {
    return {};
  }
}

export async function insertListingToSupabase(
  listing: Omit<Listing, "id" | "created_at" | "like_count" | "property_type">
): Promise<{ data: Listing | null; error?: string }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { data: null, error: "Supabase not configured" };
  }

  try {
    const { data, error } = await supabase
      .from("listings")
      .insert({
        title: listing.title,
        description: listing.description,
        price: listing.price,
        location: listing.location,
        bedrooms: listing.bedrooms,
        bathrooms: listing.bathrooms,
        image_url: listing.image_url,
        amenities: listing.amenities ?? {},
        property_type_id: listing.property_type_id || "unknown",
      })
      .select("*, property_types(label)")
      .single();

    if (error) return { data: null, error: error.message };
    return { data: mapRow(data) };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown insert error";
    return { data: null, error: message };
  }
}

export async function deleteListingFromSupabase(
  id: string
): Promise<MutationResult> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { ok: false, error: "Supabase not configured" };
  }

  try {
    const { error } = await supabase.from("listings").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown delete error";
    return { ok: false, error: message };
  }
}

export async function fetchPopularLocalities(searchTxt?: string): Promise<string[]> {
  const supabase = getSupabaseClient();
  
  // Dynamic universal fallbacks for your primary target market region
  const fallbacks = [
    "Sector 17, Chandigarh",
    "Sector 62, Mohali",
    "Phase 3B2, Mohali",
    "Sector 5, Panchkula",
    "VIP Road, Zirakpur",
    "New Chandigarh",
  ];

  if (!supabase) return fallbacks;

  try {
    // Try to fetch from locations table first (new approach)
    const { data, error } = await supabase
      .from("locations")
      .select("display_name")
      .limit(20);

    if (!error && data && data.length > 0) {
      let locations = data.map((item) => String(item.display_name));

      // Filter by text search if provided
      if (searchTxt) {
        const query = searchTxt.trim().toLowerCase();
        locations = locations.filter((loc) =>
          loc.toLowerCase().includes(query)
        );
      }

      return locations.length > 0 ? locations : searchTxt ? [] : fallbacks;
    }

    // Fallback: fetch from listings table if locations table is empty
    const { data: listingsData } = await supabase
      .from("listings")
      .select("location");

    if (!listingsData) return fallbacks;

    const counts: Record<string, number> = {};
    listingsData.forEach((item) => {
      if (!item.location) return;
      const loc = String(item.location).trim();
      counts[loc] = (counts[loc] || 0) + 1;
    });

    let uniqueLocations = Object.keys(counts);

    if (searchTxt) {
      const query = searchTxt.trim().toLowerCase();
      uniqueLocations = uniqueLocations.filter((loc) =>
        loc.toLowerCase().includes(query)
      );
    }

    uniqueLocations.sort((a, b) => counts[b] - counts[a]);
    const results = uniqueLocations.slice(0, 6);

    return results.length > 0 ? results : searchTxt ? [] : fallbacks;
  } catch {
    return fallbacks;
  }
}
