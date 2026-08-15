import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../AuthProvider/AuthProvider";
import logo from "../../../assets/video/logo.png";
import isAdminEmail from "../../../utils/isAdmin";

const ADMIN_LINKS = [
  { to: "/admin/gallery", label: "Photo Gallery" },
  { to: "/admin/community", label: "Community" },
  { to: "/admin/add-event", label: "+ Add Event" },
];

const NavBar = () => {
  const { logOut, user } = useContext(AuthContext);
  const [imgError, setImgError] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Make logout async and navigate to home after success
  const handleLogOut = async () => {
    try {
      await logOut();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // First letter of displayName or "?"
  const avatarChar = user?.displayName
    ? user.displayName[0].toUpperCase()
    : "?";

  const navItems = [
    { id: "home", label: "Home" },
    { id: "events", label: "Events" },
    { id: "about", label: "About Us" },
    { id: "gallery", label: "Gallery" },
  ];

  const handleNavClick = (id) => {
    setMobileOpen(false);

    if (location.pathname === "/") {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    navigate("/");

    const tryScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return true;
      }
      return false;
    };

    setTimeout(() => { if (!tryScroll()) setTimeout(() => { if (!tryScroll()) setTimeout(tryScroll, 220); }, 80); }, 20);
  };

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      {/* Spacer keeps page content below the fixed bar — prevents overlap at any zoom */}
      <div className="h-[var(--nav-h)]" aria-hidden="true" />

      <header className="fixed top-0 left-0 w-full z-[70] h-[var(--nav-h)] bg-ground/85 backdrop-blur-xl border-b border-white/[0.06]">
        {/* thin lens-glow accent under the bar */}
        <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-brand-glow/40 to-transparent" />

        <div className="max-w-screen-xl mx-auto flex items-center h-full px-4 md:px-6">
          {/* Brand */}
          <Link to="/" className="flex items-center shrink-0" aria-label="Home">
            <img
              className="h-8 object-contain"
              src={logo}
              alt="Samvaada"
            />
          </Link>

          {/* Desktop nav */}
          <nav role="navigation" aria-label="Main navigation" className="hidden md:flex flex-1 justify-end items-center gap-8">
            <div className="flex items-center gap-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="group relative text-sm font-medium text-ink-dim hover:text-ink transition-colors duration-300"
                >
                  {item.label}
                  <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-brand-glow transition-all duration-300 group-hover:w-full" />
                </button>
              ))}
            </div>

            {/* Login / Avatar / Admin */}
            <div className="flex items-center gap-3 pl-2 border-l border-white/10">
              {user ? (
                <>
                  {isAdminEmail(user.email) && (
                    <div className="dropdown dropdown-end">
                      <label tabIndex={0} className="btn-cine cursor-pointer gap-2">
                        Control Room
                        <span aria-hidden="true" className="text-[0.6rem] opacity-70">&#9660;</span>
                      </label>
                      {/* blur on click so the focus-within dropdown closes after navigating */}
                      <ul
                        tabIndex={0}
                        onClick={() => document.activeElement?.blur()}
                        className="mt-3 z-[1] p-3 shadow-card menu menu-sm dropdown-content bg-ground-card border border-white/10 rounded-md w-56 gap-2"
                      >
                        {ADMIN_LINKS.map(({ to, label }) => (
                          <li key={to}>
                            <Link to={to} className="btn-cine w-full justify-center">
                              {label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="cursor-pointer">
                      <div className="w-9 h-9 rounded-full ring-1 ring-brand-glow/40 bg-brand-700 flex items-center justify-center text-ink text-sm font-bold overflow-hidden hover:ring-brand-glow transition">
                        {user.photoURL && !imgError ? (
                          <img
                            src={user.photoURL}
                            alt="profile"
                            className="w-full h-full object-cover"
                            onError={() => setImgError(true)}
                          />
                        ) : (
                          <span>{avatarChar}</span>
                        )}
                      </div>
                    </label>
                    <ul
                      tabIndex={0}
                      className="mt-3 z-[1] p-3 shadow-card menu menu-sm dropdown-content bg-ground-card border border-white/10 rounded-md w-60"
                    >
                      <li className="mb-2 pointer-events-none">
                        <div className="block">
                          <p className="cam-label !text-[0.5rem] text-ink-faint">Signed in as</p>
                          <p className="font-display text-lg font-bold text-ink">
                            {user.displayName}
                          </p>
                        </div>
                      </li>
                      <li>
                        <button onClick={handleLogOut} className="btn-cine w-full justify-center">
                          Log Out
                        </button>
                      </li>
                    </ul>
                  </div>
                </>
              ) : (
                <Link to="/login" className="btn-cine">
                  Login
                </Link>
              )}
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden ml-auto flex items-center">
            <button
              onClick={() => setMobileOpen((s) => !s)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              className="p-2 rounded-md text-ink-dim hover:text-ink focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu panel */}
        {mobileOpen && (
          <div id="mobile-menu" className="md:hidden bg-ground/95 backdrop-blur-xl border-t border-white/10">
            <div className="max-w-screen-xl mx-auto px-4 py-4 flex flex-col space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="text-left w-full px-2 py-3 text-sm font-medium text-ink-dim hover:text-ink hover:bg-white/[0.04] rounded-md transition"
                >
                  {item.label}
                </button>
              ))}

              <div className="pt-3 mt-2 border-t border-white/10">
                {user ? (
                  <>
                    {isAdminEmail(user.email) && (
                      <details className="mb-2 group">
                        <summary className="btn-cine w-full justify-center cursor-pointer list-none">
                          Control Room
                          <span aria-hidden="true" className="ml-2 text-[0.6rem] opacity-70 group-open:rotate-180 inline-block transition-transform">
                            &#9660;
                          </span>
                        </summary>
                        <div className="mt-2 space-y-2 pl-2 border-l border-white/10">
                          {ADMIN_LINKS.map(({ to, label }) => (
                            <Link
                              key={to}
                              to={to}
                              className="btn-cine w-full justify-center"
                              onClick={() => setMobileOpen(false)}
                            >
                              {label}
                            </Link>
                          ))}
                        </div>
                      </details>
                    )}
                    <button
                      onClick={async () => {
                        await handleLogOut();
                        setMobileOpen(false);
                      }}
                      className="btn-cine w-full justify-center"
                    >
                      Log Out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="btn-cine w-full justify-center"
                    onClick={() => setMobileOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default NavBar;
