import { useEffect, useState, useContext } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { motion } from "framer-motion";
import { db } from "../../Firebase/firebase.config";
import { AuthContext } from "../../AuthProvider/AuthProvider";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import AboutFea from "./AboutFea/AboutFea";
import Banner from "./Banner/Banner";
import MeetTheTeam from "./MeetTheTeam";
import SectionHeading from "../../shared/SectionHeading";
import useStructuredData from "../../../utils/useStructuredData";
import EventCard, { EventCardSkeleton } from "../../shared/EventCard";
import {
  loadEvents,
  invalidateEvents,
  academicYears as yearsOf,
  eventsInYear,
} from "../../../utils/events";
import useSEO from "../../../utils/useSEO";
import isAdminEmail from "../../../utils/isAdmin";

const Home = () => {
  useSEO({
    title: "Samvaada | NMAMIT Event Archive & Community",
    description:
      "Samvaada is the official event archive and student community platform of NMAMIT, Nitte. Browse events, view photo galleries, and join your branch community.",
    canonical: "https://samvaada-nmamit.in/",
  });

  const [events, setEvents] = useState(null); // null = still loading
  const [loadFailed, setLoadFailed] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  const [academicYears, setAcademicYears] = useState([]);
  const { user } = useContext(AuthContext);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useStructuredData([
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Samvaada - NMAMIT",
      "url": "https://samvaada-nmamit.in",
      "logo": "https://samvaada-nmamit.in/og-image.png",
      "description": "The official event archive and student community platform of NMAM Institute of Technology, Nitte.",
      "sameAs": [],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "student community",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Samvaada",
      "url": "https://samvaada-nmamit.in",
      "description": "NMAMIT Event Archive & Student Community Platform",
    },
  ]);

  // ✅ Detect screen size (to limit events count)
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // already in flight since main.jsx — this just picks up the result
    loadEvents()
      .then((list) => {
        const years = yearsOf(list);
        setAcademicYears(years);
        setSelectedYear(years[0] || null);
        setEvents(list);
      })
      .catch(() => {
        setEvents([]);
        setLoadFailed(true);
      });
  }, []);

  // derived, not stored: no second render pass before the cards appear
  const filteredEvents = events ? eventsInYear(events, selectedYear) : [];

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

  const isAdmin = isAdminEmail(user?.email);

  // ✅ Limit events count (6 for desktop, 3 for mobile)
  const displayedEvents = filteredEvents.slice(0, isMobile ? 3 : 6);

  return (
    <main role="main" className="bg-ground text-ink">
      {/* HOME / HERO */}
      <section id="home">
        <Banner />
      </section>

      {/* EVENTS */}
      <section id="events" aria-label="College events" className="relative max-w-screen-xl mx-auto pt-20 pb-12 px-6 md:px-8">
        <SectionHeading kicker="Captured Moments" title="Events" />

        {/* Year filter */}
        <div className="flex flex-wrap justify-center gap-2 mt-8 mb-10">
          {academicYears.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
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
            {Array.from({ length: isMobile ? 3 : 6 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        ) : displayedEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedEvents.map((event, i) => (
              <motion.div
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

        {/* View All Events Button */}
        {filteredEvents.length > (isMobile ? 3 : 6) && (
          <div className="flex justify-center mt-12">
            <Link to="/events" className="btn-cine">
              View all events
            </Link>
          </div>
        )}
      </section>

      {/* ABOUT */}
      <section id="about" aria-label="About Samvaada" className="mt-12">
        <AboutFea />
      </section>

      {/* GALLERY */}
      <section id="gallery" aria-label="Meet the team" className="mt-12 px-4 md:px-8 pb-10">
        <MeetTheTeam />
      </section>
    </main>
  );
};

export default Home;
