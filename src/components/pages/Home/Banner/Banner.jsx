import { motion } from "framer-motion";
import logo_text from "../../../../assets/video/samvaada_text.png";
import logo from "../../../../assets/video/samvaada.png";
import HeroFX from "./HeroFX";

const handleScrollToEvents = () => {
  const eventsSection = document.getElementById("events");
  if (eventsSection) {
    eventsSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const Banner = () => {
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.16, delayChildren: 0.1 } },
  };
  const rise = {
    hidden: { opacity: 0, y: 26, filter: "blur(6px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <div className="relative w-full min-h-[calc(100svh-var(--nav-h))] overflow-hidden flex flex-col items-center justify-center px-5 py-16">
      {/* ---- Background atmosphere ---- */}
      <div className="absolute inset-0 bg-gradient-to-b from-ground via-ground-soft to-ground" />
      <div className="absolute inset-0 bg-lens-glow" />
      <div className="absolute inset-0 bg-grid-faint bg-[size:72px_72px] opacity-20 [mask-image:radial-gradient(70%_55%_at_50%_40%,#000_0%,transparent_75%)]" />

      {/* very faint aperture ring behind the logo */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] w-[min(86vw,560px)] aspect-square opacity-[0.08] animate-aperture-spin">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="96" fill="none" stroke="#86AECB" strokeWidth="0.35" strokeDasharray="1 7" />
          <circle cx="100" cy="100" r="72" fill="none" stroke="#86AECB" strokeWidth="0.3" />
        </svg>
      </div>

      {/* subtle 3D darkroom dust */}
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <HeroFX />
      </div>

      {/* ---- Foreground content ---- */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-30 flex flex-col items-center text-center"
      >
        <h1 className="contents">
          <motion.img
            variants={rise}
            src={logo}
            alt="Samvaada Logo"
            className="w-28 sm:w-36 md:w-44 lg:w-52 drop-shadow-[0_10px_40px_rgba(134,174,203,0.2)]"
            draggable="false"
          />
          <motion.img
            variants={rise}
            src={logo_text}
            alt="Samvaada"
            className="w-56 sm:w-72 md:w-[26rem] lg:w-[32rem] mt-1"
            draggable="false"
          />
        </h1>
        <motion.p
          variants={rise}
          className="mt-6 text-base sm:text-lg text-ink-dim font-light text-balance max-w-xs sm:max-w-lg"
        >
          We don&apos;t just capture moments — we preserve memories that define{" "}
          <span className="text-ink font-medium">NMAMIT</span>
        </motion.p>

        <motion.div variants={rise} className="mt-9">
          <button onClick={handleScrollToEvents} className="btn-cine" aria-label="View Events">
            View Events
          </button>
        </motion.div>
      </motion.div>

      {/* ---- Scroll cue ---- */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 1 }}
        onClick={handleScrollToEvents}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 text-ink-faint hover:text-ink transition-colors"
        aria-label="Scroll to events"
      >
        <span className="block w-px h-9 bg-gradient-to-b from-brand-glow/50 to-transparent" />
      </motion.button>
    </div>
  );
};

export default Banner;
