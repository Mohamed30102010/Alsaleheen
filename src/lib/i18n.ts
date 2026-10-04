import type { Locale } from "./types";
const ar = {
  nav: { home: "الرئيسية", menu: "المنيو", story: "قصتنا", signature: "الأطباق المميزة", reviews: "آراء العملاء", contact: "تواصل معنا" },
  lang: "English", skip: "تخطي إلى المحتوى",
  hero: { eyebrow: "مطبخ مصري · الإسكندرية", menu: "شاهد المنيو", order: "اطلب الآن", scroll: "اكتشف" },
  sig: { title: "أشهر أطباق الصالحين", sub: "أطباق يطلبها ضيوفنا مرة بعد مرة", order: "اطلب الطبق" },
  story: { title: "حكاية الصالحين", ph: "صورة المطعم" },
  menu: { title: "المنيو", search: "ابحث عن طبق…", all: "الكل", emptyCat: "لا توجد أطباق في هذا القسم حاليًا.", emptyAll: "المنيو قيد التحديث، تابعونا قريبًا.", emptySearch: "لا توجد نتائج مطابقة لبحثك.", soldOut: "غير متاح حاليًا", add: "أضف للطلب", tags: "التصنيف", dbError: "تعذر تحميل المنيو الآن. حاول مرة أخرى بعد قليل.", photo: "صورة الطبق" },
  modal: { extras: "الإضافات", qty: "الكمية", add: "أضف للسلة", close: "إغلاق" },
  cart: { title: "طلبك", open: "السلة", empty: "سلتك فارغة", emptySub: "اختر من المنيو وابدأ طلبك.", browse: "تصفح المنيو", sub: "المجموع", delivery: "رسوم التوصيل", total: "الإجمالي", next: "متابعة", back: "رجوع", remove: "حذف", inc: "زيادة", dec: "تقليل", step1: "السلة", step2: "بياناتك", step3: "التأكيد", checkout: "إتمام الطلب" },
  form: { name: "الاسم", phone: "رقم الهاتف", address: "العنوان بالتفصيل", notes: "ملاحظات (اختياري)", type: "نوع الطلب", delivery: "توصيل", pickup: "استلام من المطعم", confirm: "تأكيد الطلب", sending: "جارٍ الإرسال…", fix: "راجع البيانات المطلوبة." },
  err: { validation: "بيانات الطلب غير صحيحة.", rate: "محاولات كثيرة، انتظر قليلًا.", unavailable: "بعض الأصناف لم تعد متاحة. راجع السلة.", min_order: "الحد الأدنى للطلب لم يتحقق.", delivery_off: "التوصيل غير متاح حاليًا.", pickup_off: "الاستلام غير متاح حاليًا.", server: "حدث خطأ. حاول مرة أخرى.", network: "تعذر الاتصال بالإنترنت. حاول مرة أخرى." },
  done: { title: "تم استلام طلبك بنجاح", no: "رقم الطلب", status: "الحالة", pending: "قيد المراجعة", wa: "أرسل الطلب عبر واتساب", call: "اتصل بالمطعم", close: "تم" },
  reviews: { title: "آراء العملاء", sample: "آراء تجريبية للعرض فقط" },
  gallery: { title: "لقطات من الصالحين", ph: "صورة", sample: "أماكن صور مؤقتة حتى رفع صور المطعم" },
  contact: { title: "تواصل معنا", address: "العنوان", hours: "مواعيد العمل", call: "اتصل", wa: "واتساب", dir: "الاتجاهات", map: "خريطة موقع المطعم", follow: "تابعنا" },
  footer: { menu: "المنيو", contact: "تواصل", rights: "جميع الحقوق محفوظة", demo: "محتوى تجريبي لأغراض العرض" },
  order: { whatsapp: "طلب جديد", customer: "العميل", type: "نوع الطلب", items: "المنتجات", total: "الإجمالي", address: "العنوان", notes: "ملاحظات", phone: "الهاتف" },
  admin: {},
};
type Dict = typeof ar;
const en: Dict = {
  nav: { home: "Home", menu: "Menu", story: "Our Story", signature: "Signature Dishes", reviews: "Reviews", contact: "Contact" },
  lang: "العربية", skip: "Skip to content",
  hero: { eyebrow: "Egyptian kitchen · Alexandria", menu: "View Menu", order: "Order Now", scroll: "Discover" },
  sig: { title: "Al Saleheen Signatures", sub: "Dishes our guests order again and again", order: "Order this dish" },
  story: { title: "The Al Saleheen Story", ph: "Restaurant photo" },
  menu: { title: "Menu", search: "Search for a dish…", all: "All", emptyCat: "No dishes in this category right now.", emptyAll: "The menu is being updated. Check back soon.", emptySearch: "No dishes match your search.", soldOut: "Currently unavailable", add: "Add to order", tags: "Dietary", dbError: "Couldn't load the menu. Please try again shortly.", photo: "Dish photo" },
  modal: { extras: "Extras", qty: "Quantity", add: "Add to cart", close: "Close" },
  cart: { title: "Your order", open: "Cart", empty: "Your cart is empty", emptySub: "Pick something from the menu to start.", browse: "Browse menu", sub: "Subtotal", delivery: "Delivery fee", total: "Total", next: "Continue", back: "Back", remove: "Remove", inc: "Increase", dec: "Decrease", step1: "Cart", step2: "Your details", step3: "Confirm", checkout: "Checkout" },
  form: { name: "Name", phone: "Phone number", address: "Full address", notes: "Notes (optional)", type: "Order type", delivery: "Delivery", pickup: "Pickup", confirm: "Place order", sending: "Sending…", fix: "Please check the required fields." },
  err: { validation: "Order details are invalid.", rate: "Too many attempts, please wait.", unavailable: "Some items are no longer available. Review your cart.", min_order: "Minimum order not reached.", delivery_off: "Delivery is currently unavailable.", pickup_off: "Pickup is currently unavailable.", server: "Something went wrong. Please try again.", network: "Network error. Please try again." },
  done: { title: "Your order has been received", no: "Order number", status: "Status", pending: "Pending review", wa: "Send order via WhatsApp", call: "Call the restaurant", close: "Done" },
  reviews: { title: "Customer Reviews", sample: "Sample reviews for preview only" },
  gallery: { title: "Moments at Al Saleheen", ph: "Photo", sample: "Temporary placeholders until real photos are uploaded" },
  contact: { title: "Contact Us", address: "Address", hours: "Opening hours", call: "Call", wa: "WhatsApp", dir: "Directions", map: "Restaurant location map", follow: "Follow us" },
  footer: { menu: "Menu", contact: "Contact", rights: "All rights reserved", demo: "Demo content for preview purposes" },
  order: { whatsapp: "New order", customer: "Customer", type: "Order type", items: "Items", total: "Total", address: "Address", notes: "Notes", phone: "Phone" },
  admin: {},
};
export const dict = { ar, en };
export type { Dict };
export const getDict = (l: Locale): Dict => dict[l];
