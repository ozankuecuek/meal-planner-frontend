import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Typography, Paper, List, ListItem, ListItemText, Grid, Chip, Divider } from '@mui/material';
import { AccessTime, Restaurant, LocalDining } from '@mui/icons-material';

const RecipeDetail = () => {
  const [recipe, setRecipe] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // ... existing useEffect code ...
  }, [id]);

  const formatIngredient = (ingredient) => {
    // ... existing formatIngredient function ...
  };

  if (!recipe) {
    return <Typography variant="h6" align="center">Lädt...</Typography>;
  }

  return (
    <Paper elevation={3} sx={{ maxWidth: 800, margin: 'auto', mt: 4, p: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          {recipe.imageUrl && (
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
            />
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>{recipe.title}</Typography>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            {recipe.prepTime && (
              <Grid item xs={4}>
                <Chip icon={<AccessTime />} label={`${recipe.prepTime} min`} />
              </Grid>
            )}
            {recipe.servings && (
              <Grid item xs={4}>
                <Chip icon={<Restaurant />} label={`${recipe.servings} Portionen`} />
              </Grid>
            )}
            {recipe.difficulty && (
              <Grid item xs={4}>
                <Chip icon={<LocalDining />} label={recipe.difficulty} />
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>

      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>Zutaten</Typography>
      <Grid container spacing={2}>
        {recipe.ingredients && recipe.ingredients.map((ingredient, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Chip label={formatIngredient(ingredient)} sx={{ width: '100%' }} />
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>Anleitung</Typography>
      <List>
        {recipe.instructions && recipe.instructions.map((instruction, index) => (
          <ListItem key={index} sx={{ display: 'list-item', listStyleType: 'decimal', ml: 4 }}>
            <ListItemText 
              primary={instruction} 
              primaryTypographyProps={{ variant: 'body1' }}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default RecipeDetail;