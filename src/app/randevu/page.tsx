import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingPage } from "@/routes/randevu";

export const metadata: Metadata = {
  title: "Online Randevu",
  description:
    "Hizmetinizi, uzmanınızı ve size uygun saati seçin. Üyelik gerekmeden saniyeler içinde randevu oluşturun.",
};

export default function Page() {
  return (
    <Suspense>
      <BookingPage />
    </Suspense>
  );
}
