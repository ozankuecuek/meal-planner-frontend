import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { collection, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { TextField, Button, Grid, Typography, Paper, MenuItem } from '@mui/material';

const MealPlanForm = ({ editingMealPlan }) => {
  const [mealPlanName, setMealPlanName] = useState(''); // New state for meal plan name
  const [numDays, setNumDays] = useState(1); // Number of days in the meal plan
  const [meals, setMeals] = useState({});
  const [recipes, setRecipes] = useState([]); // Store fetched recipes
  const [user] = useAuthState(auth);

  // Initialize meal plan structure dynamically based on the number of days
  const initializeMeals = (days) => {
    const newMeals = {};
    for (let i = 1; i <= days; i++) {
      newMeals[`day${i}`] = { breakfast: '', lunch: '', dinner: '' };
    }
    setMeals(newMeals);
  };

  // Fetch all recipes from Firestore
  const fetchRecipes = async () => {
    try {
      const recipeSnapshot = await getDocs(collection(db, 'recipes'));
      const fetchedRecipes = recipeSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecipes(fetchedRecipes);
    } catch (error) {
      console.error('Error fetching recipes: ', error);
    }
  };

  // Handle the number of days change
  const handleNumDaysChange = (e) => {
    const days = parseInt(e.target.value, 10);
    setNumDays(days);
    initializeMeals(days); // Reinitialize the meals structure based on the new number of days
  };

  // Calculate the shopping list based on the selected recipes
  const calculateShoppingList = (mealPlan) => {
    const shoppingList = {};

    Object.keys(mealPlan).forEach((dayKey) => {
      const dayMeals = mealPlan[dayKey];

      ['breakfast', 'lunch', 'dinner'].forEach((mealType) => {
        const recipeId = dayMeals[mealType];
        const recipe = recipes.find((r) => r.id === recipeId);

        if (recipe && Array.isArray(recipe.ingredients)) {
          recipe.ingredients.forEach((ingredient) => {
            const key = `${ingredient.name}-${ingredient.unit}`;

            // Sum quantities for each unique ingredient-unit combination
            if (shoppingList[key]) {
              shoppingList[key].quantity += parseFloat(ingredient.quantity);
            } else {
              shoppingList[key] = {
                name: ingredient.name,
                quantity: parseFloat(ingredient.quantity),
                unit: ingredient.unit,
              };
            }
          });
        }
      });
    });

    return shoppingList;
  };

  // Handle form submission (create or update a meal plan and shopping list)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const mealPlanData = {
        name: mealPlanName, // Save the meal plan name
        userId: user.uid,
        meals,
      };

      let mealPlanId;

      // Create or update the meal plan
      if (editingMealPlan) {
        const mealPlanRef = doc(db, 'mealplans', editingMealPlan.id);
        await updateDoc(mealPlanRef, mealPlanData);
        mealPlanId = editingMealPlan.id;
      } else {
        const mealPlanRef = await addDoc(collection(db, 'mealplans'), mealPlanData);
        mealPlanId = mealPlanRef.id;
      }

      // Calculate and save the shopping list
      const shoppingList = calculateShoppingList(meals);
      await addDoc(collection(db, 'shoppinglists'), {
        mealPlanId,
        shoppingList,
        userId: user.uid,
      });

      alert('Meal plan and shopping list saved successfully!');
    } catch (error) {
      console.error('Error saving meal plan and shopping list: ', error);
      alert('Failed to save meal plan');
    }
  };

  // Fetch recipes when the component mounts
  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <Paper elevation={3} style={{ padding: '16px', maxWidth: '600px', margin: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        {editingMealPlan ? 'Edit Meal Plan' : 'Create a Meal Plan'}
      </Typography>

      <form onSubmit={handleSubmit}>
        {/* Meal Plan Name */}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Meal Plan Name"
              variant="outlined"
              fullWidth
              value={mealPlanName}
              onChange={(e) => setMealPlanName(e.target.value)}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Number of Days"
              variant="outlined"
              fullWidth
              type="number"
              value={numDays}
              onChange={handleNumDaysChange}
              min="1"
              required
            />
          </Grid>

          {/* Dynamically generate meal inputs for each day */}
          {Object.keys(meals).map((dayKey, index) => (
            <Grid item xs={12} key={index}>
              <Typography variant="h6">{`Day ${index + 1}`}</Typography>

              {/* Dropdown for Breakfast */}
              <TextField
                select
                label="Breakfast"
                variant="outlined"
                fullWidth
                value={meals[dayKey].breakfast}
                onChange={(e) =>
                  setMeals({ ...meals, [dayKey]: { ...meals[dayKey], breakfast: e.target.value } })
                }
                style={{ marginTop: '8px' }}
              >
                <MenuItem value="">Select a recipe</MenuItem>
                {recipes.map((recipe) => (
                  <MenuItem key={recipe.id} value={recipe.id}>
                    {recipe.title}
                  </MenuItem>
                ))}
              </TextField>

              {/* Dropdown for Lunch */}
              <TextField
                select
                label="Lunch"
                variant="outlined"
                fullWidth
                value={meals[dayKey].lunch}
                onChange={(e) =>
                  setMeals({ ...meals, [dayKey]: { ...meals[dayKey], lunch: e.target.value } })
                }
                style={{ marginTop: '8px' }}
              >
                <MenuItem value="">Select a recipe</MenuItem>
                {recipes.map((recipe) => (
                  <MenuItem key={recipe.id} value={recipe.id}>
                    {recipe.title}
                  </MenuItem>
                ))}
              </TextField>

              {/* Dropdown for Dinner */}
              <TextField
                select
                label="Dinner"
                variant="outlined"
                fullWidth
                value={meals[dayKey].dinner}
                onChange={(e) =>
                  setMeals({ ...meals, [dayKey]: { ...meals[dayKey], dinner: e.target.value } })
                }
                style={{ marginTop: '8px' }}
              >
                <MenuItem value="">Select a recipe</MenuItem>
                {recipes.map((recipe) => (
                  <MenuItem key={recipe.id} value={recipe.id}>
                    {recipe.title}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          ))}

          <Grid item xs={12}>
            <Button variant="contained" color="primary" fullWidth type="submit" style={{ marginTop: '16px' }}>
              Save Meal Plan
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default MealPlanForm;
