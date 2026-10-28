import type { Metadata } from "next";
import { KvkkPage } from "@/routes/kvkk";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni",
  description:
    "LUMÉ Beauty Studio kişisel verilerin korunması ve gizlilik aydınlatma metni.",
};

export default function Page() {
  return <KvkkPage />;
}
