import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '../firebase.js';
import { logEvent } from "firebase/analytics";

const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    logEvent(analytics, 'page_view', { page_path: location.pathname });
  }, [location]);

  return null;
};

export default AnalyticsTracker;
