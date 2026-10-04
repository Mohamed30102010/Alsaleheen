import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, verifyToken } from "@/lib/token";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/") return NextResponse.redirect(new URL("/ar", req.url), 308);

  const isApi = pathname.startsWith("/api/admin");
  const isLogin = pathname === "/admin/login";
  if (isLogin) return NextResponse.next();
  const ok = await verifyToken(req.cookies.get(AUTH_COOKIE)?.value).catch(() => null);
  if (ok) return NextResponse.next();
  if (isApi) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.redirect(new URL("/admin/login", req.url));
}
export const config = { matcher: ["/", "/admin/:path*", "/api/admin/:path*"] };
