import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import type { PetService } from "@/types/domain";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = (await sql`
      SELECT
        id,
        name,
        duration_minutes AS "durationMinutes"
      FROM pet_services
      WHERE is_active = true
      ORDER BY name ASC
    `) as Array<{
      id: string;
      name: string;
      durationMinutes: number;
    }>;

    const services: PetService[] = rows.map((r) => ({
      id: r.id,
      name: r.name,
      durationMinutes: r.durationMinutes,
    }));

    return NextResponse.json({ services });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Failed to load services" },
      { status: 500 }
    );
  }
}
