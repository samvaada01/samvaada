// Event archive loader.
//
// Why this doesn't use the Firestore SDK: /events reads are public
// (firestore.rules — `allow read: if true`), but the SDK blocks *every* query
// behind auth. From @firebase/firestore's credentials provider:
//
//     async getToken(e) { await this.auth._initializationPromise, ... }
//
// so a returning user paid an IndexedDB read + a stale-token refresh against
// securetoken.googleapis.com + a WebChannel handshake before the first card
// could render — all of it serial, and all of it after PrivateRoute had
// already held the page for the same auth check. The REST endpoint needs none
// of that, so the request can fly at boot alongside the bundle.
//
// Kicked off once from main.jsx; the promise is shared, so Home → /events
// reuses the same 24KB instead of refetching it.

// ponytail: one page, no cursor. 30 events today; add nextPageToken paging if
// the archive ever passes 300.
const endpoint = () =>
  `https://firestore.googleapis.com/v1/projects/${
    import.meta.env.VITE_PROJECTID
  }/databases/(default)/documents/events?pageSize=300`;

// REST wraps every value in a type tag: { stringValue: "..." } -> "..."
const unwrap = (fields = {}) =>
  Object.fromEntries(
    Object.entries(fields).map(([k, v]) => [k, Object.values(v)[0]])
  );

let inFlight;

/** @returns {Promise<Array<{id: string, eventName, eventDate, ...}>>} */
export const loadEvents = () =>
  (inFlight ??= fetch(endpoint())
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`events ${r.status}`))))
    .then((data) =>
      (data.documents || []).map((doc) => ({
        id: doc.name.split("/").pop(),
        ...unwrap(doc.fields),
      }))
    )
    .catch((err) => {
      inFlight = undefined; // let the next mount retry instead of caching a failure
      throw err;
    }));

/**
 * Throw away the shared list after an admin write. Without this the cache
 * outlives the session's add/update/delete and the admin keeps seeing the
 * pre-write archive until a hard reload.
 */
export const invalidateEvents = () => {
  inFlight = undefined;
};

/** Academic year (June–May) an event falls in, or null for a garbage date. */
export const academicYearOf = (dateStr) => {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  const y = d.getFullYear();
  // a "NaN-NaN" bucket would sort first and become the default filter,
  // hiding every real event — hence the null above
  return d.getMonth() >= 5 ? `${y}-${y + 1}` : `${y - 1}-${y}`;
};

/** Every academic year present, most recent first. */
export const academicYears = (events) =>
  [...new Set(events.map((e) => academicYearOf(e.eventDate)).filter(Boolean))]
    .sort()
    .reverse();

/** Events in one academic year, newest first. */
export const eventsInYear = (events, year) =>
  events
    .filter((e) => academicYearOf(e.eventDate) === year)
    .sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));
