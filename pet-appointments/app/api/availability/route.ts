import { NextResponse } from "next/server";
import type { TimeSlot } from "@/types/domain";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const serviceId = url.searchParams.get("serviceId");
  const date = url.searchParams.get("date");

  if (!serviceId || !date) {
    return NextResponse.json({ error: "Missing serviceId or date" }, { status: 400 });
  }

  // Stubbed availability. Later: call calendar API and compute free slots.
  const slots: TimeSlot[] = [
    { startISO: `${date}T09:00:00.000Z`, label: "9:00 AM" },
    { startISO: `${date}T09:30:00.000Z`, label: "9:30 AM" },
    { startISO: `${date}T10:00:00.000Z`, label: "10:00 AM" },
    { startISO: `${date}T10:30:00.000Z`, label: "10:30 AM" },
  ];

  return NextResponse.json({ slots });
}
