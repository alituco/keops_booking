"use client";

import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import EventBusyRoundedIcon from "@mui/icons-material/EventBusyRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

type ApptStatus = "confirmed" | "pending" | "cancelled";

type Appt = {
  id: string;
  date: string; // YYYY-MM-DD
  timeLabel: string; // 3:30 PM
  serviceName: string;
  petName: string;
  ownerName: string;
  phone: string;
  status: ApptStatus;
};

const seed: Appt[] = [
  {
    id: "a1",
    date: "2026-01-03",
    timeLabel: "10:00 AM",
    serviceName: "Checkup",
    petName: "Milo",
    ownerName: "Ali",
    phone: "+9733xxxxxxx",
    status: "confirmed",
  },
  {
    id: "a2",
    date: "2026-01-03",
    timeLabel: "01:30 PM",
    serviceName: "Vaccine",
    petName: "Luna",
    ownerName: "Sara",
    phone: "+9733xxxxxxx",
    status: "pending",
  },
  {
    id: "a3",
    date: "2026-01-04",
    timeLabel: "09:00 AM",
    serviceName: "Nail Trim",
    petName: "Rocky",
    ownerName: "Hassan",
    phone: "+9733xxxxxxx",
    status: "confirmed",
  },
];

function statusChip(status: ApptStatus) {
  if (status === "confirmed") return <Chip size="small" color="success" variant="outlined" label="Confirmed" />;
  if (status === "pending") return <Chip size="small" color="warning" variant="outlined" label="Pending" />;
  return <Chip size="small" color="default" variant="outlined" label="Cancelled" />;
}

export default function AppointmentsPanel() {
  const [appointments, setAppointments] = useState<Appt[]>(seed);

  const [q, setQ] = useState("");
  const [status, setStatus] = useState<ApptStatus | "all">("all");
  const [day, setDay] = useState<string>(""); // optional filter by date

  const [cancelId, setCancelId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return appointments.filter((a) => {
      const matchesQ =
        !q.trim() ||
        `${a.serviceName} ${a.petName} ${a.ownerName} ${a.phone}`
          .toLowerCase()
          .includes(q.trim().toLowerCase());

      const matchesStatus = status === "all" ? true : a.status === status;
      const matchesDay = !day ? true : a.date === day;

      return matchesQ && matchesStatus && matchesDay;
    });
  }, [appointments, q, status, day]);

  const grouped = useMemo(() => {
    const map = new Map<string, Appt[]>();
    for (const a of filtered) {
      if (!map.has(a.date)) map.set(a.date, []);
      map.get(a.date)!.push(a);
    }
    for (const list of map.values()) {
      list.sort((x, y) => x.timeLabel.localeCompare(y.timeLabel));
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filtered]);

  const confirmedCount = appointments.filter((a) => a.status === "confirmed").length;
  const pendingCount = appointments.filter((a) => a.status === "pending").length;

  function cancelAppointment(id: string) {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "cancelled" } : a))
    );
  }

  function uncancelAppointment(id: string) {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "confirmed" } : a))
    );
  }

  return (
    <Box sx={{ display: "grid", gap: 2 }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <CalendarMonthRoundedIcon />
        <Typography variant="h6" sx={{ fontWeight: 900 }}>
          Upcoming appointments (UI only)
        </Typography>

        <Stack direction="row" spacing={1} sx={{ ml: "auto", flexWrap: "wrap" }}>
          <Chip size="small" variant="outlined" label={`${appointments.length} total`} />
          <Chip size="small" color="success" variant="outlined" label={`${confirmedCount} confirmed`} />
          <Chip size="small" color="warning" variant="outlined" label={`${pendingCount} pending`} />
        </Stack>
      </Stack>

      <Typography variant="body2" sx={{ opacity: 0.75 }}>
        Calendar-style list with search, filtering, and cancel/restore actions. (Data is mocked for now.)
      </Typography>

      <Paper
        variant="outlined"
        sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: 3, bgcolor: "rgba(0,0,0,.02)" }}
      >
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems={{ sm: "center" }}>
          <TextField
            fullWidth
            label="Search"
            placeholder="pet name, owner, service, phone…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            sx={{ width: { xs: "100%", sm: 170 } }}
          >
            <MenuItem value="all">All statuses</MenuItem>
            <MenuItem value="confirmed">Confirmed</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>

          <TextField
            label="Day"
            type="date"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ width: { xs: "100%", sm: 190 } }}
          />
        </Stack>
      </Paper>

      {grouped.length === 0 ? (
        <Alert severity="info">No appointments match your filters.</Alert>
      ) : (
        <Stack spacing={2}>
          {grouped.map(([dateKey, list]) => (
            <Paper key={dateKey} variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
              <Box sx={{ px: 2, py: 1.25, bgcolor: "rgba(0,0,0,.03)" }}>
                <Typography sx={{ fontWeight: 900 }}>{dateKey}</Typography>
              </Box>
              <Divider />

              <Stack spacing={1} sx={{ p: 1.5 }}>
                {list.map((a) => (
                  <Box
                    key={a.id}
                    sx={{
                      border: "1px solid rgba(0,0,0,.12)",
                      borderRadius: 2,
                      p: 1.25,
                      display: "grid",
                      gap: 1,
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: "wrap" }}>
                      <Typography sx={{ fontWeight: 900 }}>{a.timeLabel}</Typography>
                      {statusChip(a.status)}
                      <Chip size="small" variant="outlined" label={a.serviceName} />
                      <Chip size="small" variant="outlined" label={`${a.petName} • ${a.ownerName}`} />
                      <Chip size="small" variant="outlined" label={a.phone} />
                    </Stack>

                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      {a.status !== "cancelled" ? (
                        <Button
                          color="error"
                          variant="outlined"
                          startIcon={<EventBusyRoundedIcon />}
                          onClick={() => setCancelId(a.id)}
                        >
                          Cancel
                        </Button>
                      ) : (
                        <Button
                          color="success"
                          variant="outlined"
                          startIcon={<CheckCircleRoundedIcon />}
                          onClick={() => uncancelAppointment(a.id)}
                        >
                          Restore
                        </Button>
                      )}
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}

      <Dialog open={Boolean(cancelId)} onClose={() => setCancelId(null)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          Cancel appointment
          <IconButton onClick={() => setCancelId(null)} sx={{ ml: "auto" }}>
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            This is UI-only right now. If you confirm, we’ll mark the appointment as cancelled in the mock list.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelId(null)}>Back</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              if (cancelId) cancelAppointment(cancelId);
              setCancelId(null);
            }}
          >
            Confirm cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
