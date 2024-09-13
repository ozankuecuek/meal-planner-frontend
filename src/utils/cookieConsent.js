import Cookies from 'js-cookie';

export const hasCookieConsent = () => {
  return Cookies.get('cookieConsent') === 'true';
};

export const setAnalyticsCookies = () => {
  if (hasCookieConsent()) {
    // Set your analytics cookies here
    // For example:
    // Cookies.set('analytics_session_id', 'some-id', { expires: 30 });
  }
};

export const removeAnalyticsCookies = () => {
  // Remove your analytics cookies here
  // For example:
  // Cookies.remove('analytics_session_id');
};
