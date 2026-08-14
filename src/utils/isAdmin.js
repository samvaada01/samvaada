// Single source of truth for "is this the admin?".
//
// Fails CLOSED: if VITE_ADMIN_EMAIL is missing at build time, nobody is admin.
// The bare `user?.email === import.meta.env.VITE_ADMIN_EMAIL` this replaces made
// a signed-out visitor (undefined === undefined) an admin in that case.
const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || "").trim().toLowerCase();

export default function isAdminEmail(email) {
  if (!ADMIN_EMAIL) return false;
  return (email || "").trim().toLowerCase() === ADMIN_EMAIL;
}
