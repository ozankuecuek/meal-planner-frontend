import React from 'react';
import CookieConsent from 'react-cookie-consent';
import Cookies from 'js-cookie';
import { Link as RouterLink } from 'react-router-dom';

const CookieConsentBanner = () => {
  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept"
      declineButtonText="Decline"
      cookieName="mealPlannerCookieConsent"
      style={{ background: "#2B373B" }}
      buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
      expires={150}
      enableDeclineButton
      onAccept={() => {
        Cookies.set('cookieConsent', 'true', { expires: 150 });
      }}
      onDecline={() => {
        Cookies.set('cookieConsent', 'false', { expires: 150 });
      }}
    >
      Diese Website verwendet Cookies für Analysezwecke, um die Benutzererfahrung zu verbessern.{" "}
      <span style={{ fontSize: "10px" }}>
        <Link component={RouterLink} to="/privacy-policy" color="inherit">
          Mehr erfahren
        </Link>
      </span>
    </CookieConsent>
  );
};

export default CookieConsentBanner;
