"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { CreateAppointmentRequest, PetService, TimeSlot } from "@/types/domain";

import ServiceSelect from "./ServiceSelect";
import DatePicker from "./DatePicker";
import TimeSlotPicker from "./TimeSlotPicker";
import PetOwnerFields from "./PetOwnerFields";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
  Chip,
} from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import PetsRoundedIcon from "@mui/icons-material/PetsRounded";

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
    <Box component="form" onSubmit={onSubmit} sx={{ display: "grid", gap: 2 }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: "wrap" }}>
        <Chip icon={<EventAvailableRoundedIcon />} label="Appointment details" variant="outlined" />
        <Chip icon={<PetsRoundedIcon />} label="Pet & owner" variant="outlined" />
        {canSubmit ? (
          <Chip icon={<CheckCircleRoundedIcon />} color="success" label="Ready to book" variant="outlined" />
        ) : (
          <Chip color="default" label="Fill required fields" variant="outlined" />
        )}
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}

      {/* Section: Appointment Details */}
      <Paper
        variant="outlined"
        sx={{
          p: { xs: 1.5, sm: 2 },
          borderRadius: 3,
          bgcolor: "rgba(0,0,0,.02)",
        }}
      >
        <Stack spacing={1.5}>
          <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
            Appointment details
          </Typography>
          <Divider />

          <ServiceSelect
            services={services}
            value={serviceId}
            onChange={setServiceId}
            disabled={loadingServices || submitting}
            loading={loadingServices}
          />

          <DatePicker value={date} onChange={setDate} disabled={submitting} />

          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
            <ScheduleRoundedIcon fontSize="small" />
            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
              Available times
            </Typography>
            {loadingSlots && <CircularProgress size={16} />}
          </Stack>

          <TimeSlotPicker
            slots={slots}
            value={slotStartISO}
            onChange={setSlotStartISO}
            disabled={!canFetchSlots || submitting || loadingSlots}
            emptyHint={
              !serviceId || !date
                ? "Pick a service and a date to see available times."
                : loadingSlots
                ? "Loading availability…"
                : "No slots for this date."
            }
          />
        </Stack>
      </Paper>

      {/* Section: Pet & Owner */}
      <Paper variant="outlined" sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: 3 }}>
        <Stack spacing={1.5}>
          <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
            Pet & owner info
          </Typography>
          <Divider />
          <PetOwnerFields
            petName={petName}
            setPetName={setPetName}
            species={species}
            setSpecies={setSpecies}
            ownerName={ownerName}
            setOwnerName={setOwnerName}
            phone={phone}
            setPhone={setPhone}
            disabled={submitting}
          />
        </Stack>
      </Paper>

      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={!canSubmit || submitting}
        startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <CheckCircleRoundedIcon />}
        sx={{ borderRadius: 3, py: 1.2, fontWeight: 900 }}
        fullWidth
      >
        {submitting ? "Booking…" : "Book appointment"}
      </Button>

      <Typography variant="caption" sx={{ opacity: 0.7 }}>
        By booking, you agree to be contacted about your appointment.
      </Typography>
    </Box>
  );
}
