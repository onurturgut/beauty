import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export function KvkkPage() {
  return (
    <>
      <Header />
      <main className="bg-background pb-28 pt-36">
        <article className="container-lux max-w-3xl space-y-6 text-muted-foreground">
          <p className="eyebrow text-accent">Gizlilik</p>
          <h1 className="display-section text-espresso">
            KVKK Aydınlatma Metni
          </h1>
          <p className="border-l-2 border-accent pl-4 text-sm">
            Bu metin örnek niteliğindedir; yayına almadan önce hukuk
            danışmanınızla gözden geçirin.
          </p>
          <p>
            LUMÉ Beauty Studio ("Salon") olarak, 6698 sayılı Kişisel Verilerin
            Korunması Kanunu kapsamında veri sorumlusu sıfatıyla kişisel
            verilerinizi işlemekteyiz.
          </p>
          <h2 className="font-display text-3xl text-espresso">
            İşlenen veriler
          </h2>
          <p>
            Ad, soyad, telefon numarası, isteğe bağlı e-posta adresi, randevu
            bilgileri ve randevu notunuz.
          </p>
          <h2 className="font-display text-3xl text-espresso">
            Amaç ve hukuki sebep
          </h2>
          <p>
            Verileriniz randevunuzun oluşturulması, yönetilmesi ve randevunuzla
            ilgili sizinle iletişim kurulması amacıyla, sözleşmenin kurulması ve
            ifası hukuki sebebine dayanarak işlenir. Ticari elektronik ileti
            gönderimi yalnızca ayrıca açık onay vermeniz hâlinde yapılır.
          </p>
          <h2 className="font-display text-3xl text-espresso">
            Saklama ve aktarım
          </h2>
          <p>
            Verileriniz güvenli altyapıda saklanır, yalnızca yetkili salon
            personelince erişilir ve yasal zorunluluklar dışında üçüncü
            kişilerle paylaşılmaz.
          </p>
          <h2 className="font-display text-3xl text-espresso">Haklarınız</h2>
          <p>
            KVKK'nın 11. maddesi uyarınca verilerinize erişme, düzeltilmesini
            veya silinmesini talep etme haklarına sahipsiniz. Talepleriniz için
            salonumuzla iletişime geçebilirsiniz.
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
