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
    <label style={{ display: "block" }}>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>Date</div>
      <input
        type="date"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", padding: 10 }}
      />
    </label>
  );
}
