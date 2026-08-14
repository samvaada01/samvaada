import { FaInstagram, FaFacebookF } from "react-icons/fa";
import { MdEmail, MdLocationOn } from "react-icons/md";
import { FiArrowUpRight } from "react-icons/fi";

const socials = [
  { icon: FaInstagram, label: "@nmamit_nitte", href: "https://instagram.com/nmamit_nitte" },
  { icon: FaInstagram, label: "@samvaada_nmamit", href: "https://instagram.com/samvaada_nmamit" },
  { icon: FaInstagram, label: "@nmamighty", href: "https://instagram.com/nmamighty" },
  { icon: FaFacebookF, label: "@nmamit_nitte", href: "https://facebook.com/nmamit_nitte" },
];

const links = [
  { label: "Home", href: "/#home" },
  { label: "Events", href: "/#events" },
  { label: "About Us", href: "/#about" },
  { label: "Gallery", href: "/#gallery" },
];

const Footer = () => {
  return (
    <footer role="contentinfo" className="relative bg-ground-soft text-ink-dim border-t border-white/[0.07] overflow-hidden">
      {/* lens-glow accent line + ambient glow */}
      <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-brand-glow/40 to-transparent" />
      <div className="pointer-events-none absolute -top-24 right-[-6rem] w-[36rem] h-[36rem] bg-lens-glow opacity-40" />

      <div className="relative max-w-screen-xl mx-auto px-6 md:px-8 pt-16 pb-10">
        {/* Manifesto / quote band */}
        <div className="max-w-3xl">
          <p className="font-display text-2xl sm:text-3xl md:text-[2.5rem] leading-tight font-bold text-ink">
            Framing moments that matter,
            <br className="hidden sm:block" />{" "}
            <span className="ink-gradient">and memories that last.</span>
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand + contact */}
          <div className="lg:col-span-5 space-y-5">
            <img
              src="https://gbbpj64dws.ufs.sh/f/o9wD7Q4V78YXPEFRVugwvAQTSePO5RWmirk6BdI0aj74xcuD"
              alt="Samvaada"
              className="h-9"
            />
            <p className="text-sm leading-relaxed max-w-xs text-ink-dim/85">
              The official media &amp; content team of NMAMIT — storytellers,
              creators, and memory-makers.
            </p>
            <div className="space-y-2.5 pt-1">
              <a
                href="https://www.google.com/maps?q=NMAM+Institute+Of+Technology,+Nitte"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm hover:text-ink transition"
              >
                <MdLocationOn className="text-base text-brand-glow shrink-0" />
                NMAM Institute Of Technology, Nitte
              </a>
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=samvaada@nmamit.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm hover:text-ink transition"
              >
                <MdEmail className="text-base text-brand-glow shrink-0" />
                samvaada@nmamit.in
              </a>
            </div>
          </div>

          {/* Explore */}
          <nav aria-label="Explore links" className="lg:col-span-3 text-left">
            <h4 className="cam-label !text-[0.62rem] text-brand-glow/90 mb-5">Explore</h4>
            <ul className="space-y-3">
              {links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="group inline-flex items-center gap-1 text-sm text-ink-dim hover:text-ink transition"
                  >
                    {l.label}
                    <FiArrowUpRight className="text-xs opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Follow */}
          <nav aria-label="Social media links" className="lg:col-span-4 text-left">
            <h4 className="cam-label !text-[0.62rem] text-brand-glow/90 mb-5">Follow Us</h4>
            <ul className="space-y-3">
              {socials.map((s, i) => (
                <li key={i}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 text-sm text-ink-dim hover:text-ink transition"
                  >
                    <span className="grid place-items-center w-8 h-8 rounded-full border border-white/10 group-hover:border-brand-glow/50 group-hover:bg-brand-700/30 transition">
                      <s.icon className="text-xs" />
                    </span>
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-white/[0.07] flex flex-col sm:flex-row items-center justify-between gap-3 text-center">
          <p className="text-xs text-ink-faint">© 2026 Samvaada · All rights reserved</p>
          <p className="text-xs text-ink-faint">
            Crafted with ♥ by{" "}
            <a
              href="http://mithunmallya.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-dim hover:text-ink underline underline-offset-2"
            >
              Mithun
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
