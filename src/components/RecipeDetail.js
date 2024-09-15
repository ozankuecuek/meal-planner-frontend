import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Typography, Paper, Grid, Chip, Divider, Box, Stepper, Step, StepLabel } from '@mui/material';
import { AccessTime, Restaurant, LocalDining } from '@mui/icons-material';

const RecipeDetail = () => {
  const [recipe, setRecipe] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const recipeDoc = await getDoc(doc(db, 'recipes', id));
        if (recipeDoc.exists()) {
          const recipeData = { id: recipeDoc.id, ...recipeDoc.data() };
          console.log('Fetched recipe data:', recipeData);
          setRecipe(recipeData);
        } else {
          console.log('Kein solches Rezept gefunden!');
        }
      } catch (error) {
        console.error('Fehler beim Abrufen des Rezepts:', error);
      }
    };
    fetchRecipe();
  }, [id]);

  if (!recipe) {
    return <Typography variant="h6" align="center">Lädt...</Typography>;
  }

  const formatIngredient = (ingredient) => {
    let formattedIngredient = ingredient.name || '';
    
    const quantity = ingredient.quantity || ingredient.menge;
    const unit = ingredient.unit || ingredient.einheit;
    
    if (quantity) {
      formattedIngredient += ` - ${quantity}`;
    }
    if (unit) {
      formattedIngredient += ` ${unit}`;
    }
    return formattedIngredient.trim();
  };

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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {recipe.prepTime && (
              <Chip 
                icon={<AccessTime />} 
                label={`${recipe.prepTime} min`}
                sx={chipStyle}
              />
            )}
            {recipe.servings && (
              <Chip 
                icon={<Restaurant />} 
                label={`${recipe.servings} Portionen`}
                sx={chipStyle}
              />
            )}
            {recipe.difficulty && (
              <Chip 
                icon={<LocalDining />} 
                label={recipe.difficulty}
                sx={chipStyle}
              />
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Add description here */}
      {recipe.description && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>Beschreibung</Typography>
          <Typography variant="body1">{recipe.description}</Typography>
        </Box>
      )}

      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>Zutaten</Typography>
      <Grid container spacing={2}>
        {recipe.ingredients && recipe.ingredients.map((ingredient, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Chip 
              label={formatIngredient(ingredient)} 
              sx={{ 
                width: '100%', 
                height: 'auto', 
                '& .MuiChip-label': { 
                  whiteSpace: 'normal',
                  padding: '8px',
                  textAlign: 'left'
                }
              }} 
            />
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>Anleitung</Typography>
      <Stepper orientation="vertical" sx={{ mt: 2 }}>
        {recipe.instructions && recipe.instructions.map((instruction, index) => (
          <Step key={index} active={true} sx={{ p: 0 }}>
            <StepLabel
              StepIconComponent={() => (
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: 'primary.main',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                >
                  {index + 1}
                </Box>
              )}
              sx={{
                alignItems: 'flex-start',
                '& .MuiStepLabel-labelContainer': {
                  width: 'calc(100% - 32px)',
                  ml: 2,
                },
              }}
            >
              <Typography 
                variant="body1" 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  minHeight: '32px',
                }}
              >
                {instruction}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Paper>
  );
};

const chipStyle = {
  width: '100%',
  height: 'auto',
  justifyContent: 'flex-start',
  '& .MuiChip-label': { 
    display: 'flex', 
    alignItems: 'center', 
    whiteSpace: 'normal',
    padding: '8px',
    paddingLeft: '0',
    textAlign: 'left'
  },
  '& .MuiChip-icon': {
    marginRight: '8px',
    marginLeft: '8px'
  }
};

export default RecipeDetail;
