import { useRef, useState } from "react";
import browsData from "@/assets/brows.jpg";
import { ensureGsap, gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { RevealHeading } from "./Reveal";

const brows = browsData.src;

export function BeforeAfter() {
  const ref = useRef<HTMLElement>(null);
  const [pos, setPos] = useState(50);
  const proxy = useRef({ v: 50 });

  useGSAP(
    () => {
      ensureGsap();
      if (prefersReducedMotion()) return;
      gsap.from("[data-ba]", {
        autoAlpha: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-ba]", start: "top 80%" },
      });
      gsap
        .timeline({
          scrollTrigger: { trigger: "[data-ba]", start: "top 60%" },
          delay: 0.4,
        })
        .to(proxy.current, {
          v: 35,
          duration: 0.7,
          ease: "power2.inOut",
          onUpdate: () => setPos(proxy.current.v),
        })
        .to(proxy.current, {
          v: 65,
          duration: 0.9,
          ease: "power2.inOut",
          onUpdate: () => setPos(proxy.current.v),
        })
        .to(proxy.current, {
          v: 50,
          duration: 0.6,
          ease: "power2.out",
          onUpdate: () => setPos(proxy.current.v),
        });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="bg-sand py-28 lg:py-40">
      <div className="container-lux grid items-center gap-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="eyebrow mb-8 text-accent">04 / Öncesi — Sonrası</p>
          <RevealHeading className="display-section text-espresso">
            Farkı hisset, <em>değişimi gör.</em>
          </RevealHeading>
          <p className="mt-8 text-muted-foreground">
            Ortadaki tutamacı sürükleyerek karşılaştırın. Gerçek müşteri
            sonuçlarını yalnızca izin alınarak paylaşırız.
          </p>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          <div
            data-ba
            className="relative aspect-[4/3] select-none overflow-hidden"
          >
            <img
              src={brows}
              alt="Uygulama sonrası şekillendirilmiş kaş"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
            >
              <img
                src={brows}
                alt="Uygulama öncesi kaş"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover [filter:saturate(0.55)_brightness(0.92)_contrast(0.9)_blur(0.6px)]"
              />
            </div>
            <div
              className="pointer-events-none absolute inset-y-0 w-px bg-cream"
              style={{ left: `${pos}%` }}
            >
              <span className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-cream font-display text-lg text-espresso shadow-lg">
                ⟷
              </span>
            </div>
            <span className="eyebrow absolute left-4 top-4 rounded-full bg-cream/90 px-3 py-1 text-espresso">
              Öncesi
            </span>
            <span className="eyebrow absolute right-4 top-4 rounded-full bg-cream/90 px-3 py-1 text-espresso">
              Sonrası
            </span>
            <span className="eyebrow absolute bottom-4 left-4 rounded-full bg-espresso/80 px-3 py-1 text-cream">
              Demo görsel
            </span>
            <input
              type="range"
              min={0}
              max={100}
              value={pos}
              onChange={(e) => setPos(Number(e.target.value))}
              aria-label="Öncesi ve sonrası karşılaştırma"
              className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
