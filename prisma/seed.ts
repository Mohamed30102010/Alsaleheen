import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { defaultSettings } from "../src/lib/defaults";

const prisma = new PrismaClient();

// ALL items/prices/reviews below are SAMPLE DATA for demo purposes. Replace via /admin.
const MENU: { ar: string; en: string; items: [string, string, string, string, number, boolean?][] }[] = [
  { ar: "المقبلات", en: "Starters", items: [
    ["سلطة بلدي", "Baladi Salad", "خضار طازجة بالليمون والكمون.", "Fresh vegetables with lemon and cumin.", 35],
    ["طحينة", "Tahini", "طحينة ناعمة بزيت الزيتون.", "Smooth tahini with olive oil.", 30],
    ["بابا غنوج", "Baba Ghanoush", "باذنجان مشوي مع الطحينة.", "Smoky aubergine with tahini.", 40],
  ]},
  { ar: "المشويات", en: "Grills", items: [
    ["كباب مشكل", "Mixed Kebab", "كباب وكفتة على الفحم مع الخبز والسلطات.", "Charcoal kebab and kofta with bread and salads.", 320, true],
    ["كفتة مشوية", "Grilled Kofta", "كفتة متبلة تُشوى على الفحم.", "Seasoned kofta grilled over charcoal.", 180, true],
    ["نصف فرخة مشوية", "Half Grilled Chicken", "فراخ متبلة مشوية مع الأرز.", "Marinated grilled chicken with rice.", 150],
  ]},
  { ar: "الوجبات", en: "Meals", items: [
    ["حمام محشي", "Stuffed Pigeon", "حمام محشي فريك بالتتبيلة المصرية.", "Pigeon stuffed with freekeh, Egyptian-style.", 210, true],
    ["طاجن لحم بالبصل", "Beef Tagine with Onions", "لحم بطيء الطهي في الطاجن.", "Slow-cooked beef in a clay tagine.", 190],
  ]},
  { ar: "السندوتشات", en: "Sandwiches", items: [
    ["كبدة إسكندراني", "Alexandrian Liver", "كبدة بالتتبيلة الإسكندراني في عيش فينو.", "Liver in Alexandrian spices in fino bread.", 60, true],
    ["سجق", "Sausage", "سجق بلدي مع الفلفل والطماطم.", "Egyptian sausage with peppers and tomato.", 55],
  ]},
  { ar: "الأرز", en: "Rice", items: [
    ["أرز بالشعرية", "Vermicelli Rice", "أرز مصري بالسمنة والشعرية.", "Egyptian rice with vermicelli.", 40],
    ["أرز معمر", "Creamy Baked Rice", "أرز بالقشطة يُحمَّر في الفرن.", "Creamy rice baked until golden.", 55],
  ]},
  { ar: "المشروبات", en: "Drinks", items: [
    ["ليمون بالنعناع", "Mint Lemonade", "عصير ليمون طازج بالنعناع.", "Fresh lemon with mint.", 35],
    ["شاي", "Tea", "شاي مصري ساخن.", "Hot Egyptian tea.", 15],
  ]},
];

async function main() {
  await prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, ...defaultSettings, storyJson: defaultSettings.storyJson as object },
  });

  if ((await prisma.category.count()) === 0) {
    for (const [ci, c] of MENU.entries()) {
      await prisma.category.create({
        data: {
          nameAr: c.ar, nameEn: c.en, sort: ci,
          items: {
            create: c.items.map(([nameAr, nameEn, descAr, descEn, price, featured], i) => ({
              nameAr, nameEn, descAr, descEn, price, featured: !!featured, sort: i, tags: [],
              extras: c.en === "Grills" || c.en === "Sandwiches"
                ? [{ id: "x1", nameAr: "إضافة طحينة", nameEn: "Extra tahini", price: 10 }, { id: "x2", nameAr: "إضافة عيش", nameEn: "Extra bread", price: 5 }]
                : [],
            })),
          },
        },
      });
    }
  }

  if ((await prisma.review.count()) === 0) {
    await prisma.review.createMany({
      data: [
        { name: "عميل تجريبي ١", rating: 5, textAr: "أكل ممتاز وتوصيل سريع. (رأي تجريبي)", textEn: "Great food and fast delivery. (sample review)", isSample: true, sort: 0 },
        { name: "عميل تجريبي ٢", rating: 5, textAr: "المشويات طعمها رائع. (رأي تجريبي)", textEn: "The grills taste wonderful. (sample review)", isSample: true, sort: 1 },
        { name: "عميل تجريبي ٣", rating: 4, textAr: "جودة ثابتة وأسعار مناسبة. (رأي تجريبي)", textEn: "Consistent quality, fair prices. (sample review)", isSample: true, sort: 2 },
      ],
    });
  }

  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const pass = process.env.ADMIN_PASSWORD;
  if (email && pass) {
    if (pass.length < 10) throw new Error("ADMIN_PASSWORD must be at least 10 characters");
    if (!(await prisma.adminUser.findUnique({ where: { email } }))) {
      await prisma.adminUser.create({ data: { email, passwordHash: await bcrypt.hash(pass, 12) } });
      console.log("[seed] admin user created:", email);
    }
  } else {
    console.warn("[seed] ADMIN_EMAIL / ADMIN_PASSWORD not set -> no admin created.");
  }
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
