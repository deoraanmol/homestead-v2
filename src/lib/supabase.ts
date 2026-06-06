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

export type ListingsResult = {
  data: Listing[];
  source: "supabase" | "mock";
  error?: string;
};

export type MutationResult = {
  ok: boolean;
  error?: string;
};

function mapRow(row: Record<string, unknown>): Listing {
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
  };
}

export async function fetchListingsFromSupabase(): Promise<ListingsResult> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { data: [], source: "mock", error: "Supabase not configured" };
  }

  try {
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return { data: [], source: "mock", error: error.message };
    }

    return {
      data: (data ?? []).map(mapRow),
      source: "supabase",
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
      .select("*")
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

export async function insertListingToSupabase(
  listing: Omit<Listing, "id" | "created_at">
): Promise<{ data: Listing | null; error?: string }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { data: null, error: "Supabase not configured" };
  }

  try {
    const { data, error } = await supabase
      .from("listings")
      .insert(listing)
      .select("*")
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
