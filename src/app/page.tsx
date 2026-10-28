import type { Metadata } from "next";
import { HomePage } from "@/routes/index";

export const metadata: Metadata = {
  title: "Kendine ayırdığın en güzel an",
  description:
    "Nişantaşı'nda cilt bakımı, ipek kirpik, kaş tasarımı, manikür ve profesyonel makyaj. Üye olmadan online randevu alın.",
};

export default function Page() {
  return <HomePage />;
}
