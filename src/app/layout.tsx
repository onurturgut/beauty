import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/styles.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: { default: "LUMÉ Beauty Studio", template: "%s — LUMÉ Beauty Studio" },
  description:
    "Cilt bakımı, ipek kirpik, kaş tasarımı, manikür ve makyaj. LUMÉ Beauty Studio'da online randevu alın.",
  openGraph: { type: "website" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="tr">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
