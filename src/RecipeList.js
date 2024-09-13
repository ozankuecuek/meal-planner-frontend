import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Grid, Paper, Typography, Button } from '@mui/material';

const RecipeList = ({ onEdit }) => {
  const [recipes, setRecipes] = useState([]);
  const [user] = useAuthState(auth); // Get current user

  // Fetch recipes from Firestore
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'recipes'));
        const recipesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecipes(recipesList);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };
    fetchRecipes();
  }, []);

  // Function to delete a recipe
  const handleDelete = async (recipeId) => {
    if (!user) {
      alert('You must be logged in to delete recipes.');
      return;
    }
    try {
      await deleteDoc(doc(db, 'recipes', recipeId));
      alert('Recipe deleted successfully!');
      setRecipes(recipes.filter((recipe) => recipe.id !== recipeId)); // Update state to remove deleted recipe
    } catch (error) {
      console.error('Error deleting recipe:', error);
      alert('Failed to delete recipe.');
    }
  };

  return (
    <Grid container spacing={2} style={{ marginTop: '16px' }}>
      {recipes.map((recipe) => (
        <Grid item xs={12} sm={6} md={4} key={recipe.id}>
          <Paper elevation={3} style={{ padding: '16px' }}>
            <Typography variant="h6">{recipe.title}</Typography>

            {/* Render the ingredients */}
            {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 && (
              <Typography variant="body2" style={{ marginTop: '8px' }}>
                <strong>Ingredients:</strong>
                <ul>
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>
                      {ingredient.name} - {ingredient.quantity} {ingredient.unit}
                    </li>
                  ))}
                </ul>
              </Typography>
            )}

            {/* Render the instructions */}
            {Array.isArray(recipe.instructions) && recipe.instructions.length > 0 && (
              <Typography variant="body2" style={{ marginTop: '8px' }}>
                <strong>Instructions:</strong>
                <ul>
                  {recipe.instructions.map((step, index) => (
                    <li key={index}>Step {index + 1}: {step}</li>
                  ))}
                </ul>
              </Typography>
            )}

            {/* Render the image if it exists */}
            {recipe.imageUrl && (
              <div style={{ marginTop: '16px' }}>
                <Typography variant="body2"><strong>Recipe Image:</strong></Typography>
                <img
                  src={recipe.imageUrl}
                  alt="Recipe"
                  style={{ width: '100%', height: 'auto' }} // Adjust size to be responsive
                />
              </div>
            )}

            {/* Only show the edit and delete buttons if the user is the owner */}
            {user && user.uid === recipe.authorId && (
              <>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => onEdit(recipe)}
                  style={{ marginTop: '16px' }}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleDelete(recipe.id)}
                  style={{ marginTop: '8px' }}
                >
                  Delete
                </Button>
              </>
            )}
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default RecipeList;
