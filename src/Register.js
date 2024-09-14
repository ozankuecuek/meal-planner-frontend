import React, { useState } from 'react';
import { auth } from './firebase'; // Import the Firebase auth instance
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { TextField, Button, Grid, Typography, Paper } from '@mui/material';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Firebase registration
      await createUserWithEmailAndPassword(auth, email, password);
      alert('Registration successful!');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Paper elevation={3} style={{ padding: '16px', maxWidth: '400px', margin: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Registrieren
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      
      <form onSubmit={handleRegister}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="E-Mail"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Passwort"
              variant="outlined"
              fullWidth
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" fullWidth type="submit">
              Registrieren
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default Register;
