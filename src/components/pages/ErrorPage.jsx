import { Link } from "react-router-dom";
import useSEO from "../../utils/useSEO";

const ErrorPage = () => {
  useSEO({
    title: "Page Not Found | Samvaada NMAMIT",
    description: "The page you are looking for does not exist on Samvaada.",
  });

  return (
    <main role="main" aria-label="Error page" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-ground text-ink px-6">
      <div className="pointer-events-none absolute inset-0 bg-lens-glow opacity-50" />

      <div className="relative text-center max-w-md">
        <h1 className="font-display text-[8rem] leading-none font-bold ink-gradient">404</h1>
        <h2 className="font-display text-2xl font-bold text-ink mt-2 mb-4">Page not found</h2>
        <p className="text-ink-dim text-sm mb-8">
          This page doesn&apos;t exist or has been moved. Check the address and try again.
        </p>
        <Link to="/" className="btn-cine">
          Back to home
        </Link>
      </div>
    </main>
  );
};

export default ErrorPage;
