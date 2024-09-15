// src/Login.js

import React, { useState, useEffect } from 'react';
import { auth } from './firebase'; // Ensure correct path to your firebase.js
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { TextField, Button, Grid, Typography, Paper, Alert, Box, Divider, Link } from '@mui/material';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate, Link as RouterLink } from 'react-router-dom'; // Import useNavigate for redirection
import GoogleIcon from '@mui/icons-material/Google';

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
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f0f0', // Light grey background
      }}
    >
      <Grid item xs={11} sm={8} md={6} lg={4}>
        <Paper elevation={6} sx={{ padding: '32px', borderRadius: '16px' }}>
          <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 3 }}>
            Anmelden
          </Typography>

          {/* Display authentication errors */}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error.message}</Alert>}
          {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}

          <form onSubmit={handleLogin}>
            <Grid container spacing={3}>
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
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
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
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  sx={{ borderRadius: '8px', py: 1.5 }}
                >
                  Anmelden
                </Button>
              </Grid>
            </Grid>
          </form>

          {/* Divider */}
          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="textSecondary">
              ODER
            </Typography>
          </Divider>

          {/* Google Sign-In Button */}
          <Button 
            variant="outlined" 
            color="primary" 
            fullWidth 
            onClick={handleGoogleSignIn} 
            startIcon={<GoogleIcon />}
            size="large"
            sx={{ borderRadius: '8px', py: 1.5, mb: 2 }}
          >
            Mit Google anmelden
          </Button>

          {/* Registration Link */}
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Noch kein Konto?{' '}
            <Link component={RouterLink} to="/registrieren" color="primary">
              Jetzt registrieren
            </Link>
          </Typography>
        </Paper>
      </Grid>
    </Box>
  );
};

export default Login;
