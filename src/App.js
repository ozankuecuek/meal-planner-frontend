import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';  // Import the theme from theme.js
import Navbar from './components/Navbar'; // Import Navbar
import Login from './Login';
import Register from './Register';
import RecipeForm from './RecipeForm'; // Recipe creation and editing
import RecipeList from './RecipeList'; // Recipe list component
import MealPlanForm from './MealPlanForm'; // Meal plan creation component
import MealPlanList from './MealPlanList'; // Meal plan list component
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CookieConsentBanner from './components/CookieConsent';
import { analytics } from './firebase';
import { logEvent } from "firebase/analytics";
import { useLocation } from 'react-router-dom';

function App() {
  const [editingRecipe, setEditingRecipe] = useState(null); // For editing recipes
  const [isRegistering, setIsRegistering] = useState(false); // Toggle between login and register
  const [user] = useAuthState(auth); // Check authentication status
  const location = useLocation();

  // Handle when the user clicks "Edit" on a recipe
  const handleEdit = (recipe) => {
    setEditingRecipe(recipe);
  };

  useEffect(() => {
    logEvent(analytics, 'page_view', { page_path: location.pathname });
  }, [location]);

  return (
    <ThemeProvider theme={theme}> {/* Wrap the app with ThemeProvider */}
      <CssBaseline /> {/* Apply base CSS reset */}
      
      {/* Add the Router here */}
      <Router>
        {/* Add the Navbar here */}
        <Navbar user={user} /> {/* Pass user prop to Navbar */}

        <div style={{ padding: '16px', maxWidth: '1200px', margin: 'auto' }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<MealPlanForm onEdit={handleEdit} />} />
            <Route path="/recipes" element={<RecipeList onEdit={handleEdit} />} />
            <Route path="/mealplans/new" element={<MealPlanForm />} />
            <Route
              path="/login"
              element={
                <>
                  <Login />
                  <p>
                    Don't have an account?{' '}
                    <button onClick={() => setIsRegistering(true)}>Register</button>
                  </p>
                </>
              }
            />
            <Route
              path="/register"
              element={
                <>
                  <Register />
                  <p>
                    Already have an account?{' '}
                    <button onClick={() => setIsRegistering(false)}>Login</button>
                  </p>
                </>
              }
            />

            {/* Protected Routes */}
            {user ? (
              <>
                <Route path="/recipes/new" element={<RecipeForm editingRecipe={editingRecipe} />} />
                <Route path="/mealplans" element={<MealPlanList />} />
              </>
            ) : (
              <>
                {/* Redirect to login if not authenticated */}
                <Route
                  path="/recipes/new"
                  element={
                    <>
                      <Login />
                      <p>
                        Don't have an account?{' '}
                        <button onClick={() => setIsRegistering(true)}>Register</button>
                      </p>
                    </>
                  }
                />
                <Route
                  path="/mealplans"
                  element={
                    <>
                      <Login />
                      <p>
                        Don't have an account?{' '}
                        <button onClick={() => setIsRegistering(true)}>Register</button>
                      </p>
                    </>
                  }
                />
              </>
            )}
          </Routes>
        </div>
        <CookieConsentBanner />
      </Router>
    </ThemeProvider>
  );
}

export default App;
