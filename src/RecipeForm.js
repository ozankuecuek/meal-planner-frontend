import React, { useState, useEffect } from 'react';
import { db, auth, storage } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuthState } from 'react-firebase-hooks/auth';
import { TextField, Button, Grid, Typography, Paper } from '@mui/material';

const RecipeForm = () => {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '', unit: '' }]);
  const [instructions, setInstructions] = useState(['']);
  const [image, setImage] = useState(null);
  const [user] = useAuthState(auth);

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '', unit: '' }]);
  };

  const removeIngredient = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const updateIngredient = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const addInstruction = () => {
    setInstructions([...instructions, '']);
  };

  const removeInstruction = (index) => {
    const newInstructions = instructions.filter((_, i) => i !== index);
    setInstructions(newInstructions);
  };

  const updateInstruction = (index, value) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
    setInstructions(newInstructions);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('You must be logged in to save a recipe');
      return;
    }

    try {
      let imageUrl = '';
      if (image) {
        const storageRef = ref(storage, `recipeImages/${image.name}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }

      const recipeData = {
        title,
        ingredients,
        instructions,
        imageUrl,
        userId: user.uid,
        createdAt: new Date()
      };

      await addDoc(collection(db, 'recipes'), recipeData);
      alert('Recipe saved successfully!');
      // Reset form
      setTitle('');
      setIngredients([{ name: '', quantity: '', unit: '' }]);
      setInstructions(['']);
      setImage(null);
    } catch (error) {
      console.error('Error saving recipe: ', error);
      alert('Failed to save recipe');
    }
  };

  return (
    <Paper elevation={3} style={{ padding: '16px', maxWidth: '600px', margin: 'auto', marginBottom: '20px' }}>
      <Typography variant="h5" gutterBottom>
        Create a New Recipe
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Recipe Title"
              variant="outlined"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Grid>
          
          {/* Ingredients */}
          {ingredients.map((ingredient, index) => (
            <Grid item xs={12} key={index}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <TextField
                    label="Ingredient"
                    variant="outlined"
                    fullWidth
                    value={ingredient.name}
                    onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    label="Quantity"
                    variant="outlined"
                    fullWidth
                    value={ingredient.quantity}
                    onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    label="Unit"
                    variant="outlined"
                    fullWidth
                    value={ingredient.unit}
                    onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={2}>
                  <Button onClick={() => removeIngredient(index)}>Remove</Button>
                </Grid>
              </Grid>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button onClick={addIngredient}>Add Ingredient</Button>
          </Grid>

          {/* Instructions */}
          {instructions.map((instruction, index) => (
            <Grid item xs={12} key={index}>
              <Grid container spacing={2}>
                <Grid item xs={10}>
                  <TextField
                    label={`Step ${index + 1}`}
                    variant="outlined"
                    fullWidth
                    value={instruction}
                    onChange={(e) => updateInstruction(index, e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={2}>
                  <Button onClick={() => removeInstruction(index)}>Remove</Button>
                </Grid>
              </Grid>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button onClick={addInstruction}>Add Step</Button>
          </Grid>

          {/* Image Upload */}
          <Grid item xs={12}>
            <input
              accept="image/*"
              type="file"
              onChange={handleImageUpload}
            />
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Save Recipe
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default RecipeForm;
