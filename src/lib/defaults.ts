import type { PublicSettings } from "./types";

// DEMO / SAMPLE values. Replace everything from the admin dashboard before going live.
export const defaultSettings: PublicSettings = {
  nameAr: "مطعم الصالحين",
  nameEn: "Al Saleheen Restaurant",
  taglineAr: "أكل مصري أصيل بروح إسكندرانية",
  taglineEn: "Authentic Egyptian food, Alexandrian soul",
  descAr: "مطعم الصالحين في الدخيلة بالإسكندرية. أطباق مصرية مطهية بعناية وخدمة توصيل واستلام من المطعم.",
  descEn: "Al Saleheen Restaurant in Dekhela, Alexandria. Carefully prepared Egyptian dishes with delivery and pickup.",
  phone: "+20 100 000 0000", // SAMPLE
  whatsapp: "201000000000", // SAMPLE
  addressAr: "شارع رضوان، متفرع من الشارع الرئيسي، الهانوفيل، الدخيلة، الإسكندرية",
  addressEn: "Ridwan St, off the main street, Al Hanouvel, Dekhela, Alexandria, Egypt",
  mapEmbedUrl: "",
  mapsLink: "",
  lat: null,
  lng: null,
  hoursAr: "يوميًا: 12 ظهرًا – 1 صباحًا", // SAMPLE
  hoursEn: "Daily: 12:00 PM – 1:00 AM", // SAMPLE
  openingSpec: "Mo-Su 12:00-24:00", // SAMPLE
  facebook: "https://facebook.com/", // SAMPLE
  instagram: "https://instagram.com/", // SAMPLE
  tiktok: "",
  logoUrl: "",
  heroImageUrl: "",
  storyJson: [
    { titleAr: "البداية", titleEn: "The Beginning", textAr: "بدأت الفكرة بمطبخ بسيط وإيمان بأن الأكل الجيد يجمع الناس.", textEn: "It began with a simple kitchen and a belief that good food brings people together." },
    { titleAr: "الخبرة", titleEn: "Experience", textAr: "وصفات مصرية نعرفها ونتقنها، تُحضَّر بنفس الصبر كل يوم.", textEn: "Egyptian recipes we know well, prepared with the same patience every day." },
    { titleAr: "الجودة", titleEn: "Quality", textAr: "خامات مختارة، نظافة، وطعم ثابت في كل طلب.", textEn: "Selected ingredients, cleanliness, and a consistent taste in every order." },
    { titleAr: "اليوم", titleEn: "Today", textAr: "نستقبلكم في الدخيلة، ونوصّل لحد باب بيتكم.", textEn: "We welcome you in Dekhela, and deliver to your door." },
  ],
  deliveryEnabled: true,
  pickupEnabled: true,
  deliveryFee: 20,
  minOrder: 0,
  isDemo: true,
};
