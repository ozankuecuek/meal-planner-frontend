import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { hasCookieConsent, setAnalyticsCookies } from './utils/cookieConsent';
import { BrowserRouter } from 'react-router-dom';
import AnalyticsTracker from './components/AnalyticsTracker';

const root = ReactDOM.createRoot(document.getElementById('root'));
if (hasCookieConsent()) {
  setAnalyticsCookies();
}

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AnalyticsTracker />
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
reportWebVitals();

