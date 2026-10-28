import { useRef } from "react";
import salonData from "@/assets/salon.jpg";
import skincareData from "@/assets/skincare.jpg";
import { RevealHeading, RevealGroup } from "./Reveal";
import { ensureGsap, gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

const salon = salonData.src;
const skincare = skincareData.src;

export function Philosophy() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      ensureGsap();
      if (prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>("[data-par]").forEach((el) => {
        const speed = Number(el.dataset["par"]);
        gsap.fromTo(
          el,
          { yPercent: speed },
          {
            yPercent: -speed,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
        gsap.fromTo(
          el.querySelector("img"),
          { scale: 1.18 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <section id="felsefe" ref={ref} className="bg-cream py-28 lg:py-44">
      <div className="container-lux grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow mb-10 text-accent">01 / Our Philosophy</p>
          <RevealHeading className="display-section italic text-espresso">
            Beauty is a feeling.
          </RevealHeading>
          <RevealGroup className="mt-10 space-y-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
            <p className="font-display text-2xl not-italic text-espresso sm:text-3xl">
              Güzellik yalnızca görünüş değil, kendine verdiğin değerdir.
            </p>
            <p>
              LUMÉ'de her bakım, sizi dinleyerek başlar. Acele etmeden,
              cildinize ve ritminize uygun bir plan hazırlıyor; dingin bir
              ortamda, en sevdiğiniz hâlinizi ortaya çıkarıyoruz.
            </p>
            <p>
              Seçkin ürünler, titiz hijyen ve her detayda zarafet — çünkü
              kendinize ayırdığınız zaman en değerli zamandır.
            </p>
          </RevealGroup>
        </div>
        <div className="relative grid grid-cols-12 gap-4 lg:col-span-6 lg:col-start-7">
          <div data-par="6" className="col-span-8 aspect-[3/4] overflow-hidden">
            <img
              src={salon}
              alt="Doğal ışık alan sakin bakım odası"
              loading="lazy"
              width={1920}
              height={1088}
              className="h-full w-full object-cover"
            />
          </div>
          <div
            data-par="-14"
            className="col-span-5 col-start-8 -mt-24 aspect-[4/5] self-end overflow-hidden lg:-mt-40"
          >
            <img
              src={skincare}
              alt="Uzman eller ile cilt bakımı"
              loading="lazy"
              width={1024}
              height={1280}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
