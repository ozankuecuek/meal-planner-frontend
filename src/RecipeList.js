import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Grid, Typography, Button, CardContent, CardActions, Card, CardMedia, Box, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const RecipeList = ({ onEdit }) => {
  const [recipes, setRecipes] = useState([]);
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

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
        console.error('Fehler beim Abrufen der Rezepte:', error);
      }
    };
    fetchRecipes();
  }, []);

  // Function to delete a recipe
  const handleDelete = async (recipeId) => {
    if (!user) {
      alert('Sie müssen angemeldet sein, um Rezepte zu löschen.');
      return;
    }
    try {
      await deleteDoc(doc(db, 'recipes', recipeId));
      setRecipes(recipes.filter((recipe) => recipe.id !== recipeId));
      alert('Rezept erfolgreich gelöscht!');
    } catch (error) {
      console.error('Fehler beim Löschen des Rezepts:', error);
      alert('Fehler beim Löschen des Rezepts.');
    }
  };

  // Function to edit a recipe
  const handleEdit = (event, recipe) => {
    event.stopPropagation();
    onEdit(recipe);
    navigate(`/rezepte/bearbeiten/${recipe.id}`);
  };

  const handleCardClick = (recipeId) => {
    navigate(`/rezepte/${recipeId}`);
  };

  return (
    <Grid container spacing={3}>
      {recipes.map((recipe) => (
        <Grid item xs={12} sm={6} md={4} key={recipe.id}>
          <Card 
            onClick={() => handleCardClick(recipe.id)}
            style={{ cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}
            elevation={3}
          >
            <CardMedia
              component="img"
              height="200"
              image={recipe.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
              alt={recipe.title}
            />
            <CardContent style={{ flexGrow: 1 }}>
              <Typography variant="h6" component="div" gutterBottom>
                {recipe.title}
              </Typography>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                {recipe.prepTime && (
                  <Chip icon={<AccessTimeIcon />} label={`Prep: ${recipe.prepTime}`} size="small" />
                )}
                {recipe.cookTime && (
                  <Chip icon={<RestaurantIcon />} label={`Cook: ${recipe.cookTime}`} size="small" />
                )}
              </Box>
              <Typography variant="body2" color="text.secondary">
                {recipe.description ? (
                  recipe.description.length > 100 ? 
                    `${recipe.description.substring(0, 100)}...` : 
                    recipe.description
                ) : 'No description available'}
              </Typography>
            </CardContent>
            {user && user.uid === recipe.userId && (
              <CardActions>
                <Button size="small" color="primary" onClick={(e) => handleEdit(e, recipe)}>
                  Edit
                </Button>
                <Button size="small" color="secondary" onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(recipe.id);
                }}>
                  Delete
                </Button>
              </CardActions>
            )}
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default RecipeList;
