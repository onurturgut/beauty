import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ensureGsap, gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { RevealHeading } from "./Reveal";

export function BookingCta() {
  const ref = useRef<HTMLElement>(null);
  const btn = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      ensureGsap();
      if (prefersReducedMotion()) return;
      gsap.to("[data-blob]", {
        yPercent: (i) => (i ? -20 : 20),
        xPercent: (i) => (i ? 10 : -10),
        ease: "none",
        scrollTrigger: { trigger: ref.current, scrub: true },
      });
      const mm = gsap.matchMedia();
      mm.add("(hover: hover) and (pointer: fine)", () => {
        const el = btn.current!;
        const xTo = gsap.quickTo(el, "x", {
          duration: 0.4,
          ease: "power3.out",
        });
        const yTo = gsap.quickTo(el, "y", {
          duration: 0.4,
          ease: "power3.out",
        });
        const move = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          xTo((e.clientX - r.left - r.width / 2) * 0.3);
          yTo((e.clientY - r.top - r.height / 2) * 0.3);
        };
        const leave = () => {
          xTo(0);
          yTo(0);
        };
        el.addEventListener("mousemove", move);
        el.addEventListener("mouseleave", leave);
        return () => {
          el.removeEventListener("mousemove", move);
          el.removeEventListener("mouseleave", leave);
        };
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-blush py-32 lg:py-48"
    >
      <div
        data-blob
        aria-hidden
        className="absolute -left-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-sand/60 blur-3xl"
      />
      <div
        data-blob
        aria-hidden
        className="absolute -bottom-40 right-0 h-[32rem] w-[32rem] rounded-full bg-taupe/40 blur-3xl"
      />
      <div className="container-lux relative text-center">
        <p className="eyebrow mb-8 text-espresso/70">07 / Randevu</p>
        <RevealHeading className="display-hero mx-auto max-w-5xl text-espresso">
          Güzelliğine <em>zaman ayır.</em>
        </RevealHeading>
        <p className="mx-auto mt-8 max-w-md text-espresso/75">
          Kendine özel bir an yaratmak için sana en uygun zamanı seç.
        </p>
        <div ref={btn} className="mt-12 inline-block">
          <Button asChild variant="lux" size="xl" className="h-16 px-12">
            <Link href="/randevu">
              Online Randevu Oluştur <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
