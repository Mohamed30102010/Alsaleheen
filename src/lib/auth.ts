import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_COOKIE, verifyToken } from "./token";

export const getAdmin = () => verifyToken(cookies().get(AUTH_COOKIE)?.value);

/** Returns a 401 response when not authenticated, otherwise null. Also blocks cross-site writes. */
export async function guard(req: Request) {
  if (!(await getAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (req.method !== "GET") {
    const origin = req.headers.get("origin");
    const host = req.headers.get("host");
    if (origin && host && new URL(origin).host !== host) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  return null;
}
