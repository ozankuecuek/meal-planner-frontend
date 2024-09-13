import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Routes, Route } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import theme from './theme/theme';  // Import the theme from theme.js
import Navbar from './components/Navbar'; // Import Navbar
import MealPlanForm from './MealPlanForm'; // Meal plan creation component
import RecipeList from './RecipeList'; // Recipe list component
import RecipeForm from './RecipeForm'; // Recipe creation and editing
import Login from './Login';
import Register from './Register';
import MealPlanList from './MealPlanList';

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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar user={user} />
      <div style={{ padding: '16px', maxWidth: '1200px', margin: 'auto' }}>
        <Routes>
          <Route path="/" element={<MealPlanForm />} />
          <Route path="/recipes" element={<RecipeList onEdit={handleEdit} />} />
          <Route path="/recipes/new" element={<RecipeForm />} />
          <Route path="/recipes/edit/:id" element={<RecipeForm editingRecipe={editingRecipe} onSubmit={handleSubmit} />} />
          <Route path="/mealplans/new" element={<MealPlanForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/mealplans" element={<MealPlanList />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
