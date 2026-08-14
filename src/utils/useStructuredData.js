import { useEffect } from "react";

/**
 * Custom React hook that injects JSON-LD structured data into the document head.
 * Accepts a JavaScript object (or null/undefined) and injects it as a
 * <script type="application/ld+json"> tag. Cleans up on unmount or when data changes.
 *
 * @param {Object|null} data - The structured data object to inject, or null/undefined to skip.
 */
const useStructuredData = (data) => {
  // callers pass a fresh object literal each render, so key the effect on the
  // serialised value rather than the reference
  const json = data == null ? null : JSON.stringify(data);

  useEffect(() => {
    if (json == null) return;

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = json;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [json]);
};

export default useStructuredData;
