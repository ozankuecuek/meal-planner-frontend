import React from 'react';
import CookieConsent from 'react-cookie-consent';
import Cookies from 'js-cookie';

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
      This website uses cookies to enhance the user experience.{" "}
      <span style={{ fontSize: "10px" }}>
        <a href="/privacy-policy">Learn more</a>
      </span>
    </CookieConsent>
  );
};

export default CookieConsentBanner;
