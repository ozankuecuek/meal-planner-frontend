import React, { useState } from 'react';
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

function App() {
  const [editingRecipe, setEditingRecipe] = useState(null); // For editing recipes
  const [isRegistering, setIsRegistering] = useState(false); // Toggle between login and register
  const [user] = useAuthState(auth); // Check authentication status

  // Handle when the user clicks "Edit" on a recipe
  const handleEdit = (recipe) => {
    setEditingRecipe(recipe);
  };

  return (
    <ThemeProvider theme={theme}> {/* Wrap the app with ThemeProvider */}
      <CssBaseline /> {/* Apply base CSS reset */}
      
      {/* Add the Navbar here */}
      <Navbar user={user} /> {/* Pass user prop to Navbar */}

      <div style={{ padding: '16px', maxWidth: '1200px', margin: 'auto' }}>
        {!user && (
          <div>
            {isRegistering ? (
              <>
                <Register />
                <p>
                  Already have an account?{' '}
                  <button onClick={() => setIsRegistering(false)}>Login</button>
                </p>
              </>
            ) : (
              <>
                <Login />
                <p>
                  Don't have an account?{' '}
                  <button onClick={() => setIsRegistering(true)}>Register</button>
                </p>
              </>
            )}
          </div>
        )}

        {user && (
          <>
            {/* Create a Recipe Section */}
            <div id="create-recipe">
              <h2>Create a Recipe</h2>
              <RecipeForm editingRecipe={editingRecipe} />
            </div>

            {/* Recipes Section */}
            <div id="recipes" style={{ marginTop: '50px' }}>
              <h2>Recipes</h2>
              <RecipeList onEdit={handleEdit} />
            </div>

            {/* Create a Meal Plan Section */}
            <div id="create-mealplan" style={{ marginTop: '50px' }}>
              <h2>Create a Meal Plan</h2>
              <MealPlanForm />
            </div>

            {/* My Meal Plans Section */}
            <div id="mealplans" style={{ marginTop: '50px' }}>
              <h2>My Meal Plans</h2>
              <MealPlanList />
            </div>

            {/* Logout button */}
            <button onClick={() => auth.signOut()} style={{ marginTop: '20px' }}>
              Logout
            </button>
          </>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;