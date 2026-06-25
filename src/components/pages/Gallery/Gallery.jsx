import { useEffect, useState, useCallback, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  FiArrowLeft,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiDownload,
  FiCalendar,
  FiShare2,
} from "react-icons/fi";
import { db } from "../../Firebase/firebase.config";
import {
  fetchDriveImages,
  downloadDriveImage,
  slugifyEventName,
} from "../../../utils/drive";
import SectionHeading from "../../shared/SectionHeading";
import { AuthContext } from "../../AuthProvider/AuthProvider";

const Gallery = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [active, setActive] = useState(null); // index of open image
  const [downloading, setDownloading] = useState(null); // index being downloaded

  const dateLabel = event?.eventDate
    ? new Date(event.eventDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  const handleShare = async () => {
    const shareUrl = window.location.href;

    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy", err);
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: event?.eventName || "Event Gallery",
          text: `Check out ${event?.eventName || "this event"}`,
          url: shareUrl,
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error("Error sharing", error);
        }
      }
    }
  };

  const handleDownload = useCallback(
    async (index, e) => {
      e?.stopPropagation();
      const img = images[index];
      if (!img) return;
      const base = `samvaada-${slugifyEventName(event?.eventName)}`;
      const filename = images.length > 1 ? `${base}-${index + 1}` : base;
      try {
        setDownloading(index);
        await downloadDriveImage(img.id, filename);
      } catch (err) {
        toast.error(err.message || "Couldn't download this photo.");
      } finally {
        setDownloading(null);
      }
    },
    [images, event]
  );

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const snap = await getDoc(doc(db, "events", id));
        if (!snap.exists()) throw new Error("Event not found.");
        const data = { id: snap.id, ...snap.data() };
        if (cancelled) return;
        setEvent(data);
        const imgs = await fetchDriveImages(data.eventDriveLink);
        if (cancelled) return;
        setImages(imgs);
      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to load photos.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const close = useCallback(() => setActive(null), []);
  const next = useCallback(
    () => setActive((i) => (i === null ? i : (i + 1) % images.length)),
    [images.length]
  );
  const prev = useCallback(
    () => setActive((i) => (i === null ? i : (i - 1 + images.length) % images.length)),
    [images.length]
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, close, next, prev]);

  return (
    <div className="min-h-screen bg-ground text-ink">
      <section className="max-w-screen-xl mx-auto pt-24 pb-16 px-6 md:px-8">
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-ink-dim hover:text-ink transition-colors"
          >
            <FiArrowLeft /> Back to events
          </Link>
          {user && (
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-dim hover:text-ink transition-colors"
              aria-label="Share event"
            >
              <FiShare2 /> Share
            </button>
          )}
        </div>

        <SectionHeading
          kicker="Captured Moments"
          title={event?.eventName || "Gallery"}
          align="left"
        />

        {/* event meta: date + description */}
        {event && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 max-w-2xl"
          >
            {dateLabel && (
              <span className="inline-flex items-center gap-1.5 text-xs text-ink-faint">
                <FiCalendar className="text-[0.8rem]" />
                {dateLabel}
              </span>
            )}
            {event.eventDescription && (
              <p className="mt-3 text-sm text-ink-dim/85 leading-relaxed">
                {event.eventDescription}
              </p>
            )}
          </motion.div>
        )}

        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-lg bg-white/[0.04] animate-pulse"
              />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="mt-12 text-center">
            <p className="text-red-400/90">{error}</p>
            <a
              href={event?.eventDriveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-sm font-semibold text-brand-glow hover:text-white transition-colors"
            >
              Open in Google Drive instead →
            </a>
          </div>
        )}

        {!loading && !error && images.length === 0 && (
          <p className="text-center text-ink-faint py-16">
            No photos found in this album yet.
          </p>
        )}

        {!loading && !error && images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-10">
            {images.map((img, i) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: (i % 8) * 0.04 }}
                className="group relative aspect-square overflow-hidden rounded-lg bg-ground-card border border-white/[0.06]"
              >
                <button
                  onClick={() => setActive(i)}
                  className="absolute inset-0 focus:outline-none focus:ring-2 focus:ring-brand-glow/60 rounded-lg"
                  aria-label={`Open photo ${i + 1}`}
                >
                  <img
                    src={img.thumb}
                    alt={img.name}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </button>
                <button
                  onClick={(e) => handleDownload(i, e)}
                  disabled={downloading === i}
                  aria-label="Download photo"
                  className="absolute bottom-2 right-2 p-2 rounded-full bg-black/55 text-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-black/75 hover:text-white transition disabled:opacity-60"
                >
                  <FiDownload className={`text-base ${downloading === i ? "animate-pulse" : ""}`} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {active !== null && images[active] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={close}
          >
            <div className="absolute top-5 right-5 flex items-center gap-4">
              <button
                onClick={(e) => handleDownload(active, e)}
                disabled={downloading === active}
                aria-label="Download photo"
                className="text-white/70 hover:text-white transition disabled:opacity-60"
              >
                <FiDownload
                  className={`text-2xl ${downloading === active ? "animate-pulse" : ""}`}
                />
              </button>
              <button
                onClick={close}
                aria-label="Close"
                className="text-white/70 hover:text-white transition"
              >
                <FiX className="text-3xl" />
              </button>
            </div>

            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prev();
                  }}
                  aria-label="Previous"
                  className="absolute left-3 md:left-6 text-white/70 hover:text-white transition"
                >
                  <FiChevronLeft className="text-4xl" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    next();
                  }}
                  aria-label="Next"
                  className="absolute right-3 md:right-6 text-white/70 hover:text-white transition"
                >
                  <FiChevronRight className="text-4xl" />
                </button>
              </>
            )}

            <motion.img
              key={images[active].id}
              src={images[active].full}
              alt={images[active].name}
              referrerPolicy="no-referrer"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] max-w-[92vw] object-contain rounded-lg shadow-2xl"
            />

            <span className="absolute bottom-5 text-xs text-white/50">
              {active + 1} / {images.length}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
