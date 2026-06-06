const STORAGE_PREFIX = "homestead-saved";

function key(userId: string) {
  return `${STORAGE_PREFIX}:${userId}`;
}

export function getLocalSavedIds(userId: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key(userId));
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function setLocalSavedIds(userId: string, ids: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key(userId), JSON.stringify(ids));
}

export function toggleLocalSaved(userId: string, listingId: string): string[] {
  const ids = getLocalSavedIds(userId);
  const next = ids.includes(listingId)
    ? ids.filter((id) => id !== listingId)
    : [listingId, ...ids];
  setLocalSavedIds(userId, next);
  return next;
}
