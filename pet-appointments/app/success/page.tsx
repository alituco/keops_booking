import Link from "next/link";

export default function SuccessPage() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Booked ✅</h1>
      <p style={{ marginTop: 8, opacity: 0.8 }}>
        Your appointment request was submitted.
      </p>

      <div style={{ marginTop: 16 }}>
        <Link href="/book">Book another</Link>
      </div>
    </main>
  );
}
