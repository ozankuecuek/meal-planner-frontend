import React from 'react';
import { Typography, Container } from '@mui/material';

const PrivacyPolicy = () => {
  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Privacy Policy
      </Typography>
      <Typography paragraph>
        This privacy policy explains how we use cookies and process your data.
      </Typography>
      {/* Add more details about your privacy policy here */}
    </Container>
  );
};

export default PrivacyPolicy;
