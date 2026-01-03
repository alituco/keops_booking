import type { TimeSlot } from "@/types/domain";

export default function TimeSlotPicker({
  slots,
  value,
  onChange,
  disabled,
}: {
  slots: TimeSlot[];
  value: string; // startISO
  onChange: (startISO: string) => void;
  disabled?: boolean;
}) {
  return (
    <fieldset disabled={disabled} style={{ border: "none", padding: 0 }}>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>Time</div>

      {slots.length === 0 ? (
        <div style={{ opacity: 0.75 }}>No slots yet — pick a service + date.</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {slots.map((s) => (
            <label
              key={s.startISO}
              style={{
                border: "1px solid rgba(0,0,0,0.15)",
                padding: 10,
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              <input
                type="radio"
                name="slot"
                value={s.startISO}
                checked={value === s.startISO}
                onChange={() => onChange(s.startISO)}
                style={{ marginRight: 8 }}
              />
              {s.label}
            </label>
          ))}
        </div>
      )}
    </fieldset>
  );
}
