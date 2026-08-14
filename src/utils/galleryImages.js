// Homepage "Photo Gallery" collage source.
//
// The live list lives in Firestore at siteContent/photoGallery { urls: [...] }
// so an admin can edit it from /admin/gallery without a redeploy. The constant
// below is the seed/fallback: it keeps the homepage populated before the doc is
// created, and if the read is denied. Do NOT treat a fallback render as success
// — fetchGalleryImages surfaces the real error to the caller.
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../components/Firebase/firebase.config";

export const galleryDocRef = () => doc(db, "siteContent", "photoGallery");

export const FALLBACK_GALLERY_IMAGES = [
  "https://gbbpj64dws.ufs.sh/f/o9wD7Q4V78YXqQs4Zd5EetbCxrHgMTRofDqJ0i5umynQVXOL",
  "https://gbbpj64dws.ufs.sh/f/o9wD7Q4V78YXHy4JH5vjRBaFQcwTSbCPJr956qdtXV87pzuo",
  "https://gbbpj64dws.ufs.sh/f/o9wD7Q4V78YXVuERPn3xbgfF3Xud9NIkqnLD8Cs7ZoRj62MW",
  "https://gbbpj64dws.ufs.sh/f/o9wD7Q4V78YXpiuiS3mDHWJmSIVo6yeCPw4GMBNZlrX2j1hn",
  "https://gbbpj64dws.ufs.sh/f/o9wD7Q4V78YXjlypC2Tqf53PeZK1VitXxaRHrQmFOYlEnBJ8",
  "https://gbbpj64dws.ufs.sh/f/o9wD7Q4V78YXdmquBVrGSaoICXRWQpjwN6uUzA0MkmtL9q18",
  "https://gbbpj64dws.ufs.sh/f/o9wD7Q4V78YXkAPPlcgMQMWlVLnim6GOzKNaYkdD7FU9I5p4",
  "https://gbbpj64dws.ufs.sh/f/o9wD7Q4V78YXTNSFJ3e14OjmaBCx2MVWkz0DJ8FdUty5iTKw",
  "https://gbbpj64dws.ufs.sh/f/o9wD7Q4V78YX5SCG69zmoIJvrUzu49WheiK6E8YZRlxXjw3P",
  "https://gbbpj64dws.ufs.sh/f/o9wD7Q4V78YXrwNpFr7tcQ4hBHw2vjdVaGJAixZYPR7ICLys",
  "https://gbbpj64dws.ufs.sh/f/o9wD7Q4V78YXQPBp45kTeqEGVCSlJkn0RPaO4DIZ3Uoigtjb",
  "https://gbbpj64dws.ufs.sh/f/o9wD7Q4V78YXDxcAUDsaCeAENJg2a68dyV0TbBj79sZ4pUxP",
  "https://gbbpj64dws.ufs.sh/f/o9wD7Q4V78YX2NOyWULGOWqPiAQeKCzlm3N6auvcyk9jRnfJ",
  "https://gbbpj64dws.ufs.sh/f/o9wD7Q4V78YX6a4SApuj0DkoSdYcQMtyU13wRApNWu8mv7zV",
  "https://gbbpj64dws.ufs.sh/f/o9wD7Q4V78YXodGke84V78YXxtauKWrSDpPEqTfIn05dFGwg",
  "https://gbbpj64dws.ufs.sh/f/o9wD7Q4V78YXrbDsmop7tcQ4hBHw2vjdVaGJAixZYPR7ICLy",
  "https://gbbpj64dws.ufs.sh/f/o9wD7Q4V78YXNXGw69o4WqgS78HnKklFzZT23eviLY59QhBV",
  "https://gbbpj64dws.ufs.sh/f/o9wD7Q4V78YXnLLcgLqMYu2D4ZGWOrPb3lNi6CU5otL8Aeax",
  "https://gbbpj64dws.ufs.sh/f/o9wD7Q4V78YXNCLw2Wo4WqgS78HnKklFzZT23eviLY59QhBV",
  "https://gbbpj64dws.ufs.sh/f/o9wD7Q4V78YXBmxhAnQTF05a4mbZRKfeqXWLDBNvVAY6zCOQ",
  "https://gbbpj64dws.ufs.sh/f/o9wD7Q4V78YXDvYjhkaCeAENJg2a68dyV0TbBj79sZ4pUxPI",
  "https://gbbpj64dws.ufs.sh/f/o9wD7Q4V78YXxKkKACWhJ9u60kHDRj1QYznP4UE8rpBaMFZc",
  "https://gbbpj64dws.ufs.sh/f/o9wD7Q4V78YXzU83UBdAFXUCg7zkcR93G0K6LEPobx8jrTWB",
  "https://gbbpj64dws.ufs.sh/f/o9wD7Q4V78YXR9udItJcao70yfUQYEdnHecXxiNhtvJq98Tg",
  "https://gbbpj64dws.ufs.sh/f/o9wD7Q4V78YXWfpr8tRztkMe560bRSpAmUQKYVO21ysdDB3G",
  "https://gbbpj64dws.ufs.sh/f/o9wD7Q4V78YXhQsuUC9oQq6zePMuTy4JwrtXRVL2ghZ7kBCj",
  "https://gbbpj64dws.ufs.sh/f/o9wD7Q4V78YXU50PdlVgXKoVSryFCeO6Yns9JcuGNv4wpiHq",
];

/**
 * Read the gallery URL list.
 * @returns {Promise<{urls: string[], source: "firestore"|"fallback", error?: Error}>}
 *   `source` lets the caller tell "admin has configured nothing" apart from
 *   "the read failed and you are looking at the hardcoded seed".
 */
export async function fetchGalleryImages() {
  try {
    const snap = await getDoc(galleryDocRef());
    const urls = snap.exists() ? snap.data().urls : null;
    if (Array.isArray(urls) && urls.length > 0) {
      return { urls, source: "firestore" };
    }
    return { urls: FALLBACK_GALLERY_IMAGES, source: "fallback" };
  } catch (error) {
    return { urls: FALLBACK_GALLERY_IMAGES, source: "fallback", error };
  }
}

/** Overwrite the whole list (add/remove/reorder all go through this). */
export function saveGalleryImages(urls) {
  return setDoc(galleryDocRef(), { urls }, { merge: true });
}
