"use client";

import { useEffect, useState } from "react";

type ServiceRow = {
  id: string;
  name: string;
  durationMinutes: number;
  isActive: boolean;
};

export default function ServicesEditor({ adminKey }: { adminKey: string }) {
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [newName, setNewName] = useState("");
  const [newDuration, setNewDuration] = useState<number>(20);

  async function load() {
    setLoading(true);
    setErr(null);

    try {
      const res = await fetch("/api/admin/services", {
        headers: { "x-admin-key": adminKey },
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error ?? "Failed to load services");
      }
      const data = await res.json();
      setServices(data.services);
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
    setErr(null);

    const res = await fetch("/api/admin/services", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-admin-key": adminKey,
      },
      body: JSON.stringify({ name: newName, durationMinutes: newDuration }),
    });

    if (!res.ok) {
      const j = await res.json().catch(() => null);
      setErr(j?.error ?? "Create failed");
      return;
    }

    setNewName("");
    await load();
  }

  async function saveService(s: ServiceRow) {
    setErr(null);

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

    if (!res.ok) {
      const j = await res.json().catch(() => null);
      setErr(j?.error ?? "Save failed");
      return;
    }

    await load();
  }

  async function deleteService(id: string) {
    setErr(null);

    const res = await fetch(`/api/admin/services/${id}`, {
      method: "DELETE",
      headers: { "x-admin-key": adminKey },
    });

    if (!res.ok) {
      const j = await res.json().catch(() => null);
      setErr(j?.error ?? "Delete failed");
      return;
    }

    await load();
  }

  return (
    <div style={{ display: "grid", gap: 14 }}>
      {err && (
        <div style={{ border: "1px solid rgba(255,0,0,.3)", padding: 10, borderRadius: 8 }}>
          {err}
        </div>
      )}

      <div style={{ display: "flex", gap: 10, alignItems: "end" }}>
        <label style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>New service name</div>
          <input value={newName} onChange={(e) => setNewName(e.target.value)} style={{ width: "100%", padding: 10 }} />
        </label>

        <label style={{ width: 160 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Duration (min)</div>
          <input
            type="number"
            value={newDuration}
            min={5}
            onChange={(e) => setNewDuration(Number(e.target.value))}
            style={{ width: "100%", padding: 10 }}
          />
        </label>

        <button onClick={createService} disabled={!newName.trim()}>
          Add
        </button>
      </div>

      <div style={{ opacity: 0.8 }}>{loading ? "Loading…" : `${services.length} service(s)`}</div>

      <div style={{ display: "grid", gap: 10 }}>
        {services.map((s, idx) => (
          <div
            key={s.id}
            style={{
              border: "1px solid rgba(0,0,0,.12)",
              borderRadius: 10,
              padding: 12,
              display: "grid",
              gap: 10,
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 160px 120px", gap: 10 }}>
              <input
                value={s.name}
                onChange={(e) => {
                  const v = e.target.value;
                  setServices((prev) => prev.map((x, i) => (i === idx ? { ...x, name: v } : x)));
                }}
                style={{ padding: 10 }}
              />

              <input
                type="number"
                value={s.durationMinutes}
                min={5}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setServices((prev) => prev.map((x, i) => (i === idx ? { ...x, durationMinutes: v } : x)));
                }}
                style={{ padding: 10 }}
              />

              <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="checkbox"
                  checked={s.isActive}
                  onChange={(e) => {
                    const v = e.target.checked;
                    setServices((prev) => prev.map((x, i) => (i === idx ? { ...x, isActive: v } : x)));
                  }}
                />
                Active
              </label>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => saveService(s)} style={{ fontWeight: 700 }}>
                Save
              </button>
              <button onClick={() => deleteService(s.id)} style={{ color: "crimson" }}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
