import { useEffect, useState, useContext } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { deleteDoc, doc } from "firebase/firestore";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { db } from "../../Firebase/firebase.config";
import { AuthContext } from "../../AuthProvider/AuthProvider";
import SectionHeading from "../../shared/SectionHeading";
import EventCard, { EventCardSkeleton } from "../../shared/EventCard";
import {
  loadEvents,
  invalidateEvents,
  academicYears as yearsOf,
  eventsInYear,
} from "../../../utils/events";
import useSEO from "../../../utils/useSEO";
import isAdminEmail from "../../../utils/isAdmin";

const Events = () => {
  useSEO({
    title: "All Events | Samvaada NMAMIT",
    description:
      "Browse the complete archive of NMAMIT events organized by academic year. View event details, photos, and memories from Samvaada.",
    canonical: "https://samvaada-nmamit.in/events",
  });

  const { user } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState(null); // null = still loading
  const [loadFailed, setLoadFailed] = useState(false);
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);

  const isAdmin = isAdminEmail(user?.email);

  useEffect(() => {
    // already in flight since main.jsx — this just picks up the result
    loadEvents()
      .then((list) => {
        const years = yearsOf(list);
        setAcademicYears(years);

        const yearParam = searchParams.get("year");
        setSelectedYear(
          yearParam && years.includes(yearParam) ? yearParam : years[0] || null
        );
        setEvents(list);
      })
      .catch(() => {
        setEvents([]);
        setLoadFailed(true);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // derived, not stored: no second render pass before the cards appear
  const filteredEvents = events ? eventsInYear(events, selectedYear) : [];

  const selectYear = (year) => {
    setSelectedYear(year);
    setSearchParams({ year }, { replace: true });
  };

  // 🗑️ Delete an event (admin only)
  const handleDelete = async (id) => {
    if (!isAdmin) {
      toast.error("Unauthorized access");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await deleteDoc(doc(db, "events", id));
      invalidateEvents();
      setEvents((prev) => prev.filter((event) => event.id !== id));
      toast.success("Event deleted successfully!");
    } catch (error) {
      toast.error("Error deleting event");
    }
  };

  return (
    <main role="main" aria-label="Events archive" className="relative bg-ground text-ink min-h-screen">
      {/* ambient glow */}
      <div className="pointer-events-none absolute top-0 left-0 w-full h-[40rem] bg-lens-glow opacity-50" />

      <div className="relative max-w-screen-xl mx-auto px-6 md:px-8 py-20">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-ink-dim hover:text-ink transition-colors mb-8"
        >
          <FiArrowLeft /> Back to Home
        </Link>
        <SectionHeading kicker="The Full Archive" title="All Events" />

        {/* Year Filter */}
        <div className="flex flex-wrap justify-center gap-2 mt-8 mb-10">
          {academicYears.map((year) => (
            <button
              key={year}
              onClick={() => selectYear(year)}
              className={`text-sm font-medium px-4 py-1.5 rounded-full border transition-all duration-300 ${
                selectedYear === year
                  ? "border-brand-glow/50 bg-brand-700/40 text-ink"
                  : "border-white/10 text-ink-dim hover:border-brand-glow/30 hover:text-ink"
              }`}
            >
              {year}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        {!events ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          <div role="list" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, i) => (
              <motion.div
                role="listitem"
                key={event.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.35, delay: (i % 3) * 0.05, ease: [0.22, 1, 0.36, 1] }}
              >
                <EventCard
                  event={event}
                  index={i}
                  user={user}
                  isAdmin={isAdmin}
                  onDelete={handleDelete}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-ink-faint py-16">
            {loadFailed
              ? "Couldn't load events. Please check your connection and refresh."
              : `No events found for ${selectedYear || "this year"}.`}
          </p>
        )}
      </div>
    </main>
  );
};

export default Events;
