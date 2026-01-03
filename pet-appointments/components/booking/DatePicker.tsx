import { TextField } from "@mui/material";

export default function DatePicker({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (date: string) => void;
  disabled?: boolean;
}) {
  return (
    <TextField
      label="Date"
      type="date"
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      InputLabelProps={{ shrink: true }}
      fullWidth
    />
  );
}
