// Google Drive helpers — list images from a public Drive folder using an API key.
//
// Requirements:
//  - The Drive folder must be shared "Anyone with the link → Viewer".
//  - VITE_DRIVE_APIKEY must be set (Drive API enabled, referrer-restricted).

const DRIVE_FILES_ENDPOINT = "https://www.googleapis.com/drive/v3/files";

/**
 * Pull the folder ID out of any common Google Drive link shape.
 *  - https://drive.google.com/drive/folders/<ID>
 *  - https://drive.google.com/open?id=<ID>
 *  - a bare ID
 */
export function parseDriveFolderId(url = "") {
  if (!url) return null;
  const byFolder = url.match(/folders\/([a-zA-Z0-9_-]+)/);
  if (byFolder) return byFolder[1];
  const byQuery = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (byQuery) return byQuery[1];
  const trimmed = url.trim();
  if (/^[a-zA-Z0-9_-]{20,}$/.test(trimmed)) return trimmed;
  return null;
}

/** Inline-renderable image URLs for a Drive file ID. */
export function driveImageUrls(fileId) {
  return {
    thumb: `https://drive.google.com/thumbnail?id=${fileId}&sz=w600`,
    full: `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`,
  };
}

/** Raw bytes endpoint (CORS-friendly) — used to fetch a blob for download. */
export function driveDownloadUrl(fileId) {
  const apiKey = import.meta.env.VITE_DRIVE_APIKEY;
  return `${DRIVE_FILES_ENDPOINT}/${fileId}?alt=media&key=${apiKey}`;
}

/**
 * Fetch a Drive image and trigger a browser download with a custom filename.
 * @param {string} fileId
 * @param {string} filename - desired download name (extension added if missing)
 */
export async function downloadDriveImage(fileId, filename) {
  const res = await fetch(driveDownloadUrl(fileId));
  if (!res.ok) throw new Error(`Download failed (${res.status})`);
  const blob = await res.blob();

  // Pick an extension from the blob's MIME type (fall back to .png).
  const ext = (blob.type && blob.type.split("/")[1]) || "png";
  const safeName = /\.[a-z0-9]+$/i.test(filename) ? filename : `${filename}.${ext}`;

  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = safeName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(objectUrl);
}

/** Slugify an event name for use in a download filename. */
export function slugifyEventName(name = "") {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "event"
  );
}

const FOLDER_MIME = "application/vnd.google-apps.folder";

/** One page-following Drive files.list call. */
async function driveList(params) {
  const apiKey = import.meta.env.VITE_DRIVE_APIKEY;
  if (!apiKey) throw new Error("Drive API key is missing (set VITE_DRIVE_APIKEY).");

  const files = [];
  let pageToken = "";

  do {
    const search = new URLSearchParams({ ...params, key: apiKey, pageSize: "100" });
    if (pageToken) search.set("pageToken", pageToken);

    const res = await fetch(`${DRIVE_FILES_ENDPOINT}?${search.toString()}`);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.error?.message || `Drive request failed (${res.status})`);
    }

    const data = await res.json();
    files.push(...(data.files || []));
    pageToken = data.nextPageToken || "";
  } while (pageToken);

  return files;
}

/**
 * List the subfolders and images directly inside a public Drive folder.
 * @param {string} folderUrlOrId - a Drive link or a bare folder ID
 * @returns {Promise<{folders: Array<{id,name}>, images: Array<{id,name,thumb,full}>}>}
 */
export async function fetchDriveFolder(folderUrlOrId) {
  const folderId = parseDriveFolderId(folderUrlOrId);
  if (!folderId) {
    throw new Error("Couldn't read a Google Drive folder ID from this link.");
  }

  const files = await driveList({
    q: `'${folderId}' in parents and trashed = false and (mimeType contains 'image/' or mimeType = '${FOLDER_MIME}')`,
    fields: "nextPageToken, files(id, name, mimeType)",
    orderBy: "folder,name",
  });

  return {
    folders: files.filter((f) => f.mimeType === FOLDER_MIME).map((f) => ({ id: f.id, name: f.name })),
    images: files
      .filter((f) => f.mimeType !== FOLDER_MIME)
      .map((f) => ({ id: f.id, name: f.name, ...driveImageUrls(f.id) })),
  };
}

/** Folder display name — used for the breadcrumb on a deep-linked subfolder. */
export async function fetchDriveFolderName(folderId) {
  const apiKey = import.meta.env.VITE_DRIVE_APIKEY;
  const res = await fetch(`${DRIVE_FILES_ENDPOINT}/${folderId}?fields=name&key=${apiKey}`);
  if (!res.ok) return "";
  const data = await res.json().catch(() => ({}));
  return data.name || "";
}
