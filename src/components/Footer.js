import React from 'react';
import { Box, Container, Typography, Link, Grid } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6 }}>
      <Container maxWidth="lg">
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <Link component={RouterLink} to="/impressum" color="inherit">
              Impressum
            </Link>
          </Grid>
          <Grid item>
            <Link component={RouterLink} to="/agb" color="inherit">
              AGB
            </Link>
          </Grid>
          <Grid item>
            <Link component={RouterLink} to="/widerrufsbelehrung" color="inherit">
              Widerrufsbelehrung
            </Link>
          </Grid>
          <Grid item>
            <Link component={RouterLink} to="/privacy-policy" color="inherit">
              Datenschutzerklärung
            </Link>
          </Grid>
        </Grid>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
          {'© '}
          {new Date().getFullYear()}
          {' Gruppenverpflegung. Alle Rechte vorbehalten.'}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;