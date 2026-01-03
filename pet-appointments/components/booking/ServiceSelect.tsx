import type { PetService } from "@/types/domain";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Box,
} from "@mui/material";

export default function ServiceSelect({
  services,
  value,
  onChange,
  disabled,
  loading,
}: {
  services: PetService[];
  value: string;
  onChange: (serviceId: string) => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  return (
    <FormControl fullWidth disabled={disabled}>
      <InputLabel id="service-label">Service</InputLabel>
      <Select
        labelId="service-label"
        label="Service"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        endAdornment={
          loading ? (
            <Box sx={{ mr: 2, display: "flex", alignItems: "center" }}>
              <CircularProgress size={16} />
            </Box>
          ) : undefined
        }
      >
        <MenuItem value="">
          <em>Select a service…</em>
        </MenuItem>
        {services.map((s) => (
          <MenuItem key={s.id} value={s.id}>
            {s.name} ({s.durationMinutes} min)
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
