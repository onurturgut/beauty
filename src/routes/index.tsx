"use client";

import { Header, MobileBookingBar } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/home/Hero";
import { Philosophy } from "@/components/home/Philosophy";
import { Services } from "@/components/home/Services";
import { Signature } from "@/components/home/Signature";
import { BeforeAfter } from "@/components/home/BeforeAfter";
import { Team } from "@/components/home/Team";
import { Gallery } from "@/components/home/Gallery";
import { BookingCta } from "@/components/home/BookingCta";

export function HomePage() {
  return (
    <>
      <Header animateIn />
      <main>
        <Hero />
        <Philosophy />
        <Services />
        <Signature />
        <BeforeAfter />
        <Team />
        <Gallery />
        <BookingCta />
      </main>
      <Footer />
      <MobileBookingBar />
    </>
  );
}
