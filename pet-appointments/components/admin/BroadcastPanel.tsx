"use client";

import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import CampaignRoundedIcon from "@mui/icons-material/CampaignRounded";

function waLink(phoneE164: string, text: string) {
  const digits = phoneE164.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

function smsLink(phoneE164: string, text: string) {
  return `sms:${phoneE164}?&body=${encodeURIComponent(text)}`;
}

export default function BroadcastPanel() {
  const [channel, setChannel] = useState<"whatsapp" | "sms">("whatsapp");
  const [recipientsText, setRecipientsText] = useState("");
  const [message, setMessage] = useState("");

  const recipients = useMemo(() => {
    return recipientsText
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }, [recipientsText]);

  const [toast, setToast] = useState<string | null>(null);

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setToast("Copied");
      setTimeout(() => setToast(null), 900);
    } catch {
      setToast("Could not copy");
      setTimeout(() => setToast(null), 900);
    }
  }

  return (
    <Box sx={{ display: "grid", gap: 2 }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <CampaignRoundedIcon />
        <Typography variant="h6" sx={{ fontWeight: 900 }}>
          Broadcast (UI only)
        </Typography>
        <Chip size="small" label={`${recipients.length} recipients`} variant="outlined" sx={{ ml: "auto" }} />
      </Stack>


      {toast && <Alert severity="info">{toast}</Alert>}

      <Paper
        variant="outlined"
        sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: 3, bgcolor: "rgba(0,0,0,.02)" }}
      >
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: "wrap" }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>
              Channel
            </Typography>
            <ToggleButtonGroup
              value={channel}
              exclusive
              onChange={(_, v) => v && setChannel(v)}
              size="small"
              sx={{ "& .MuiToggleButton-root": { textTransform: "none", fontWeight: 900 } }}
            >
              <ToggleButton value="whatsapp">WhatsApp</ToggleButton>
              <ToggleButton value="sms">SMS</ToggleButton>
            </ToggleButtonGroup>

            <Button
              onClick={() => copy(message.trim())}
              startIcon={<ContentCopyRoundedIcon />}
              variant="outlined"
              disabled={!message.trim()}
              sx={{ ml: "auto" }}
            >
              Copy message
            </Button>
          </Stack>

          <TextField
            label="Recipients (E.164)"
            placeholder={"+9733xxxxxxx\n+9733xxxxxxx\nor comma-separated"}
            value={recipientsText}
            onChange={(e) => setRecipientsText(e.target.value)}
            multiline
            minRows={4}
            fullWidth
          />

          <TextField
            label="Message"
            placeholder="Reminder: Your pet appointment is today at 4pm."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            multiline
            minRows={4}
            fullWidth
          />

          <Divider />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<ContentCopyRoundedIcon />}
              disabled={recipients.length === 0}
              onClick={() => copy(recipients.join("\n"))}
            >
              Copy recipients
            </Button>

            <Button
              fullWidth
              variant="contained"
              startIcon={<OpenInNewRoundedIcon />}
              disabled={recipients.length === 0 || !message.trim()}
              onClick={() => {
                const first = recipients[0];
                const link =
                  channel === "whatsapp" ? waLink(first, message.trim()) : smsLink(first, message.trim());
                window.open(link, "_blank", "noopener,noreferrer");
              }}
            >
              Open first in {channel === "whatsapp" ? "WhatsApp" : "SMS"}
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>
          Quick links (first 8)
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.75, mt: 0.5 }}>
          Click to open a pre-filled message per recipient.
        </Typography>

        <Stack sx={{ mt: 1.5 }} spacing={1}>
          {recipients.slice(0, 8).map((to) => {
            const link = channel === "whatsapp" ? waLink(to, message.trim()) : smsLink(to, message.trim());
            return (
              <Stack
                key={to}
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{
                  border: "1px solid rgba(0,0,0,.12)",
                  borderRadius: 2,
                  p: 1,
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 800, flex: 1, minWidth: 0 }}>
                  {to}
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<OpenInNewRoundedIcon />}
                  disabled={!message.trim()}
                  onClick={() => window.open(link, "_blank", "noopener,noreferrer")}
                >
                  Open
                </Button>
              </Stack>
            );
          })}

          {recipients.length === 0 && (
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              Add recipients to generate links.
            </Typography>
          )}
        </Stack>
      </Paper>
    </Box>
  );
}
