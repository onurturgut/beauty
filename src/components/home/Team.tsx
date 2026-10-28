import { useRef } from "react";
import Link from "next/link";
import { mockServices, mockStaff } from "@/lib/data";
import { media } from "@/lib/media";
import { ensureGsap, gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { RevealHeading } from "./Reveal";

export function Team() {
  const ref = useRef<HTMLElement>(null);
  const staff = mockStaff;
  const services = mockServices;

  useGSAP(
    () => {
      ensureGsap();
      if (!staff.length || prefersReducedMotion()) return;
      gsap.from("[data-member]", {
        autoAlpha: 0,
        y: 60,
        rotateX: 8,
        transformPerspective: 900,
        stagger: 0.12,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-team]", start: "top 80%" },
      });
    },
    { scope: ref, dependencies: [staff.length] },
  );

  return (
    <section id="ekip" ref={ref} className="bg-cream py-28 lg:py-40">
      <div className="container-lux">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="eyebrow mb-8 text-accent">05 / Uzman Kadro</p>
            <RevealHeading className="display-section max-w-3xl text-espresso">
              Güzelliğiniz, <em>uzman ellerde.</em>
            </RevealHeading>
          </div>
        </div>
        <div data-team className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {staff.map((m, i) => {
            const names = m.staff_services
              .map((x) => services.find((s) => s.id === x.service_id)?.name)
              .filter(Boolean);
            return (
              <article
                key={m.id}
                data-member
                className={`group ${i === 1 ? "lg:mt-20" : ""}`}
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={media(m.photo_key)}
                    alt={m.full_name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1000ms] ease-[var(--ease-lux)] group-hover:scale-105"
                  />
                </div>
                <div className="mt-6 transition-transform duration-300 group-hover:translate-x-2">
                  <p className="eyebrow text-accent">{m.title}</p>
                  <h3 className="mt-2 font-display text-4xl text-espresso">
                    {m.full_name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {m.bio}
                  </p>
                  {names.length > 0 && (
                    <p className="mt-3 text-xs text-muted-foreground">
                      {names.join(" · ")}
                    </p>
                  )}
                  <Link
                    href={`/randevu?uzman=${encodeURIComponent(m.id)}`}
                    className="mt-5 inline-block border-b border-espresso pb-1 text-xs uppercase tracking-[0.18em] text-espresso hover:border-accent hover:text-accent"
                  >
                    Randevu Al
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
