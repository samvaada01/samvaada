import { useEffect } from "react";

const BASE_TITLE = "Samvaada | NMAMIT Event Archive & Community";
const BASE_DESCRIPTION =
  "The official event archive and student community platform of NMAMIT. Stay updated with college events, join your branch community, and access event galleries.";
const BASE_URL = "https://samvaada-nmamit.in";
const BASE_OG_IMAGE = "https://samvaada-nmamit.in/og-image.png";

/**
 * Helper: get or create a <meta> tag by attribute selector.
 * Returns the element so we can set its `content`.
 */
function getOrCreateMeta(attr, value) {
  let el = document.querySelector(`meta[${attr}='${value}']`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr.split("=")[0], value); // e.g. "name" or "property"
    // More robust: parse attr type
    if (attr.startsWith("name")) {
      el.setAttribute("name", value);
    } else if (attr.startsWith("property")) {
      el.setAttribute("property", value);
    }
    document.head.appendChild(el);
  }
  return el;
}

/**
 * Helper: get or create a <link rel="canonical"> tag.
 */
function getOrCreateCanonical() {
  let el = document.querySelector("link[rel='canonical']");
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  return el;
}

/**
 * useSEO – sets page‑level SEO meta tags reactively.
 *
 * @param {Object} options
 * @param {string} [options.title]       – page title
 * @param {string} [options.description] – meta description
 * @param {string} [options.canonical]   – canonical URL (path or full URL)
 * @param {string} [options.ogImage]     – Open Graph / Twitter image URL
 */
export default function useSEO({
  title,
  description,
  canonical,
  ogImage,
} = {}) {
  useEffect(() => {
    const resolvedTitle = title || BASE_TITLE;
    const resolvedDesc = description || BASE_DESCRIPTION;
    const resolvedImage = ogImage || BASE_OG_IMAGE;
    const resolvedCanonical = canonical
      ? canonical.startsWith("http")
        ? canonical
        : `${BASE_URL}${canonical}`
      : BASE_URL;

    // — Title —
    const prevTitle = document.title;
    document.title = resolvedTitle;

    // — Meta description —
    const metaDesc = getOrCreateMeta("name", "description");
    const prevDesc = metaDesc.getAttribute("content");
    metaDesc.setAttribute("content", resolvedDesc);

    // — Open Graph —
    const ogTitleEl = getOrCreateMeta("property", "og:title");
    const prevOgTitle = ogTitleEl.getAttribute("content");
    ogTitleEl.setAttribute("content", resolvedTitle);

    const ogDescEl = getOrCreateMeta("property", "og:description");
    const prevOgDesc = ogDescEl.getAttribute("content");
    ogDescEl.setAttribute("content", resolvedDesc);

    const ogUrlEl = getOrCreateMeta("property", "og:url");
    const prevOgUrl = ogUrlEl.getAttribute("content");
    ogUrlEl.setAttribute("content", resolvedCanonical);

    const ogImageEl = getOrCreateMeta("property", "og:image");
    const prevOgImage = ogImageEl.getAttribute("content");
    ogImageEl.setAttribute("content", resolvedImage);

    // — Twitter Card —
    const twTitleEl = getOrCreateMeta("name", "twitter:title");
    const prevTwTitle = twTitleEl.getAttribute("content");
    twTitleEl.setAttribute("content", resolvedTitle);

    const twDescEl = getOrCreateMeta("name", "twitter:description");
    const prevTwDesc = twDescEl.getAttribute("content");
    twDescEl.setAttribute("content", resolvedDesc);

    const twUrlEl = getOrCreateMeta("name", "twitter:url");
    const prevTwUrl = twUrlEl.getAttribute("content");
    twUrlEl.setAttribute("content", resolvedCanonical);

    const twImageEl = getOrCreateMeta("name", "twitter:image");
    const prevTwImage = twImageEl.getAttribute("content");
    twImageEl.setAttribute("content", resolvedImage);

    // — Canonical —
    const canonicalEl = getOrCreateCanonical();
    const prevCanonical = canonicalEl.getAttribute("href");
    canonicalEl.setAttribute("href", resolvedCanonical);

    // — Cleanup: restore previous values on unmount —
    return () => {
      document.title = prevTitle || BASE_TITLE;
      metaDesc.setAttribute("content", prevDesc || BASE_DESCRIPTION);

      ogTitleEl.setAttribute("content", prevOgTitle || BASE_TITLE);
      ogDescEl.setAttribute("content", prevOgDesc || BASE_DESCRIPTION);
      ogUrlEl.setAttribute("content", prevOgUrl || BASE_URL);
      ogImageEl.setAttribute("content", prevOgImage || BASE_OG_IMAGE);

      twTitleEl.setAttribute("content", prevTwTitle || BASE_TITLE);
      twDescEl.setAttribute("content", prevTwDesc || BASE_DESCRIPTION);
      twUrlEl.setAttribute("content", prevTwUrl || BASE_URL);
      twImageEl.setAttribute("content", prevTwImage || BASE_OG_IMAGE);

      canonicalEl.setAttribute("href", prevCanonical || BASE_URL);
    };
  }, [title, description, canonical, ogImage]);
}
