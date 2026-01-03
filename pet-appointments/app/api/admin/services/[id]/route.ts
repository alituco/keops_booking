import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export async function PATCH(req: Request, context: { params: Params }) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const { id } = await context.params;

  const body = (await req.json().catch(() => ({}))) as {
    name?: string;
    durationMinutes?: number;
    isActive?: boolean;
  };

  const updated = (await sql`
    UPDATE public.pet_services
    SET
      name = COALESCE(${body.name ?? null}, name),
      duration_minutes = COALESCE(${body.durationMinutes ?? null}, duration_minutes),
      is_active = COALESCE(${body.isActive ?? null}, is_active),
      updated_at = now()
    WHERE id = ${id}
    RETURNING
      id,
      name,
      duration_minutes AS "durationMinutes",
      is_active AS "isActive"
  `) as any[];

  if (!updated[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ service: updated[0] });
}

export async function DELETE(req: Request, context: { params: Params }) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const { id } = await context.params;

  const deleted = (await sql`
    DELETE FROM public.pet_services
    WHERE id = ${id}
    RETURNING id
  `) as any[];

  if (!deleted[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
