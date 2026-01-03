"use client";

import { useEffect, useMemo, useState } from "react";
import ServicesEditor from "@/components/admin/ServicesEditor";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Paper,
  TextField,
  Button,
  Stack,
  Chip,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState("");
  const [input, setInput] = useState("");

  useEffect(() => {
    const saved = sessionStorage.getItem("adminKey");
    if (saved) setAdminKey(saved);
  }, []);

  const isUnlocked = useMemo(() => Boolean(adminKey), [adminKey]);

  function unlock() {
    const trimmed = input.trim();
    if (!trimmed) return;
    sessionStorage.setItem("adminKey", trimmed);
    setAdminKey(trimmed);
  }

  function lock() {
    sessionStorage.removeItem("adminKey");
    setAdminKey("");
    setInput("");
  }

  async function copyKey() {
    if (!adminKey) return;
    try {
      await navigator.clipboard.writeText(adminKey);
    } catch {
      // ignore
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        backgroundImage:
          "radial-gradient(800px 400px at 10% 0%, rgba(25,118,210,.12), transparent 60%), radial-gradient(800px 400px at 90% 10%, rgba(156,39,176,.10), transparent 60%)",
      }}
    >
      <AppBar position="sticky" elevation={0} color="transparent" sx={{ backdropFilter: "blur(8px)" }}>
        <Toolbar sx={{ gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
              bgcolor: "rgba(25,118,210,.10)",
              border: "1px solid rgba(25,118,210,.18)",
            }}
          >
            {isUnlocked ? <LockOpenOutlinedIcon fontSize="small" /> : <LockOutlinedIcon fontSize="small" />}
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
              Admin Dashboard
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.75 }}>
              Manage vet services (name, duration, active)
            </Typography>
          </Box>

          {isUnlocked ? (
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip label="Unlocked" color="success" variant="outlined" />
              <Tooltip title="Copy key">
                <IconButton onClick={copyKey} size="small">
                  <ContentCopyRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Button onClick={lock} variant="outlined" color="inherit">
                Lock
              </Button>
            </Stack>
          ) : (
            <Chip label="Locked" color="default" variant="outlined" />
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: { xs: 3, sm: 5 } }}>
        {!isUnlocked ? (
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 3,
              border: "1px solid rgba(0,0,0,.12)",
              overflow: "hidden",
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
              Unlock admin tools
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems={{ sm: "flex-end" }}>
              <TextField
                fullWidth
                label="Admin key"
                placeholder="Paste admin key…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") unlock();
                }}
              />
              <Button
                onClick={unlock}
                variant="contained"
                size="large"
                disabled={!input.trim()}
                sx={{ px: 3, whiteSpace: "nowrap" }}
              >
                Unlock
              </Button>
            </Stack>
          </Paper>
        ) : (
          <Paper
            elevation={0}
            sx={{
              p: { xs: 1.5, sm: 2 },
              borderRadius: 3,
              border: "1px solid rgba(0,0,0,.12)",
            }}
          >
            <ServicesEditor adminKey={adminKey} />
          </Paper>
        )}
      </Container>
    </Box>
  );
}
