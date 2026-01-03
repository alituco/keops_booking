"use client";

import Grid from "@mui/material/Grid";
import {
  Box,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  InputAdornment,
} from "@mui/material";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";
import PetsRoundedIcon from "@mui/icons-material/PetsRounded";

export default function PetOwnerFields({
  petName,
  setPetName,
  species,
  setSpecies,
  ownerName,
  setOwnerName,
  phone,
  setPhone,
  disabled,
}: {
  petName: string;
  setPetName: (v: string) => void;
  species: "dog" | "cat" | "other";
  setSpecies: (v: "dog" | "cat" | "other") => void;
  ownerName: string;
  setOwnerName: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <Grid container spacing={2} sx={{ width: "100%", m: 0 }}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="Pet name"
          placeholder="Milo"
          value={petName}
          disabled={disabled}
          onChange={(e) => setPetName(e.target.value)}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PetsRoundedIcon sx={{ opacity: 0.6 }} />
              </InputAdornment>
            ),
          }}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <Box>
          <Typography variant="caption" sx={{ display: "block", mb: 0.75, opacity: 0.75 }}>
            Species
          </Typography>

          <ToggleButtonGroup
            value={species}
            exclusive
            onChange={(_, v) => v && setSpecies(v)}
            fullWidth
            disabled={disabled}
            sx={{
              "& .MuiToggleButton-root": {
                textTransform: "none",
                fontWeight: 800,
                py: 1.1,
              },
            }}
          >
            <ToggleButton value="dog">Dog</ToggleButton>
            <ToggleButton value="cat">Cat</ToggleButton>
            <ToggleButton value="other">Other</ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="Owner name"
          placeholder="Ali"
          value={ownerName}
          disabled={disabled}
          onChange={(e) => setOwnerName(e.target.value)}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonRoundedIcon sx={{ opacity: 0.6 }} />
              </InputAdornment>
            ),
          }}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="Phone (SMS/WhatsApp)"
          placeholder="+973XXXXXXXX"
          value={phone}
          disabled={disabled}
          onChange={(e) => setPhone(e.target.value)}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PhoneIphoneRoundedIcon sx={{ opacity: 0.6 }} />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
    </Grid>
  );
}
