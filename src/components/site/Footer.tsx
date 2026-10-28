"use client";

import { useRef } from "react";
import { ExternalLink, Instagram } from "lucide-react";
import { ensureGsap, gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

const socialLinks = [
  {
    label: "Web sitesi",
    href: "https://www.onurturgut.com/",
    icon: ExternalLink,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/aisurix.web/",
    icon: Instagram,
  },
];

export function Footer() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      ensureGsap();
      if (prefersReducedMotion()) return;
      gsap.from("[data-ft-letter]", {
        yPercent: 100,
        stagger: 0.05,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%" },
      });
    },
    { scope: ref },
  );

  return (
    <footer
      id="iletisim"
      ref={ref}
      className="bg-espresso pb-28 pt-20 text-cream sm:pb-12"
    >
      <div className="container-lux">
        <div className="overflow-hidden" aria-label="LUMÉ">
          <div
            className="flex justify-between font-display text-[22vw] leading-[0.8] tracking-tight text-cream/95 lg:text-[18rem]"
            aria-hidden
          >
            {"LUMÉ".split("").map((character, index) => (
              <span key={index} data-ft-letter className="inline-block">
                {character}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-8 border-t border-cream/15 pt-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-3xl text-cream">
              Bu bir demo web sitesidir.
            </p>
            <p className="mt-2 text-sm text-cream/60">
              Gerçek bir işletmeyi veya hizmeti temsil etmez.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center gap-2 border border-cream/25 px-5 text-sm text-cream transition-colors hover:border-blush hover:text-blush"
              >
                <Icon className="h-4 w-4" aria-hidden />
                {label}
              </a>
            ))}
          </div>
        </div>

        <p className="mt-10 text-xs text-cream/45">
          © {new Date().getFullYear()} LUMÉ Beauty Studio — Demo proje
        </p>
      </div>
    </footer>
  );
}
