import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Grid, Typography, Button, CardContent, CardActions, Card } from '@mui/material';
import { useNavigate } from 'react-router-dom';

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
            style={{ cursor: 'pointer' }}
          >
            <CardContent>
              <Typography variant="h6" component="div">
                {recipe.title}
              </Typography>
              {recipe.imageUrl && (
                <img
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  style={{ width: '100%', height: 'auto', marginTop: '8px' }}
                />
              )}
            </CardContent>
            {user && user.uid === recipe.userId && (
              <CardActions>
                <Button size="small" onClick={(e) => handleEdit(e, recipe)}>
                  Bearbeiten
                </Button>
                <Button size="small" onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(recipe.id);
                }}>
                  Löschen
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
