import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Typography, Paper, List, ListItem, ListItemText } from '@mui/material';

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
    return <Typography>Lädt...</Typography>;
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
    <div>
      <Paper elevation={3} style={{ padding: '16px' }}>
        <Typography variant="h4">{recipe.title}</Typography>
        {recipe.imageUrl && (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            style={{ width: '100%', height: 'auto', marginTop: '16px' }}
          />
        )}
        <Typography variant="h6" style={{ marginTop: '16px' }}>Zutaten:</Typography>
        <List>
          {recipe.ingredients && recipe.ingredients.map((ingredient, index) => (
            <ListItem key={index}>
              <ListItemText primary={formatIngredient(ingredient)} />
            </ListItem>
          ))}
        </List>
        <Typography variant="h6" style={{ marginTop: '16px' }}>Anleitung:</Typography>
        <List>
          {recipe.instructions && recipe.instructions.map((instruction, index) => (
            <ListItem key={index}>
              <ListItemText primary={`Schritt ${index + 1}: ${instruction}`} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </div>
  );
};

export default RecipeDetail;
