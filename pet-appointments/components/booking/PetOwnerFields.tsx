export default function PetOwnerFields({
  petName,
  setPetName,
  species,
  setSpecies,
  ownerName,
  setOwnerName,
  phone,
  setPhone,
}: {
  petName: string;
  setPetName: (v: string) => void;
  species: "dog" | "cat" | "other";
  setSpecies: (v: "dog" | "cat" | "other") => void;
  ownerName: string;
  setOwnerName: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      <label style={{ display: "block" }}>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>Pet name</div>
        <input
          value={petName}
          onChange={(e) => setPetName(e.target.value)}
          placeholder="Milo"
          style={{ width: "100%", padding: 10 }}
        />
      </label>

      <label style={{ display: "block" }}>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>Species</div>
        <select
          value={species}
          onChange={(e) => setSpecies(e.target.value as any)}
          style={{ width: "100%", padding: 10 }}
        >
          <option value="dog">Dog</option>
          <option value="cat">Cat</option>
          <option value="other">Other</option>
        </select>
      </label>

      <label style={{ display: "block" }}>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>Owner name</div>
        <input
          value={ownerName}
          onChange={(e) => setOwnerName(e.target.value)}
          placeholder="Ali"
          style={{ width: "100%", padding: 10 }}
        />
      </label>

      <label style={{ display: "block" }}>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>Phone (SMS/WhatsApp)</div>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+973XXXXXXXX"
          style={{ width: "100%", padding: 10 }}
        />
      </label>
    </div>
  );
}
