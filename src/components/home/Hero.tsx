import { useRef } from "react";
import Link from "next/link";
import { ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImgData from "@/assets/hero.jpg";
import { mockHeroContent } from "@/lib/data";
import {
  ensureGsap,
  gsap,
  SplitText,
  useGSAP,
  prefersReducedMotion,
} from "@/lib/gsap";

const heroImg = heroImgData.src;

const fallback = {
  eyebrow: "YOUR BEAUTY, YOUR RITUAL",
  title: "Kendine ayırdığın\nen güzel an.",
  subtitle:
    "Güzelliğinize özenle dokunduğumuz, kendinizi yeniden keşfedeceğiniz özel bir deneyim.",
};

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const c = { ...fallback, ...mockHeroContent };

  useGSAP(
    () => {
      ensureGsap();
      const reduce = prefersReducedMotion();
      const intro = ref.current!.querySelector("[data-intro]");
      if (reduce) {
        gsap.set(intro, { autoAlpha: 0, display: "none" });
        return;
      }
      let split: SplitText | undefined;
      const run = () => {
        split = SplitText.create("[data-hero-title]", {
          type: "lines",
          mask: "lines",
          linesClass: "hero-line",
        });
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        tl.to("[data-intro-word]", {
          yPercent: -110,
          duration: 0.6,
          ease: "power3.in",
          delay: 0.25,
        })
          .to(
            intro,
            { yPercent: -100, duration: 0.8, ease: "power4.inOut" },
            "-=0.15",
          )
          .set(intro, { display: "none" })
          .fromTo(
            "[data-hero-media]",
            { clipPath: "inset(100% 0 0 0)" },
            { clipPath: "inset(0% 0 0 0)", duration: 1.2 },
            "-=0.45",
          )
          .fromTo(
            "[data-hero-media] img",
            { scale: 1.25 },
            { scale: 1.05, duration: 1.6, ease: "power3.out" },
            "<",
          )
          .from(
            "[data-hero-eyebrow]",
            { autoAlpha: 0, y: 12, duration: 0.6 },
            "-=1.2",
          )
          .from(
            split.lines,
            { yPercent: 110, stagger: 0.09, duration: 1.1 },
            "-=1.05",
          )
          .from(
            "[data-hero-sub]",
            { autoAlpha: 0, y: 20, duration: 0.8, ease: "power3.out" },
            "-=0.7",
          )
          .from(
            "[data-hero-cta] > *",
            {
              autoAlpha: 0,
              y: 16,
              stagger: 0.08,
              duration: 0.6,
              ease: "power3.out",
            },
            "-=0.55",
          )
          .from("[data-hero-deco]", { autoAlpha: 0, duration: 1.2 }, "-=0.8");
        gsap.to("[data-hero-media] img", {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      };
      if (document.fonts?.ready) document.fonts.ready.then(run);
      else run();
      return () => split?.revert();
    },
    { scope: ref, dependencies: [c.title] },
  );

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] overflow-hidden pt-28 lg:pt-0"
    >
      <div
        data-intro
        className="fixed inset-0 z-[70] grid place-items-center bg-sand"
        aria-hidden
      >
        <span className="mask-line">
          <span
            data-intro-word
            className="block font-display text-5xl tracking-[0.3em] text-espresso"
          >
            LUMÉ
          </span>
        </span>
      </div>

      <span
        data-hero-deco
        aria-hidden
        className="pointer-events-none absolute -left-4 bottom-6 select-none font-display text-[22vw] italic leading-none text-sand lg:text-[16rem]"
      >
        ritual
      </span>

      <div className="container-lux relative grid min-h-[100svh] items-center gap-10 pb-16 lg:grid-cols-12 lg:pb-0">
        <div className="lg:col-span-6 lg:pt-24">
          <p
            data-hero-eyebrow
            className="eyebrow mb-8 flex items-center gap-4 text-accent"
          >
            <span className="h-px w-10 bg-accent" />
            {c.eyebrow}
          </p>
          <h1
            data-hero-title
            className="display-hero whitespace-pre-line text-espresso"
          >
            {c.title}
          </h1>
          <p
            data-hero-sub
            className="mt-8 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            {c.subtitle}
          </p>
          <div data-hero-cta className="mt-10 flex flex-wrap gap-3">
            <Button asChild variant="lux" size="xl">
              <Link href="/randevu">Randevu Oluştur</Link>
            </Button>
            <Button asChild variant="luxOutline" size="xl">
              <Link href="/#hizmetler">
                Hizmetleri Keşfet <ArrowDownRight />
              </Link>
            </Button>
          </div>
        </div>
        <div className="relative lg:col-span-5 lg:col-start-8 lg:pt-20">
          <div
            data-hero-media
            className="relative ml-auto aspect-[4/5] w-full max-w-[540px] overflow-hidden rounded-t-[999px]"
          >
            <img
              src={heroImg}
              alt="Doğal ışıkta parlayan cilde sahip bir kadın portresi"
              width={1088}
              height={1440}
              fetchPriority="high"
              className="h-full w-full object-cover"
            />
          </div>
          <p
            data-hero-deco
            className="eyebrow absolute -left-2 bottom-8 hidden rotate-[-90deg] origin-left text-muted-foreground lg:block"
          >
            Est. 2026 — Nişantaşı
          </p>
        </div>
      </div>
    </section>
  );
}
