import type { TimeSlot } from "@/types/domain";
import { Box, Button, Typography } from "@mui/material";

export default function TimeSlotPicker({
  slots,
  value,
  onChange,
  disabled,
  emptyHint,
}: {
  slots: TimeSlot[];
  value: string; // startISO
  onChange: (startISO: string) => void;
  disabled?: boolean;
  emptyHint?: string;
}) {
  if (!slots.length) {
    return (
      <Typography variant="body2" sx={{ opacity: 0.75 }}>
        {emptyHint ?? "No slots yet."}
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        gap: 1,
        gridTemplateColumns: {
          xs: "repeat(2, minmax(0, 1fr))",
          sm: "repeat(3, minmax(0, 1fr))",
        },
      }}
    >
      {slots.map((s) => {
        const selected = value === s.startISO;
        return (
          <Button
            key={s.startISO}
            type="button"
            onClick={() => onChange(s.startISO)}
            disabled={disabled}
            variant={selected ? "contained" : "outlined"}
            sx={{
              borderRadius: 2.5,
              py: 1.1,
              fontWeight: 900,
              textTransform: "none",
            }}
          >
            {s.label}
          </Button>
        );
      })}
    </Box>
  );
}
