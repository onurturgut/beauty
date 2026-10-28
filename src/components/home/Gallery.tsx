import { useRef, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { galleryQuery } from "@/lib/data";
import { media } from "@/lib/media";
import { ensureGsap, gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { RevealHeading } from "./Reveal";

const spans = [
  "md:col-span-7 aspect-[16/10]",
  "md:col-span-5 aspect-[4/5]",
  "md:col-span-4 aspect-[3/4]",
  "md:col-span-4 aspect-[3/4] md:mt-16",
  "md:col-span-4 aspect-[3/4]",
  "md:col-span-5 aspect-[4/5]",
  "md:col-span-7 aspect-[16/10]",
];

export function Gallery() {
  const ref = useRef<HTMLElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const { data: images = [] } = useQuery(galleryQuery);
  const [active, setActive] = useState<number | null>(null);

  useGSAP(
    () => {
      ensureGsap();
      if (!images.length || prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>("[data-gal]").forEach((el, i) => {
        gsap.fromTo(
          el,
          { clipPath: "inset(18% 0 0 0)", autoAlpha: 0 },
          {
            clipPath: "inset(0% 0 0 0)",
            autoAlpha: 1,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%" },
          },
        );
        gsap.to(el.querySelector("img"), {
          yPercent: i % 2 ? -6 : 6,
          ease: "none",
          scrollTrigger: { trigger: el, scrub: true },
        });
      });
    },
    { scope: ref, dependencies: [images.length] },
  );

  useEffect(() => {
    if (active === null || !boxRef.current) return;
    ensureGsap();
    gsap.fromTo(
      boxRef.current,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.3 },
    );
    gsap.fromTo(
      boxRef.current.querySelector("img"),
      { scale: 0.92, y: 20 },
      { scale: 1, y: 0, duration: 0.5, ease: "power3.out" },
    );
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  const close = () => {
    if (!boxRef.current) return setActive(null);
    gsap.to(boxRef.current, {
      autoAlpha: 0,
      duration: 0.25,
      onComplete: () => setActive(null),
    });
  };

  return (
    <section id="galeri" ref={ref} className="bg-background py-28 lg:py-40">
      <div className="container-lux">
        <p className="eyebrow mb-8 text-accent">06 / Galeri</p>
        <RevealHeading className="display-section mb-16 italic text-espresso">
          Inside Our Studio
        </RevealHeading>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-12 md:gap-6">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              data-gal
              onClick={() => setActive(i)}
              className={`group relative col-span-1 overflow-hidden ${i % 3 === 0 ? "col-span-2" : ""} ${spans[i % spans.length]}`}
              aria-label={`${img.alt} görselini büyüt`}
            >
              <img
                src={media(img.image_key)}
                alt={img.alt}
                loading="lazy"
                className="h-[112%] w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      </div>
      {active !== null && images[active] && (
        <div
          ref={boxRef}
          role="dialog"
          aria-modal="true"
          aria-label={images[active].alt}
          className="fixed inset-0 z-[80] grid place-items-center bg-espresso/90 p-6"
          onClick={close}
        >
          <img
            src={media(images[active].image_key)}
            alt={images[active].alt}
            className="max-h-[85svh] max-w-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            onClick={close}
            aria-label="Kapat"
            className="absolute right-6 top-6 grid h-12 w-12 place-items-center rounded-full bg-cream text-espresso"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </section>
  );
}
