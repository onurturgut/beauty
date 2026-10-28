import hero from "@/assets/hero.jpg";
import salon from "@/assets/salon.jpg";
import skincare from "@/assets/skincare.jpg";
import nails from "@/assets/nails.jpg";
import lashes from "@/assets/lashes.jpg";
import makeup from "@/assets/makeup.jpg";
import brows from "@/assets/brows.jpg";
import staff1 from "@/assets/staff1.jpg";
import staff2 from "@/assets/staff2.jpg";
import staff3 from "@/assets/staff3.jpg";

const map: Record<string, string> = {
  hero: hero.src,
  salon: salon.src,
  skincare: skincare.src,
  nails: nails.src,
  lashes: lashes.src,
  makeup: makeup.src,
  brows: brows.src,
  staff1: staff1.src,
  staff2: staff2.src,
  staff3: staff3.src,
};

/** Resolves an image key stored in the database (or a full URL) to a usable src. */
export function media(key?: string | null): string {
  if (!key) return salon.src;
  if (key.startsWith("http")) return key;
  return map[key] ?? salon.src;
}
export const mediaKeys = Object.keys(map);
