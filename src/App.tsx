import React, { useState } from "react";
import { Button, Container, Typography, Box, TextField } from "@mui/material";

export default function App() {
  const [name, setName] = useState("");
  const [greetMsg, setGreetMsg] = useState("");

  const greet = () => {
    setGreetMsg(`Hello, ${name}! Welcome to your Warehouse Simulation.`);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Warehouse Simulation with MUI
      </Typography>

      <Box component="form" noValidate autoComplete="off" sx={{ mb: 2 }}>
        <TextField
          label="Enter your name"
          variant="outlined"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Box>

      <Button variant="contained" onClick={greet} disabled={!name}>
        Greet Me
      </Button>

      {greetMsg && (
        <Typography variant="h6" sx={{ mt: 3, color: "primary.main" }}>
          {greetMsg}
        </Typography>
      )}
    </Container>
  );
}
