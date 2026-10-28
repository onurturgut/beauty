export const mockServices = [
  {
    id: "signature-cilt-bakimi",
    name: "Signature Cilt Bakımı",
    description:
      "Cildinize özel analizle başlayan, derin temizlik ve yoğun nem ritüeli.",
    duration_min: 90,
    price: 2400,
    image_key: "skincare",
    sort: 1,
    category: { name: "Cilt Bakımı", slug: "cilt-bakimi" },
  },
  {
    id: "manikur-pedikur",
    name: "Manikür & Pedikür",
    description:
      "Bakım, şekillendirme ve kalıcı oje ile kusursuz eller ve ayaklar.",
    duration_min: 75,
    price: 1200,
    image_key: "nails",
    sort: 2,
    category: { name: "Manikür & Pedikür", slug: "manikur-pedikur" },
  },
  {
    id: "ipek-kirpik",
    name: "İpek Kirpik",
    description: "Doğal ya da hacimli; göz yapınıza göre tel tel uygulama.",
    duration_min: 120,
    price: 1800,
    image_key: "lashes",
    sort: 3,
    category: { name: "İpek Kirpik", slug: "ipek-kirpik" },
  },
  {
    id: "kas-kirpik-tasarimi",
    name: "Kaş & Kirpik Tasarımı",
    description: "Yüz oranlarınıza uygun kaş tasarımı, laminasyon ve lifting.",
    duration_min: 45,
    price: 900,
    image_key: "brows",
    sort: 4,
    category: { name: "Kaş & Kirpik Tasarımı", slug: "kas-kirpik" },
  },
  {
    id: "profesyonel-makyaj",
    name: "Profesyonel Makyaj",
    description: "Gün, gece ve özel davetler için kalıcı, ışıltılı makyaj.",
    duration_min: 60,
    price: 2200,
    image_key: "makeup",
    sort: 5,
    category: { name: "Profesyonel Makyaj", slug: "makyaj" },
  },
  {
    id: "isilti-ritueli",
    name: "Işıltı Ritüeli",
    description: "Kısa sürede tazelenmek isteyenler için yüz masajı ve maske.",
    duration_min: 45,
    price: 1100,
    image_key: "salon",
    sort: 6,
    category: { name: "Diğer Uygulamalar", slug: "diger" },
  },
] as const;

export const mockStaff = [
  {
    id: "elif-aydin",
    full_name: "Elif Aydın",
    title: "Cilt Bakım Uzmanı",
    bio: "Cilt sağlığına bütünsel yaklaşımı ve kişiye özel bakım ritüelleriyle tanınır.",
    photo_key: "staff1",
    sort: 1,
    staff_services: [
      { service_id: "signature-cilt-bakimi" },
      { service_id: "isilti-ritueli" },
    ],
  },
  {
    id: "selin-kaya",
    full_name: "Selin Kaya",
    title: "Kaş & Kirpik Uzmanı",
    bio: "Doğal görünen dönüşümler ve yüz oranlarına uygun tasarımlar konusunda uzmandır.",
    photo_key: "staff2",
    sort: 2,
    staff_services: [
      { service_id: "ipek-kirpik" },
      { service_id: "kas-kirpik-tasarimi" },
    ],
  },
  {
    id: "deniz-arslan",
    full_name: "Deniz Arslan",
    title: "Makyaj & Tırnak Uzmanı",
    bio: "Editoryal çekimlerden özel davetlere uzanan zarif ve modern uygulamalar tasarlar.",
    photo_key: "staff3",
    sort: 3,
    staff_services: [
      { service_id: "manikur-pedikur" },
      { service_id: "profesyonel-makyaj" },
    ],
  },
] as const;

export const mockSettings = {
  closed_dates: [] as string[],
  max_advance_days: 60,
  min_lead_minutes: 120,
  slot_step_min: 30,
};

export const mockGallery = [
  { id: "gallery-1", image_key: "salon", alt: "Aydınlık bakım odası", sort: 1 },
  {
    id: "gallery-2",
    image_key: "skincare",
    alt: "Cilt bakımı uygulaması",
    sort: 2,
  },
  { id: "gallery-3", image_key: "nails", alt: "Nude manikür", sort: 3 },
  { id: "gallery-4", image_key: "lashes", alt: "İpek kirpik detayı", sort: 4 },
  { id: "gallery-5", image_key: "makeup", alt: "Profesyonel makyaj", sort: 5 },
  { id: "gallery-6", image_key: "brows", alt: "Kaş tasarımı", sort: 6 },
  { id: "gallery-7", image_key: "hero", alt: "Doğal ışıkta portre", sort: 7 },
] as const;

export const mockHeroContent = {
  eyebrow: "YOUR BEAUTY, YOUR RITUAL",
  title: "Kendine ayırdığın\nen güzel an.",
  subtitle:
    "Güzelliğinize özenle dokunduğumuz, kendinizi yeniden keşfedeceğiniz özel bir demo deneyimi.",
};
