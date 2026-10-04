# مطعم الصالحين · Al Saleheen Restaurant

موقع مطعم كامل (عربي RTL أساسي + إنجليزي LTR) مع منيو، سلة، نظام طلبات، لوحة تحكم، قاعدة بيانات PostgreSQL، ورفع صور على Vercel Blob.

## Tech stack
Next.js 14 (App Router) · TypeScript · Prisma + PostgreSQL · Vercel Blob · jose (JWT) + bcryptjs · Zod · CSS مكتوب يدويًا (Logical Properties للـRTL) — بدون مكتبات أنيميشن.

## النشر من الموبايل (GitHub + Vercel) — بدون Terminal
1. ارفع محتوى الفولدر على GitHub (repo جديد).
2. Vercel → Add New Project → اختر الـrepo.
3. Vercel → Storage → أنشئ **Postgres** (Neon) واربطه بالمشروع. تأكد إن متغير `DATABASE_URL` اتضاف.
4. Vercel → Storage → أنشئ **Blob** واربطه (بيضيف `BLOB_READ_WRITE_TOKEN`).
5. Settings → Environment Variables، أضف:
   - `AUTH_SECRET` = نص عشوائي 32+ حرف
   - `ADMIN_EMAIL` و `ADMIN_PASSWORD` (10 أحرف على الأقل)
   - `NEXT_PUBLIC_SITE_URL` = رابط الموقع النهائي
6. Deploy. أثناء الـBuild بيتم تلقائيًا: إنشاء الجداول (`prisma db push`) + إضافة البيانات التجريبية + إنشاء حساب الأدمن (لو مش موجود).
7. ادخل على `/admin` بالإيميل والباسورد.

> لتغيير باسورد الأدمن لاحقًا: احذف المستخدم من قاعدة البيانات (Neon console) وغيّر `ADMIN_PASSWORD` ثم أعد النشر.

## Environment variables
راجع `.env.example`. كل المتغيرات مذكورة بدون أسرار.

## تشغيل محلي (اختياري)
```bash
npm install
cp .env.example .env   # املأ القيم
npx prisma db push && npm run db:seed
npm run dev
```

## هيكل المشروع
- `src/app/(site)/[locale]` — الموقع (`/ar` و `/en`)
- `src/app/(admin)/admin` — لوحة التحكم
- `src/app/api` — الـAPI (طلبات، دخول، إدارة، رفع صور)
- `src/components` — المكونات · `src/lib` — الخدمات والـvalidation · `prisma` — الـschema والـseed

## الأمان
JWT في httpOnly cookie (SameSite=Strict) + تحقق في الـmiddleware وفي كل Route · Zod على كل المدخلات · الأسعار تُحسب من السيرفر فقط · Honeypot + Rate limiting (in-memory) · Security headers.

## Troubleshooting
- **المنيو فاضي:** تأكد من `DATABASE_URL` وإن الـBuild Log فيه `[seed]`.
- **رفع الصور بيفشل:** `BLOB_READ_WRITE_TOKEN` غير موجود.
- **مش قادر أسجل دخول:** `AUTH_SECRET` ناقص أو أقل من 32 حرف، أو `ADMIN_*` لم تُضبط قبل أول Build.
- **تغيير في الأدمن مش ظاهر:** الصفحات بتتحدث فورًا بعد الحفظ، ولو لا فبحد أقصى 60 ثانية.
