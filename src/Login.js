// src/Login.js

import React, { useState, useEffect } from 'react';
import { auth } from './firebase'; // Ensure correct path to your firebase.js
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { TextField, Button, Grid, Typography, Paper, Alert } from '@mui/material';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const Login = () => {
  const [email, setEmail] = useState(''); // State for email input
  const [password, setPassword] = useState(''); // State for password input
  const [formError, setFormError] = useState(''); // State for form submission errors
  const [user, loading, error] = useAuthState(auth); // Get user, loading state, and error from Firebase
  const navigate = useNavigate(); // Initialize useNavigate

  // Google sign-in provider
  const googleProvider = new GoogleAuthProvider();

  // Redirect to /essensplaene/neu if user is authenticated
  useEffect(() => {
    if (user) {
      navigate('/essensplaene/neu'); // Redirect to "Create Meal Plan" page
    }
  }, [user, navigate]);

  // Handle email/password login
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setFormError(''); // Reset form error

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Redirection is handled by useEffect
    } catch (err) {
      console.error('Error signing in:', err);
      setFormError(err.message); // Set form error to display to the user
    }
  };

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      // Redirection is handled by useEffect
    } catch (err) {
      console.error('Error signing in with Google:', err);
      setFormError(err.message); // Set form error to display to the user
    }
  };

  // If the authentication state is loading, show a loading indicator
  if (loading) {
    return (
      <Grid container justifyContent="center" style={{ marginTop: '50px' }}>
        <Typography variant="h6">Loading...</Typography>
      </Grid>
    );
  }

  return (
    <Grid container justifyContent="center" style={{ marginTop: '50px' }}>
      <Grid item xs={11} sm={8} md={6} lg={4}>
        <Paper elevation={3} style={{ padding: '32px' }}>
          <Typography variant="h5" gutterBottom>
            Anmelden
          </Typography>

          {/* Display authentication errors */}
          {error && <Alert severity="error">{error.message}</Alert>}
          {formError && <Alert severity="error">{formError}</Alert>}

          <form onSubmit={handleLogin}>
            <Grid container spacing={2}>
              {/* Email Field */}
              <Grid item xs={12}>
                <TextField
                  label="E-Mail"
                  variant="outlined"
                  type="email"
                  required
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>

              {/* Password Field */}
              <Grid item xs={12}>
                <TextField
                  label="Passwort"
                  variant="outlined"
                  type="password"
                  required
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Anmelden
                </Button>
              </Grid>
            </Grid>
          </form>

          {/* Divider */}
          <Typography align="center" variant="body1" style={{ margin: '16px 0' }}>
            ODER
          </Typography>

          {/* Google Sign-In Button */}
          <Button 
            variant="outlined" 
            color="secondary" 
            fullWidth 
            onClick={handleGoogleSignIn} 
            style={{ marginTop: '16px' }}
          >
            Mit Google anmelden
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Login;
