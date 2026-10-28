import { useRef, type ReactNode, type ElementType } from "react";
import {
  ensureGsap,
  gsap,
  SplitText,
  useGSAP,
  prefersReducedMotion,
} from "@/lib/gsap";

/** Heading that reveals line by line when scrolled into view. */
export function RevealHeading({
  as: Tag = "h2",
  className,
  children,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      ensureGsap();
      if (prefersReducedMotion() || !ref.current) return;
      let split: SplitText | undefined;
      const run = () => {
        if (!ref.current) return;
        split = SplitText.create(ref.current, { type: "lines", mask: "lines" });
        gsap.from(split.lines, {
          yPercent: 110,
          stagger: 0.08,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: { trigger: ref.current, start: "top 85%" },
        });
      };
      if (document.fonts?.ready) document.fonts.ready.then(run);
      else run();
      return () => split?.revert();
    },
    { scope: ref },
  );
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/** Fades & lifts direct children with stagger on scroll. */
export function RevealGroup({
  className,
  children,
  stagger = 0.08,
}: {
  className?: string;
  children: ReactNode;
  stagger?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      ensureGsap();
      if (prefersReducedMotion() || !ref.current) return;
      gsap.from(ref.current.children, {
        autoAlpha: 0,
        y: 32,
        stagger,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%" },
      });
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
