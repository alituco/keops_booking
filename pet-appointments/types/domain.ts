export type PetService = {
  id: string;
  name: string;
  durationMinutes: number;
};

export type TimeSlot = {
  startISO: string; // e.g: "2026-01-03T09:00:00.000Z"
  label: string;    // e.g: "9:00 AM"
};

export type CreateAppointmentRequest = {
  serviceId: string;
  date: string;       // "YYYY-MM-DD"
  startISO: string;   // selected slot
  petName: string;
  species: "dog" | "cat" | "other";
  ownerName: string;
  phone: string;      // for SMS/WhatsApp 
};
