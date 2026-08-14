import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiTrash2, FiPlus, FiExternalLink } from "react-icons/fi";
import { AuthContext } from "../../AuthProvider/AuthProvider";
import isAdminEmail from "../../../utils/isAdmin";
import {
  fetchGalleryImages,
  saveGalleryImages,
  FALLBACK_GALLERY_IMAGES,
} from "../../../utils/galleryImages";

const ManageGallery = () => {
  const { user } = useContext(AuthContext);
  const [urls, setUrls] = useState([]);
  const [newUrl, setNewUrl] = useState("");
  const [status, setStatus] = useState("loading"); // loading | firestore | fallback | error
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchGalleryImages().then(({ urls: loaded, source, error }) => {
      if (cancelled) return;
      setUrls(loaded);
      // never let a denied read look like "no images configured"
      setStatus(error ? "error" : source);
      if (error) console.error("Gallery read failed", error);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // one write path for add and remove, so a failure always restores what's live
  const commit = async (next, message) => {
    if (!isAdminEmail(user?.email)) {
      toast.error("Unauthorized access");
      return;
    }
    const previous = urls;
    setUrls(next);
    setSaving(true);
    try {
      await saveGalleryImages(next);
      setStatus("firestore");
      toast.success(message);
    } catch (err) {
      setUrls(previous);
      toast.error(err.message || "Couldn't save. Check your Firestore rules.");
    } finally {
      setSaving(false);
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const url = newUrl.trim();
    if (!/^https:\/\/\S+$/i.test(url)) {
      toast.error("Enter a full https:// image URL.");
      return;
    }
    if (urls.includes(url)) {
      toast.error("That URL is already in the gallery.");
      return;
    }
    commit([...urls, url], "Photo added.");
    setNewUrl("");
  };

  const handleRemove = (url) => {
    if (urls.length === 1) {
      toast.error("Keep at least one photo — an empty gallery falls back to the built-in list.");
      return;
    }
    if (!window.confirm("Remove this photo from the homepage gallery?")) return;
    commit(
      urls.filter((u) => u !== url),
      "Photo removed."
    );
  };

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-3xl mx-auto mt-10 bg-[#1A202C] p-8 rounded-lg shadow-xl text-[#89A3B6]">
        <h2 className="text-3xl font-bold mb-2 text-center">Photo Gallery</h2>
        <p className="text-center text-sm mb-8 opacity-70">
          These images fill the rotating collage on the homepage.
        </p>

        {status === "error" && (
          <p className="mb-6 rounded-md border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-300">
            Couldn&apos;t read <code>siteContent/photoGallery</code> — showing the built-in list.
            Saving will fail until your Firestore rules allow this document.
          </p>
        )}
        {status === "fallback" && (
          <p className="mb-6 rounded-md border border-amber-400/40 bg-amber-500/10 p-3 text-sm text-amber-200">
            No gallery saved yet — these are the {FALLBACK_GALLERY_IMAGES.length} built-in photos.
            Your first add or remove saves the whole list to Firestore.
          </p>
        )}

        <form onSubmit={handleAdd} className="flex gap-2 mb-8">
          <input
            type="url"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="https://… image URL"
            className="input input-bordered flex-1 p-3 bg-[#243E51] text-[#89A3B6] placeholder-[#89A3B6]/60 focus:outline-none focus:ring-2 focus:ring-[#496980]"
          />
          <button
            type="submit"
            disabled={saving || status === "loading"}
            className="btn bg-[#496980] hover:bg-[#5a7f99] text-white border-none px-5 disabled:opacity-50"
          >
            <FiPlus /> Add
          </button>
        </form>

        {status === "loading" ? (
          <p className="text-center opacity-70">Loading gallery…</p>
        ) : (
          <>
            <p className="mb-3 text-sm opacity-70">
              {urls.length} photo{urls.length === 1 ? "" : "s"}
            </p>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {urls.map((url) => (
                <li
                  key={url}
                  className="group relative aspect-square overflow-hidden rounded-md border border-white/10 bg-[#0d1217]"
                >
                  <img
                    src={url}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 flex justify-between gap-1 bg-black/70 p-1.5 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Open image"
                      className="p-1 text-white/80 hover:text-white"
                    >
                      <FiExternalLink />
                    </a>
                    <button
                      type="button"
                      onClick={() => handleRemove(url)}
                      disabled={saving}
                      aria-label="Remove photo"
                      className="p-1 text-red-400 hover:text-red-300 disabled:opacity-50"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default ManageGallery;
