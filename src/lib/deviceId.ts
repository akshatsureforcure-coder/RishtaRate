const STORAGE_KEY = "rishta-rate-device-id";

/**
 * Returns a stable anonymous id for this browser, creating one on first use.
 * Used so "My History" can find past submissions from this device without
 * requiring a real login.
 */
export function getDeviceId(): string {
  if (typeof window === "undefined") return "";

  let id = window.localStorage.getItem(STORAGE_KEY);
  if (!id) {
    id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `dev-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(STORAGE_KEY, id);
  }
  return id;
}
