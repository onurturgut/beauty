import { useRef } from "react";
import salonData from "@/assets/salon.jpg";
import { ensureGsap, gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

const salon = salonData.src;

export function Signature() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      ensureGsap();
      if (prefersReducedMotion()) return;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: "top 80%",
          end: "bottom top",
          scrub: true,
        },
      });
      tl.fromTo(
        "[data-sig-frame]",
        { clipPath: "inset(12% 10% 12% 10%)" },
        { clipPath: "inset(0% 0% 0% 0%)", ease: "none", duration: 0.4 },
      ).fromTo(
        "[data-sig-img]",
        { scale: 1.25, yPercent: -6 },
        { scale: 1, yPercent: 6, ease: "none", duration: 1 },
        0,
      );
      gsap.from("[data-sig-line]", {
        yPercent: 110,
        stagger: 0.12,
        duration: 1.1,
        ease: "power4.out",
        scrollTrigger: { trigger: ref.current, start: "top 40%" },
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="relative bg-background">
      <div
        data-sig-frame
        className="relative h-[90svh] overflow-hidden lg:h-[110svh]"
      >
        <img
          data-sig-img
          src={salon}
          alt="LUMÉ stüdyosunun huzurlu iç mekânı"
          loading="lazy"
          width={1920}
          height={1088}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-espresso/20 to-transparent" />
        <div className="container-lux absolute inset-x-0 bottom-0 pb-16 lg:pb-28">
          <p className="eyebrow mb-6 text-cream/80">
            03 / Signature Experience
          </p>
          <h2 className="display-section max-w-4xl text-cream">
            <span className="mask-line">
              <span data-sig-line className="block">
                Bir bakımın ötesinde,
              </span>
            </span>
            <span className="mask-line">
              <span data-sig-line className="block italic">
                sana özel bir deneyim.
              </span>
            </span>
          </h2>
        </div>
      </div>
    </section>
  );
}
