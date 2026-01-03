import type { PetService } from "@/types/domain";

export default function ServiceSelect({
  services,
  value,
  onChange,
  disabled,
}: {
  services: PetService[];
  value: string;
  onChange: (serviceId: string) => void;
  disabled?: boolean;
}) {
  return (
    <label style={{ display: "block" }}>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>Service</div>
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", padding: 10 }}
      >
        <option value="">Select a service…</option>
        {services.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name} ({s.durationMinutes} min)
          </option>
        ))}
      </select>
    </label>
  );
}
