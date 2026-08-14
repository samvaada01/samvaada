import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "../components/shared/NavBar/NavBar";
import Footer from "../components/shared/NavBar/Footer";
import ScrollToTop from "../components/shared/NavBar/ScrollToTop";

const Root = () => {
  return (
    <div className="relative bg-ground text-ink min-h-screen font-body selection:text-white">
      {/* Film-grain + vignette atmosphere (sits above content, ignores pointer) */}
      <div className="film-grain" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[55]"
        style={{
          // Scales with the viewport: at a fixed 200px/40px this covered 44% of
          // a 1280px desktop but 72% of a 390px phone, washing out the content.
          // Clamped so it stops growing on very wide monitors.
          boxShadow:
            "inset 0 0 clamp(60px, 15vw, 200px) clamp(12px, 3vw, 40px) rgba(0,0,0,0.85)",
        }}
      />

      <ScrollToTop />
      <NavBar />
      <div>
        <Outlet />
      </div>
      <Footer />
      <ToastContainer
        theme="dark"
        position="top-right"
        autoClose={3500}
        newestOnTop
        limit={3}
        pauseOnFocusLoss={false}
      />
    </div>
  );
};

export default Root;
