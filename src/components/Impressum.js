import React from 'react';
import { Typography, Container } from '@mui/material';

const Impressum = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>Impressum</Typography>
      <Typography variant="h6" gutterBottom>Angaben gemäß § 5 TMG</Typography>
      <Typography paragraph>
        Ozan Kücük<br />
        Leuthener Straße 13<br />
        10829 Berlin
      </Typography>
    
    </Container>
  );
};

export default Impressum;