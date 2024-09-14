import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Routes, Route } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import theme from './theme/theme';
import Navbar from './components/Navbar';
import MealPlanForm from './MealPlanForm';
import RecipeList from './RecipeList';
import RecipeForm from './RecipeForm';
import Login from './Login';
import Register from './Register';
import MealPlanList from './MealPlanList';
import RecipeDetail from './components/RecipeDetail';

// Remove this line if you're not using populateRecipes
// import { populateRecipes } from './utils/populateRecipes';

function App() {
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [user] = useAuthState(auth);

  const handleEdit = (recipe) => {
    setEditingRecipe(recipe);
  };

  const handleSubmit = () => {
    setEditingRecipe(null);
    // Optionally, you can refresh the recipe list here
  };

  const handleRecipeSaved = () => {
    // Do something after the recipe is saved, like refreshing the recipe list
    console.log('Recipe saved successfully');
  };

  // Remove this useEffect if you're not using populateRecipes
  /*
  useEffect(() => {
    const populateRecipesOnce = async () => {
      if (!recipesPopulated) {
        await populateRecipes();
        setRecipesPopulated(true);
        console.log('Recipes have been populated');
      }
    };

    populateRecipesOnce();
  }, [recipesPopulated]);
  */

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar user={user} />
      <div style={{ padding: '16px', maxWidth: '1200px', margin: 'auto' }}>
        <Routes>
          <Route path="/" element={<MealPlanForm />} />
          <Route path="/rezepte" element={<RecipeList onEdit={handleEdit} />} />
          <Route path="/rezepte/:id" element={<RecipeDetail />} />
          <Route path="/rezepte/neu" element={<RecipeForm />} />
          <Route 
            path="/rezepte/bearbeiten/:id" 
            element={
              <RecipeForm 
                editingRecipe={editingRecipe} 
                onSubmit={handleSubmit} 
              />
            } 
          />
          <Route path="/essensplaene/neu" element={<MealPlanForm />} />
          <Route path="/anmelden" element={<Login />} />
          <Route path="/registrieren" element={<Register />} />
          <Route path="/essensplaene" element={<MealPlanList />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
