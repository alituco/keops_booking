import BookingForm from "@/components/booking/BookingForm";

export default function BookPage() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Book a Pet Appointment</h1>
      <p style={{ marginTop: 8, opacity: 0.8 }}>
        Choose a service, pick a date/time, and we’ll confirm the appointment.
      </p>

      <div style={{ marginTop: 20 }}>
        <BookingForm />
      </div>
    </main>
  );
}
