import { useEffect, useState, useContext } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
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
import EventCard from "../../shared/EventCard";
import useSEO from "../../../utils/useSEO";
import isAdminEmail from "../../../utils/isAdmin";

const Home = () => {
  useSEO({
    title: "Samvaada | NMAMIT Event Archive & Community",
    description:
      "Samvaada is the official event archive and student community platform of NMAMIT, Nitte. Browse events, view photo galleries, and join your branch community.",
    canonical: "https://samvaada-nmamit.in/",
  });

  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
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
    const fetchEvents = async () => {
      const querySnapshot = await getDocs(collection(db, "events"));
      const eventsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(eventsList);

      // Extract unique academic years
      const years = new Set();
      eventsList.forEach((event) => {
        const date = new Date(event.eventDate);
        // one undefined/garbage date otherwise yields "NaN-NaN", which sorts
        // first and becomes the default filter — hiding every real event
        if (Number.isNaN(date.getTime())) return;
        const month = date.getMonth();
        const year = date.getFullYear();
        // June (5) to May (4) as academic year
        const academicYear =
          month >= 5 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
        years.add(academicYear);
      });
      const sortedYears = Array.from(years).sort().reverse();
      setAcademicYears(sortedYears);

      // Set default year to most recent
      const mostRecentYear = sortedYears[0] || null;
      setSelectedYear(mostRecentYear);
      if (mostRecentYear) filterEventsByYear(mostRecentYear, eventsList);
    };
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filterEventsByYear = (academicYear, eventList = events) => {
    if (!academicYear) {
      setFilteredEvents([]);
      setSelectedYear(null);
      return;
    }

    const [startYear] = academicYear.split("-");
    const startDate = new Date(`${startYear}-06-01`);
    const endDate = new Date(`${parseInt(startYear) + 1}-05-31`);

    const filtered = eventList.filter((event) => {
      const eventDate = new Date(event.eventDate);
      return eventDate >= startDate && eventDate <= endDate;
    });

    const sortedFiltered = filtered.sort(
      (a, b) => new Date(b.eventDate) - new Date(a.eventDate)
    );
    setFilteredEvents(sortedFiltered);
    setSelectedYear(academicYear);
  };

  const handleDelete = async (id) => {
    if (!isAdmin) {
      toast.error("Unauthorized access");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await deleteDoc(doc(db, "events", id));
      setEvents((prev) => prev.filter((event) => event.id !== id));
      setFilteredEvents((prev) => prev.filter((event) => event.id !== id));
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
              onClick={() => filterEventsByYear(year)}
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
        {displayedEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedEvents.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
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
            No events found for {selectedYear || "this year"}.
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
