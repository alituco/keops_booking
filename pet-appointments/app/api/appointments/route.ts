import { NextResponse } from "next/server";
import type { CreateAppointmentRequest } from "@/types/domain";

export async function POST(req: Request) {
  const body = (await req.json()) as CreateAppointmentRequest;

  if (!body?.serviceId || !body?.date || !body?.startISO || !body?.petName || !body?.ownerName || !body?.phone) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Later: call Google/Microsoft Calendar API here to create the event.
  return NextResponse.json({ ok: true });
}
