"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ensureGsap, gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

const links = [
  { label: "Ana Sayfa", hash: "" },
  { label: "Hakkımızda", hash: "felsefe" },
  { label: "Hizmetler", hash: "hizmetler" },
  { label: "Galeri", hash: "galeri" },
  { label: "Ekibimiz", hash: "ekip" },
  { label: "İletişim", hash: "iletisim" },
];

export function Header({ animateIn = false }: { animateIn?: boolean }) {
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useGSAP(
    () => {
      ensureGsap();
      if (
        animateIn &&
        !prefersReducedMotion() &&
        window.matchMedia("(min-width: 1024px)").matches
      ) {
        gsap.fromTo(
          headerRef.current,
          { yPercent: -110, autoAlpha: 0 },
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 0.9,
            ease: "power3.out",
            delay: 0.75,
            onComplete: () => {
              gsap.set(headerRef.current, {
                clearProps: "transform,opacity,visibility",
              });
            },
          },
        );
      }
      tl.current = gsap
        .timeline({ paused: true })
        .set(overlayRef.current, { display: "flex" })
        .fromTo(
          overlayRef.current,
          { clipPath: "inset(0 0 100% 0)" },
          { clipPath: "inset(0 0 0% 0)", duration: 0.55, ease: "power4.inOut" },
        )
        .from(
          "[data-mlink]",
          {
            yPercent: 110,
            autoAlpha: 0,
            stagger: 0.06,
            duration: 0.5,
            ease: "power3.out",
          },
          "-=0.2",
        );
    },
    { scope: headerRef },
  );

  useEffect(() => {
    if (!tl.current) return;
    if (open) {
      tl.current.timeScale(1).play();
      document.body.style.overflow = "hidden";
    } else {
      tl.current.timeScale(1.6).reverse();
      document.body.style.overflow = "";
    }
  }, [open]);

  return (
    <header ref={headerRef} className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "transition-all duration-500 ease-[var(--ease-lux)]",
          compact ? "bg-background/85 backdrop-blur-md border-b py-3" : "py-6",
        )}
      >
        <div className="container-lux flex items-center justify-between gap-6">
          <Link
            href="/"
            className="relative z-[60] font-display text-2xl tracking-[0.18em] text-espresso"
            onClick={() => setOpen(false)}
          >
            LUMÉ
            <span className="ml-2 hidden align-middle font-sans text-[0.6rem] tracking-[0.3em] text-muted-foreground sm:inline">
              BEAUTY STUDIO
            </span>
          </Link>
          <nav
            className="hidden items-center gap-8 lg:flex"
            aria-label="Ana menü"
          >
            {links.map((l) => (
              <Link
                key={l.label}
                href={l.hash ? `/#${l.hash}` : "/"}
                className="group relative text-[0.82rem] tracking-wide text-espresso/80 transition-colors hover:text-espresso"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="lux"
              size={compact ? "default" : "lg"}
              className="hidden sm:inline-flex"
            >
              <Link href="/randevu">Randevu Al</Link>
            </Button>
            <button
              type="button"
              aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              className="relative z-[60] grid h-11 w-11 place-items-center rounded-full border border-espresso/20 text-espresso lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      <div
        ref={overlayRef}
        className="fixed inset-0 z-[55] hidden flex-col justify-between bg-sand px-6 pb-10 pt-28 lg:hidden"
        aria-hidden={!open}
      >
        <nav className="flex flex-col gap-2" aria-label="Mobil menü">
          {links.map((l, i) => (
            <span key={l.label} className="mask-line">
              <Link
                data-mlink
                href={l.hash ? `/#${l.hash}` : "/"}
                onClick={() => setOpen(false)}
                className="flex items-baseline gap-4 py-1 font-display text-5xl text-espresso"
              >
                <span className="font-sans text-xs text-muted-foreground">
                  0{i + 1}
                </span>
                {l.label}
              </Link>
            </span>
          ))}
        </nav>
        <div data-mlink>
          <Button asChild variant="lux" size="xl" className="w-full">
            <Link href="/randevu" onClick={() => setOpen(false)}>
              Online Randevu Oluştur
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

export function MobileBookingBar() {
  return (
    <div className="fixed inset-x-4 bottom-4 z-40 sm:hidden">
      <Button asChild variant="lux" size="xl" className="w-full shadow-lg">
        <Link href="/randevu">Randevu Al</Link>
      </Button>
    </div>
  );
}
