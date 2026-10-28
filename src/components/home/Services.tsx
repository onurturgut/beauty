import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { mockServices } from "@/lib/data";
import { media } from "@/lib/media";
import { formatDuration, formatTRY } from "@/lib/format";
import { ensureGsap, gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { RevealHeading } from "./Reveal";

export function Services() {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const services = mockServices;

  useGSAP(
    () => {
      ensureGsap();
      if (!services.length || prefersReducedMotion()) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const track = trackRef.current!;
        const cards = gsap.utils.toArray<HTMLElement>("[data-svc]");
        const dist = () => track.scrollWidth - window.innerWidth + 64;
        const tween = gsap.to(track, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top top",
            end: () => `+=${dist()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
        cards.forEach((card) => {
          gsap.fromTo(
            card,
            { opacity: 0.45, scale: 0.94 },
            {
              opacity: 1,
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                containerAnimation: tween,
                start: "left 95%",
                end: "left 55%",
                scrub: true,
              },
            },
          );
        });
      });
      mm.add("(max-width: 1023px)", () => {
        gsap.from("[data-svc]", {
          autoAlpha: 0,
          y: 40,
          stagger: 0.1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: trackRef.current, start: "top 85%" },
        });
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [services.length] },
  );

  return (
    <section
      id="hizmetler"
      ref={ref}
      className="relative overflow-hidden bg-background py-24 lg:flex lg:h-[100svh] lg:items-center lg:py-0"
    >
      <div
        ref={trackRef}
        className="flex flex-col gap-14 px-5 sm:px-10 lg:flex-row lg:items-center lg:gap-10 lg:pl-16 lg:pr-[10vw]"
      >
        <div className="shrink-0 lg:w-[34vw]">
          <p className="eyebrow mb-8 text-accent">02 / Hizmetler</p>
          <RevealHeading className="display-section text-espresso">
            Her dokunuşta
            <br />
            <em>yenilenen sen.</em>
          </RevealHeading>
          <p className="mt-8 max-w-sm text-muted-foreground">
            Size özel ritüellerden birini seçin; süre ve başlangıç fiyatlarını
            şeffafça paylaşıyoruz.
          </p>
        </div>
        {services.map((s, i) => (
          <article
            key={s.id}
            data-svc
            className="group relative shrink-0 lg:w-[28vw] lg:max-w-[420px]"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src={media(s.image_key)}
                alt={s.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[var(--ease-lux)] group-hover:scale-[1.07]"
              />
              <span className="absolute inset-0 origin-bottom scale-y-0 bg-espresso/25 transition-transform duration-500 ease-[var(--ease-lux)] group-hover:scale-y-100" />
              <span className="absolute left-5 top-5 font-display text-2xl text-cream">
                0{i + 1}
              </span>
            </div>
            <div className="mt-6 flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow mb-2 text-muted-foreground">
                  {s.category?.name}
                </p>
                <h3 className="font-display text-3xl text-espresso transition-transform duration-300 group-hover:translate-x-2 sm:text-4xl">
                  {s.name}
                </h3>
              </div>
              <ArrowUpRight className="mt-6 h-6 w-6 shrink-0 text-accent transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {s.description}
            </p>
            <div className="mt-5 flex items-center justify-between border-t pt-4 text-sm">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                {formatDuration(s.duration_min)}
              </span>
              {s.price != null && (
                <span className="text-espresso">
                  {formatTRY(s.price)}
                  <span className="text-muted-foreground"> 'den başlayan</span>
                </span>
              )}
            </div>
            <div className="mt-5 flex gap-6 text-xs uppercase tracking-[0.18em]">
              <Link
                href={`/randevu?hizmet=${encodeURIComponent(s.id)}`}
                className="border-b border-espresso pb-1 text-espresso hover:border-accent hover:text-accent"
              >
                Randevu Al
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
