"use client";

import BookingForm from "@/components/booking/BookingForm";
import { AppBar, Box, Container, Paper, Toolbar, Typography } from "@mui/material";
import PetsRoundedIcon from "@mui/icons-material/PetsRounded";

export default function BookPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        backgroundImage:
          "radial-gradient(900px 500px at 12% 0%, rgba(25,118,210,.12), transparent 60%), radial-gradient(900px 500px at 88% 10%, rgba(156,39,176,.10), transparent 60%)",
      }}
    >
      <AppBar position="sticky" elevation={0} color="transparent" sx={{ backdropFilter: "blur(8px)" }}>
        <Toolbar sx={{ gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
              bgcolor: "rgba(25,118,210,.10)",
              border: "1px solid rgba(25,118,210,.18)",
            }}
          >
            <PetsRoundedIcon fontSize="small" />
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
              Book an Appointment
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.75 }}>
              Choose a service, pick a time, confirm.
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: { xs: 3, sm: 5 } }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid rgba(0,0,0,.12)",
            overflow: "hidden",
          }}
        >
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <BookingForm />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
