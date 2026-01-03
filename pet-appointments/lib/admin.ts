import { NextResponse } from "next/server";

export function requireAdmin(req: Request) {
  const expected = process.env.ADMIN_KEY;

  if (!expected) {
    return NextResponse.json(
      { error: "Server misconfigured (missing ADMIN_KEY)" },
      { status: 500 }
    );
  }

  const key = req.headers.get("x-admin-key");
  if (!key || key !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null; // ok
}
