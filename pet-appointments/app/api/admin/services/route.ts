import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const rows = (await sql`
    SELECT
      id,
      name,
      duration_minutes AS "durationMinutes",
      is_active AS "isActive"
    FROM pet_services
    ORDER BY name ASC
  `) as Array<{
    id: string;
    name: string;
    durationMinutes: number;
    isActive: boolean;
  }>;

  return NextResponse.json({ services: rows });
}

export async function POST(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const body = (await req.json().catch(() => ({}))) as {
    name?: string;
    durationMinutes?: number;
  };

  if (!body.name || !body.durationMinutes) {
    return NextResponse.json(
      { error: "Missing name or durationMinutes" },
      { status: 400 }
    );
  }

  const inserted = (await sql`
    INSERT INTO pet_services (name, duration_minutes, is_active)
    VALUES (${body.name}, ${body.durationMinutes}, true)
    RETURNING
      id,
      name,
      duration_minutes AS "durationMinutes",
      is_active AS "isActive"
  `) as any[];

  return NextResponse.json({ service: inserted[0] });
}
