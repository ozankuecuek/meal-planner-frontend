import React, { useState, useEffect } from 'react';
import { db, auth, storage } from './firebase'; // Import Firebase Storage
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // For image upload
import { useAuthState } from 'react-firebase-hooks/auth';
import { TextField, Button, Grid, Typography, Paper, MenuItem } from '@mui/material';

const RecipeForm = ({ editingRecipe }) => {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '', unit: '' }]);
  const [instructions, setInstructions] = useState(['']); // Initialize with one empty step
  const [image, setImage] = useState(null); // State for image upload
  const [user] = useAuthState(auth);
  const [servings, setServings] = useState('');
  const [servingsError, setServingsError] = useState('');
  const [allIngredients, setAllIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState({ name: '', quantity: '', unit: 'Stk' });

  // Fetch all unique ingredients from the entire recipe catalog
  const fetchAllIngredients = async () => {
    const recipeSnapshot = await getDocs(collection(db, 'recipes'));
    const uniqueIngredients = new Set();
    recipeSnapshot.forEach((doc) => {
      const recipe = doc.data();
      if (Array.isArray(recipe.ingredients)) {
        recipe.ingredients.forEach((ingredient) => {
          uniqueIngredients.add(ingredient.name);
        });
      }
    });
    setAllIngredients(Array.from(uniqueIngredients));
  };

  // Handle adding a new ingredient to the list
  const addIngredient = () => {
    if (!newIngredient.name || !newIngredient.quantity || !newIngredient.unit) {
      return; // Skip if ingredient details are incomplete
    }
    setIngredients([...ingredients, newIngredient]);
    setNewIngredient({ name: '', quantity: '', unit: 'Stk' });
  };

  // Add a new instruction step
  const addStep = () => {
    setInstructions([...instructions, '']); // Add a new empty step
  };

  // Remove an instruction step
  const removeStep = (index) => {
    if (instructions.length > 1) {
      const updatedSteps = instructions.filter((_, i) => i !== index);
      setInstructions(updatedSteps);
    } else {
      alert('A recipe must have at least one step.');
    }
  };

  // Update an individual step in the instructions
  const updateStep = (index, value) => {
    const updatedSteps = [...instructions];
    updatedSteps[index] = value;
    setInstructions(updatedSteps);
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  // Handle form submission (create or update a recipe)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateServings(servings)) {
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
        servings: parseInt(servings, 10),
        userId: user.uid,
        createdAt: new Date()
      };

      await addDoc(collection(db, 'recipes'), recipeData);
      alert('Recipe saved successfully!');
      // Reset form or redirect user
    } catch (error) {
      console.error('Error saving recipe: ', error);
      alert('Failed to save recipe');
    }
  };

  const validateServings = (value) => {
    const num = parseInt(value, 10);
    if (isNaN(num) || num < 1) {
      setServingsError('Please enter a number 1 or greater');
      return false;
    }
    setServingsError('');
    return true;
  };

  // Fetch all ingredients on mount
  useEffect(() => {
    fetchAllIngredients();
    if (editingRecipe) {
      setTitle(editingRecipe.title);
      setIngredients(editingRecipe.ingredients);
      setInstructions(editingRecipe.instructions);
      setServings(editingRecipe.servings?.toString() || '');
    }
  }, [editingRecipe]);

  return (
    <Paper elevation={3} style={{ padding: '16px', maxWidth: '600px', margin: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        {editingRecipe ? 'Edit Recipe' : 'Create a New Recipe'}
      </Typography>
      
      <form onSubmit={handleSubmit}>
        {/* Recipe Title */}
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
          <Grid item xs={12}>
            <TextField
              label="Number of Servings"
              variant="outlined"
              fullWidth
              value={servings}
              onChange={(e) => {
                setServings(e.target.value);
                validateServings(e.target.value);
              }}
              onBlur={() => validateServings(servings)}
              error={!!servingsError}
              helperText={servingsError}
              required
              type="number"
              inputProps={{ min: "1" }}
            />
          </Grid>

          {/* Ingredients Section */}
          <Grid item xs={12}>
            <Typography variant="h6">Ingredients</Typography>

            <TextField
              label="Ingredient Name"
              variant="outlined"
              fullWidth
              placeholder="Type ingredient or select from dropdown"
              value={newIngredient.name}
              onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
            />

            <TextField
              select
              label="Select Ingredient"
              variant="outlined"
              fullWidth
              onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
              style={{ marginTop: '8px' }}
            >
              <MenuItem value="">Select an ingredient</MenuItem>
              {allIngredients.map((ingredient, index) => (
                <MenuItem key={index} value={ingredient}>
                  {ingredient}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Quantity"
              variant="outlined"
              fullWidth
              type="number"
              value={newIngredient.quantity}
              onChange={(e) => setNewIngredient({ ...newIngredient, quantity: e.target.value })}
              style={{ marginTop: '8px' }}
            />

            <TextField
              select
              label="Unit"
              variant="outlined"
              fullWidth
              value={newIngredient.unit}
              onChange={(e) => setNewIngredient({ ...newIngredient, unit: e.target.value })}
              style={{ marginTop: '8px' }}
            >
              <MenuItem value="Stk">Stk</MenuItem>
              <MenuItem value="g">g</MenuItem>
              <MenuItem value="ml">ml</MenuItem>
              <MenuItem value="EL">EL</MenuItem>
              <MenuItem value="TL">TL</MenuItem>
            </TextField>

            <Button 
              variant="contained" 
              color="primary" 
              onClick={addIngredient} 
              style={{ marginTop: '16px' }}
            >
              Add Ingredient
            </Button>

            <ul>
              {ingredients.map((ingredient, index) => (
                <li key={index}>
                  {ingredient.name} - {ingredient.quantity} {ingredient.unit}
                </li>
              ))}
            </ul>
          </Grid>

          {/* Instructions Section */}
          <Grid item xs={12}>
            <Typography variant="h6">Instructions</Typography>
            {instructions.map((step, index) => (
              <div key={index}>
                <TextField
                  label={`Step ${index + 1}`}
                  variant="outlined"
                  fullWidth
                  value={step}
                  onChange={(e) => updateStep(index, e.target.value)}
                  required
                  style={{ marginTop: '8px' }}
                />
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  onClick={() => removeStep(index)} 
                  style={{ marginTop: '8px' }}
                >
                  Remove Step
                </Button>
              </div>
            ))}

            <Button 
              variant="contained" 
              color="primary" 
              onClick={addStep} 
              style={{ marginTop: '16px' }}
            >
              Add Step
            </Button>
          </Grid>

          {/* Image Upload Section */}
          <Grid item xs={12}>
            <Typography variant="h6">Upload Recipe Image</Typography>
            <input type="file" onChange={handleImageUpload} style={{ marginTop: '8px' }} />
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button variant="contained" color="primary" fullWidth type="submit" style={{ marginTop: '16px' }}>
              Save Recipe
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default RecipeForm;
