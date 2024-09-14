import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Link } from '@mui/material';
import Cookies from 'js-cookie';
import { Link as RouterLink } from 'react-router-dom';

const CookieConsentBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consentCookie = Cookies.get('mealPlannerCookieConsent');
    if (consentCookie === undefined) {
      setShowBanner(true);
    }
  }, []);

  if (!showBanner) {
    return null;
  }

  const handleAccept = () => {
    Cookies.set('mealPlannerCookieConsent', 'true', { expires: 150 });
    setShowBanner(false);
  };

  const handleDecline = () => {
    Cookies.set('mealPlannerCookieConsent', 'false', { expires: 150 });
    setShowBanner(false);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        bgcolor: 'background.paper',
        boxShadow: 3,
        p: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 9999,
      }}
    >
      <Typography variant="body2" sx={{ mr: 2 }}>
        Diese Website verwendet Cookies für Analysezwecke, um die Benutzererfahrung zu verbessern.{' '}
        <Link component={RouterLink} to="/privacy-policy" color="primary" underline="hover">
          Mehr erfahren
        </Link>
      </Typography>
      <Box>
        <Button variant="outlined" color="primary" onClick={handleDecline} sx={{ mr: 1 }}>
          Ablehnen
        </Button>
        <Button variant="contained" color="primary" onClick={handleAccept}>
          Akzeptieren
        </Button>
      </Box>
    </Box>
  );
};

export default CookieConsentBanner;
