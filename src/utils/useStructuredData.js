import { useEffect } from "react";

/**
 * Custom React hook that injects JSON-LD structured data into the document head.
 * Accepts a JavaScript object (or null/undefined) and injects it as a
 * <script type="application/ld+json"> tag. Cleans up on unmount or when data changes.
 *
 * @param {Object|null} data - The structured data object to inject, or null/undefined to skip.
 */
const useStructuredData = (data) => {
  useEffect(() => {
    if (data == null) return;

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [JSON.stringify(data)]);
};

export default useStructuredData;
