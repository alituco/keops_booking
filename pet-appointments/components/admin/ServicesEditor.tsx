"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

type ServiceRow = {
  id: string;
  name: string;
  durationMinutes: number;
  isActive: boolean;
};

export default function ServicesEditor({ adminKey }: { adminKey: string }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [services, setServices] = useState<ServiceRow[]>([]);
  const [baseline, setBaseline] = useState<ServiceRow[]>([]);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [newName, setNewName] = useState("");
  const [newDuration, setNewDuration] = useState<number>(20);
  const [creating, setCreating] = useState(false);

  const [savingId, setSavingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const activeCount = useMemo(() => services.filter((s) => s.isActive).length, [services]);

  function isDirty(s: ServiceRow) {
    const b = baseline.find((x) => x.id === s.id);
    if (!b) return true;
    return b.name !== s.name || b.durationMinutes !== s.durationMinutes || b.isActive !== s.isActive;
  }

  async function load() {
    setLoading(true);
    setErr(null);

    try {
      const res = await fetch("/api/admin/services", {
        headers: { "x-admin-key": adminKey },
      });

      const j = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(j?.error ?? "Failed to load services");
      }

      setServices(j.services as ServiceRow[]);
      setBaseline(j.services as ServiceRow[]);
    } catch (e: any) {
      setErr(e?.message ?? "Error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function createService() {
    const name = newName.trim();
    if (!name) return;

    setCreating(true);
    setErr(null);

    try {
      const res = await fetch("/api/admin/services", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({ name, durationMinutes: newDuration }),
      });

      const j = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(j?.error ?? "Create failed");
      }

      setNewName("");
      setNewDuration(20);
      await load();
    } catch (e: any) {
      setErr(e?.message ?? "Create failed");
    } finally {
      setCreating(false);
    }
  }

  async function saveService(s: ServiceRow) {
    setSavingId(s.id);
    setErr(null);

    try {
      const res = await fetch(`/api/admin/services/${s.id}`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({
          name: s.name,
          durationMinutes: s.durationMinutes,
          isActive: s.isActive,
        }),
      });

      const j = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(j?.error ?? "Save failed");
      }

      await load();
    } catch (e: any) {
      setErr(e?.message ?? "Save failed");
    } finally {
      setSavingId(null);
    }
  }

  async function deleteService(id: string) {
    setDeleting(true);
    setErr(null);

    try {
      const res = await fetch(`/api/admin/services/${id}`, {
        method: "DELETE",
        headers: { "x-admin-key": adminKey },
      });

      const j = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(j?.error ?? "Delete failed");
      }

      await load();
    } catch (e: any) {
      setErr(e?.message ?? "Delete failed");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  }

  return (
    <Box sx={{ p: { xs: 1, sm: 2 } }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems={{ sm: "center" }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            Services
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 0.75, flexWrap: "wrap" }}>
            <Chip size="small" label={`${services.length} total`} variant="outlined" />
            <Chip size="small" label={`${activeCount} active`} color="success" variant="outlined" />
          </Stack>
        </Box>

        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title="Refresh">
            <span>
              <IconButton onClick={load} disabled={loading} size="small">
                <RefreshRoundedIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>

          {loading && <CircularProgress size={18} />}
        </Stack>
      </Stack>

      <Divider sx={{ my: 2 }} />

      {err && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {err}
        </Alert>
      )}

      {/* Create */}
      <Paper
        variant="outlined"
        sx={{
          p: { xs: 1.5, sm: 2 },
          borderRadius: 3,
          mb: 2,
          bgcolor: "rgba(0,0,0,.02)",
        }}
      >
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems={{ sm: "flex-end" }}>
          <TextField
            fullWidth
            label="New service"
            placeholder="e.g., Nail Trim"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") createService();
            }}
          />

          <TextField
            label="Duration (min)"
            type="number"
            value={newDuration}
            inputProps={{ min: 5, step: 5 }}
            onChange={(e) => setNewDuration(Math.max(5, Number(e.target.value)))}
            sx={{ width: { xs: "100%", sm: 180 } }}
          />

          <Button
            onClick={createService}
            variant="contained"
            disabled={!newName.trim() || creating}
            startIcon={creating ? <CircularProgress size={16} /> : <AddRoundedIcon />}
            sx={{ whiteSpace: "nowrap" }}
          >
            Add
          </Button>
        </Stack>
      </Paper>

      {/* List */}
      <Stack spacing={1.5}>
        {services.map((s) => {
          const dirty = isDirty(s);
          const isSavingThis = savingId === s.id;

          return (
            <Paper
              key={s.id}
              variant="outlined"
              sx={{
                p: { xs: 1.5, sm: 2 },
                borderRadius: 3,
                borderColor: dirty ? "rgba(25,118,210,.35)" : "rgba(0,0,0,.12)",
                boxShadow: dirty ? "0 0 0 3px rgba(25,118,210,.10)" : "none",
              }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                alignItems={{ sm: "center" }}
              >
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1.5}
                  sx={{ flex: 1, width: "100%" }}
                  alignItems={{ sm: "center" }}
                >
                  <TextField
                    label="Name"
                    value={s.name}
                    onChange={(e) => {
                      const v = e.target.value;
                      setServices((prev) => prev.map((x) => (x.id === s.id ? { ...x, name: v } : x)));
                    }}
                    fullWidth
                  />

                  <TextField
                    label="Duration (min)"
                    type="number"
                    value={s.durationMinutes}
                    inputProps={{ min: 5, step: 5 }}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setServices((prev) =>
                        prev.map((x) => (x.id === s.id ? { ...x, durationMinutes: v } : x))
                      );
                    }}
                    sx={{ width: { xs: "100%", sm: 200 } }}
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={s.isActive}
                        onChange={(e) => {
                          const v = e.target.checked;
                          setServices((prev) => prev.map((x) => (x.id === s.id ? { ...x, isActive: v } : x)));
                        }}
                      />
                    }
                    label={isMobile ? "Active" : s.isActive ? "Active" : "Inactive"}
                    sx={{ m: 0, pl: { xs: 0, sm: 1 } }}
                  />
                </Stack>

                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Button
                    onClick={() => saveService(s)}
                    variant={dirty ? "contained" : "outlined"}
                    disabled={!dirty || isSavingThis}
                    startIcon={isSavingThis ? <CircularProgress size={16} /> : <SaveRoundedIcon />}
                    sx={{ minWidth: 120 }}
                  >
                    Save
                  </Button>

                  <Tooltip title="Delete service">
                    <span>
                      <IconButton
                        onClick={() => setDeleteId(s.id)}
                        disabled={isSavingThis}
                        color="error"
                      >
                        <DeleteOutlineRoundedIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Stack>
              </Stack>
            </Paper>
          );
        })}
      </Stack>

      {/* Delete confirm */}
      <Dialog open={Boolean(deleteId)} onClose={() => (deleting ? null : setDeleteId(null))} fullWidth maxWidth="xs">
        <DialogTitle>Delete service?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will permanently delete the service from the database.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)} disabled={deleting}>
            Cancel
          </Button>
          <Button
            onClick={() => deleteId && deleteService(deleteId)}
            color="error"
            variant="contained"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={16} /> : undefined}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
