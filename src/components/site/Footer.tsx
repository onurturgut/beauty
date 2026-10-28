"use client";

import { useRef } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Instagram, MessageCircle, Phone, MapPin, Clock } from "lucide-react";
import { settingsQuery } from "@/lib/data";
import { ensureGsap, gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

export function Footer() {
  const { data: s } = useQuery(settingsQuery);
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
            {"LUMÉ".split("").map((c, i) => (
              <span key={i} data-ft-letter className="inline-block">
                {c}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-14 grid gap-12 border-t border-cream/15 pt-12 md:grid-cols-12">
          <p className="max-w-sm text-sm leading-relaxed text-cream/70 md:col-span-4">
            Nişantaşı'nda, güzelliğe yavaşlayarak ve özenle dokunan bir bakım
            stüdyosu.
          </p>
          <div className="space-y-4 text-sm md:col-span-4">
            {s?.phone && (
              <a
                href={`tel:${s.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-3 hover:text-blush"
              >
                <Phone className="h-4 w-4" />
                {s.phone}
              </a>
            )}
            {s?.whatsapp && (
              <a
                href={`https://wa.me/${s.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 hover:text-blush"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            )}
            {s?.instagram && (
              <a
                href={`https://instagram.com/${s.instagram}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 hover:text-blush"
              >
                <Instagram className="h-4 w-4" />@{s.instagram}
              </a>
            )}
          </div>
          <div className="space-y-4 text-sm md:col-span-4">
            {s?.address && (
              <a
                href={s.maps_url ?? "#"}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-3 hover:text-blush"
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                {s.address}
              </a>
            )}
            {s?.hours_text && (
              <p className="flex items-start gap-3 text-cream/80">
                <Clock className="mt-0.5 h-4 w-4 shrink-0" />
                {s.hours_text}
              </p>
            )}
          </div>
        </div>
        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 text-xs text-cream/50">
          <span>© {new Date().getFullYear()} LUMÉ Beauty Studio</span>
          <div className="flex gap-6">
            <Link href="/kvkk" className="hover:text-cream">
              KVKK & Gizlilik
            </Link>
            <Link href="/randevu" className="hover:text-cream">
              Randevu
            </Link>
            <Link href="/admin" className="hover:text-cream">
              Yönetim
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
