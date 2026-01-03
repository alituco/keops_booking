"use client";

import { useEffect, useState } from "react";
import ServicesEditor from "@/components/admin/ServicesEditor";

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState("");
  const [input, setInput] = useState("");

  useEffect(() => {
    const saved = sessionStorage.getItem("adminKey");
    if (saved) setAdminKey(saved);
  }, []);

  function unlock() {
    sessionStorage.setItem("adminKey", input);
    setAdminKey(input);
  }

  function lock() {
    sessionStorage.removeItem("adminKey");
    setAdminKey("");
    setInput("");
  }

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Admin Dashboard</h1>

      {!adminKey ? (
        <div style={{ marginTop: 16, display: "grid", gap: 10, maxWidth: 420 }}>
          <div style={{ opacity: 0.8 }}>Enter admin key to manage services.</div>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Admin key"
            style={{ padding: 10 }}
          />
          <button onClick={unlock} disabled={!input.trim()} style={{ padding: 12, fontWeight: 700 }}>
            Unlock
          </button>
        </div>
      ) : (
        <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ opacity: 0.8 }}>Unlocked</div>
            <button onClick={lock}>Lock</button>
          </div>

          <ServicesEditor adminKey={adminKey} />
        </div>
      )}
    </main>
  );
}
