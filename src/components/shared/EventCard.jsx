import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { FiArrowUpRight, FiLock, FiCalendar, FiShare2 } from "react-icons/fi";

/**
 * A single event presented as a clean photo card.
 *
 * Props:
 *  - event:   { id, eventName, eventDescription, eventDate, eventDriveLink }
 *  - user:    current auth user (gates the Drive link)
 *  - isAdmin: shows the update/delete menu
 *  - onDelete: (id) => void
 */
const EventCard = ({ event, user, isAdmin = false, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const dateLabel = event.eventDate
    ? new Date(event.eventDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/events/${event.id}/gallery`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy", err);
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: event.eventName,
          text: `Check out ${event.eventName}`,
          url: shareUrl,
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error("Error sharing", error);
        }
      }
    }
  };

  return (
    <article className="group relative flex flex-col h-full bg-ground-card border border-white/[0.07] rounded-xl overflow-hidden transition-all duration-400 hover:border-brand-glow/30 hover:-translate-y-1 hover:bg-ground-card/80">
      <div className="flex flex-col flex-1 p-6">
        {/* date + admin */}
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center gap-1.5 text-xs text-ink-faint">
            <FiCalendar className="text-[0.8rem]" />
            {dateLabel}
          </span>
          {isAdmin && (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((s) => !s)}
                className="text-ink-faint hover:text-ink transition -mr-1"
                aria-label="Event options"
              >
                <BiDotsVerticalRounded className="text-lg" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-ground-card border border-white/10 rounded-lg shadow-card z-50 overflow-hidden">
                  <Link
                    to={`/admin/update-event/${event.id}`}
                    className="block px-4 py-2.5 text-sm text-ink-dim hover:bg-white/[0.05] hover:text-ink"
                  >
                    Update
                  </Link>
                  <button
                    onClick={() => {
                      onDelete?.(event.id);
                      setMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2.5 text-sm text-red-400/90 hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* title */}
        <h3 className="font-display text-xl font-bold text-ink leading-snug mb-2.5 group-hover:text-white transition-colors">
          {event.eventName}
        </h3>

        {/* description */}
        <p className="text-sm text-ink-dim/85 leading-relaxed line-clamp-3 flex-1">
          {event.eventDescription}
        </p>

        {/* action */}
        <div className="mt-6 pt-5 border-t border-white/[0.06] flex items-center justify-between">
          {user && event.eventDriveLink ? (
            <Link
              to={`/events/${event.id}/gallery`}
              // hand the already-loaded event over so Gallery can start the
              // Drive listing without re-reading the Firestore doc first
              state={event}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-glow hover:text-white transition-colors"
            >
              View Photos
              <FiArrowUpRight className="text-base transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          ) : (
            <Link
              to="/login"
              onClick={() => toast.error("Please login to view event details")}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-faint hover:text-ink transition-colors"
            >
              <FiLock className="text-sm" /> Login to view
            </Link>
          )}

          {user && (
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-faint hover:text-ink transition-colors"
              aria-label="Share event"
            >
              <FiShare2 className="text-sm" /> Share
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default EventCard;
