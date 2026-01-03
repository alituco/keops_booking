"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { CreateAppointmentRequest, PetService, TimeSlot } from "@/types/domain";

import ServiceSelect from "./ServiceSelect";
import DatePicker from "./DatePicker";
import TimeSlotPicker from "./TimeSlotPicker";
import PetOwnerFields from "./PetOwnerFields";

export default function BookingForm() {
  const router = useRouter();

  const [services, setServices] = useState<PetService[]>([]);
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState(""); // YYYY-MM-DD
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [slotStartISO, setSlotStartISO] = useState("");

  const [petName, setPetName] = useState("");
  const [species, setSpecies] = useState<"dog" | "cat" | "other">("dog");
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");

  const [loadingServices, setLoadingServices] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canFetchSlots = useMemo(() => Boolean(serviceId && date), [serviceId, date]);
  const canSubmit = useMemo(
    () =>
      Boolean(serviceId && date && slotStartISO && petName.trim() && ownerName.trim() && phone.trim()),
    [serviceId, date, slotStartISO, petName, ownerName, phone]
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingServices(true);
      setError(null);
      try {
        const res = await fetch("/api/services");
        if (!res.ok) throw new Error("Failed to load services");
        const data = (await res.json()) as { services: PetService[] };
        if (!cancelled) setServices(data.services);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Something went wrong");
      } finally {
        if (!cancelled) setLoadingServices(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    // reset slot when inputs change
    setSlotStartISO("");
    setSlots([]);

    if (!canFetchSlots) return;

    (async () => {
      setLoadingSlots(true);
      setError(null);
      try {
        const qs = new URLSearchParams({ serviceId, date });
        const res = await fetch(`/api/availability?${qs.toString()}`);
        if (!res.ok) throw new Error("Failed to load availability");
        const data = (await res.json()) as { slots: TimeSlot[] };
        if (!cancelled) setSlots(data.slots);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Something went wrong");
      } finally {
        if (!cancelled) setLoadingSlots(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [canFetchSlots, serviceId, date]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setError(null);

    const payload: CreateAppointmentRequest = {
      serviceId,
      date,
      startISO: slotStartISO,
      petName,
      species,
      ownerName,
      phone,
    };

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const maybe = await res.json().catch(() => null);
        throw new Error(maybe?.error ?? "Booking failed");
      }

      router.push("/success");
    } catch (e: any) {
      setError(e?.message ?? "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: 16 }}>
      {error && (
        <div style={{ padding: 12, border: "1px solid rgba(255,0,0,0.3)", borderRadius: 8 }}>
          {error}
        </div>
      )}

      <ServiceSelect
        services={services}
        value={serviceId}
        onChange={setServiceId}
        disabled={loadingServices || submitting}
      />

      <DatePicker value={date} onChange={setDate} disabled={submitting} />

      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <span style={{ fontWeight: 600 }}>Availability</span>
          {loadingSlots && <span style={{ opacity: 0.7 }}>Loading…</span>}
        </div>

        <TimeSlotPicker
          slots={slots}
          value={slotStartISO}
          onChange={setSlotStartISO}
          disabled={!canFetchSlots || submitting}
        />
      </div>

      <PetOwnerFields
        petName={petName}
        setPetName={setPetName}
        species={species}
        setSpecies={setSpecies}
        ownerName={ownerName}
        setOwnerName={setOwnerName}
        phone={phone}
        setPhone={setPhone}
      />

      <button
        type="submit"
        disabled={!canSubmit || submitting}
        style={{ padding: 12, borderRadius: 10, fontWeight: 700 }}
      >
        {submitting ? "Booking…" : "Book appointment"}
      </button>
    </form>
  );
}
