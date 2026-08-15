// Community page state — Firestore at siteContent/community:
//   { open: boolean, links: { [branch]: url }, closedMessage: string }
//
// Same shape as galleryImages.js: the constants below are the seed/fallback so
// the page works before the doc exists and if the read is denied. Reads default
// to OPEN — a missing doc must not close the community for everyone.
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../components/Firebase/firebase.config";

export const communityDocRef = () => doc(db, "siteContent", "community");

export const FALLBACK_LINKS = {
  "Artificial Intelligence & Data Science": "https://chat.whatsapp.com/ErZ9D8zxJVD6xfPogz3OHK",
  "Artificial Intelligence & Machine Learning": "https://chat.whatsapp.com/ErZ9D8zxJVD6xfPogz3OHK",
  "Biotechnology": "https://chat.whatsapp.com/JwLGOjacCc4HLSWAnx5X0D",
  "Civil Engineering": "https://chat.whatsapp.com/JwLGOjacCc4HLSWAnx5X0D",
  "Computer & Communication Engineering": "https://chat.whatsapp.com/ErZ9D8zxJVD6xfPogz3OHK",
  "Computer Science & Engineering": "https://chat.whatsapp.com/ErZ9D8zxJVD6xfPogz3OHK",
  "Computer Science & Engineering(Cyber Security)": "https://chat.whatsapp.com/ErZ9D8zxJVD6xfPogz3OHK",
  "Electrical & Electronics Engineering": "https://chat.whatsapp.com/JwLGOjacCc4HLSWAnx5X0D",
  "Electronics & Communication Engineering": "https://chat.whatsapp.com/JwLGOjacCc4HLSWAnx5X0D",
  "Electronics Engineering (VLSI Design & Technology)": "https://chat.whatsapp.com/JwLGOjacCc4HLSWAnx5X0D",
  "Electronics & Communication (Advanced Communication Technology)": "https://chat.whatsapp.com/JwLGOjacCc4HLSWAnx5X0D",
  "Information Science & Engineering": "https://chat.whatsapp.com/ErZ9D8zxJVD6xfPogz3OHK",
  "Mechanical Engineering": "https://chat.whatsapp.com/JwLGOjacCc4HLSWAnx5X0D",
  "Robotics & Artificial Intelligence": "https://chat.whatsapp.com/ErZ9D8zxJVD6xfPogz3OHK",
};

// What resolveCommunity is fed when there is no document / no read. Named so
// the test can assert the two paths stay opposite.
export const ABSENT_DOC = { open: false };
export const READ_FAILED = { open: true };

export const DEFAULT_CLOSED_MESSAGE =
  "Community joining is closed at the moment. Please contact the community admin at samvaada@nmamit.in if you'd like to join the group.";

/**
 * Pure resolution of a Firestore snapshot's data into what the page renders.
 * Kept separate from the network call so it stays testable — see
 * communitySettings.test.mjs.
 */
export function resolveCommunity(data) {
  // drop anything that isn't a usable string — a null/number written from the
  // Firestore console would otherwise reach url.trim() and <input value={...}>
  const saved = Object.fromEntries(
    Object.entries(data?.links || {}).filter(([, url]) => typeof url === "string" && url.trim())
  );
  return {
    open: data?.open !== false,
    // merge, don't replace: a branch missing from Firestore keeps its seed link
    links: { ...FALLBACK_LINKS, ...saved },
    closedMessage: data?.closedMessage?.trim() || DEFAULT_CLOSED_MESSAGE,
  };
}

/**
 * @returns {Promise<{open, links, closedMessage, error?: Error}>}
 *   On a failed read you get the seed values, open, plus `error` — a denied read
 *   must not silently look like "the admin closed the community".
 */
export async function fetchCommunitySettings() {
  try {
    const snap = await getDoc(communityDocRef());
    return resolveCommunity(snap.exists() ? snap.data() : ABSENT_DOC);
  } catch (error) {
    return { ...resolveCommunity(READ_FAILED), error };
  }
}

/** Partial write — pass only the fields you changed. */
export function saveCommunitySettings(patch) {
  return setDoc(communityDocRef(), patch, { merge: true });
}
