import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { collection, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { TextField, Button, Grid, Typography, Paper, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import MealPlanSummary from './MealPlanSummary';
import { analytics } from './firebase';
import { logEvent } from "firebase/analytics";
import RecipeSelector from './components/RecipeSelector';

const MealPlanForm = ({ editingMealPlan }) => {
  const [mealPlanName, setMealPlanName] = useState('');
  const [numDays, setNumDays] = useState(1);
  const [numPeople, setNumPeople] = useState('1');
  const [numPeopleError, setNumPeopleError] = useState('');
  const [meals, setMeals] = useState(() => {
    const initialMeals = {};
    for (let i = 0; i < numDays; i++) {
      initialMeals[`day${i + 1}`] = { breakfast: null, lunch: null, dinner: null };
    }
    return initialMeals;
  });
  const [recipes, setRecipes] = useState([]);
  const [user] = useAuthState(auth);
  const [sessionId, setSessionId] = useState(null);
  const [mealPlanId, setMealPlanId] = useState(null);
  const [mealPlanData, setMealPlanData] = useState(null);
  const [shoppingList, setShoppingList] = useState(null);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [currentMealType, setCurrentMealType] = useState('');
  const [currentDay, setCurrentDay] = useState('');

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
    initializeMeals(days);
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

    if (!validateNumPeople(numPeople)) {
      return;
    }

    try {
      const mealPlan = {
        name: mealPlanName,
        meals,
        numPeople: parseInt(numPeople, 10),
        createdAt: new Date(),
        ...(user ? { userId: user.uid } : { sessionId }),
      };

      let mealPlanRef;

      // Create or update the meal plan
      if (editingMealPlan) {
        mealPlanRef = doc(db, 'mealplans', editingMealPlan.id);
        await updateDoc(mealPlanRef, mealPlan);
        setMealPlanId(editingMealPlan.id);
      } else {
        mealPlanRef = await addDoc(collection(db, 'mealplans'), mealPlan);
        setMealPlanId(mealPlanRef.id);
      }

      // Calculate and save the shopping list
      const shoppingListData = calculateShoppingList(meals);
      setShoppingList(shoppingListData);

      // Save meal plan data to state for display
      setMealPlanData(mealPlan);

      // Optionally, save the shopping list to Firestore if needed
      await addDoc(collection(db, 'shoppinglists'), {
        mealPlanId: mealPlanRef.id,
        shoppingList: shoppingListData,
        createdAt: new Date(),
        ...(user ? { userId: user.uid } : { sessionId }),
      });

      logEvent(analytics, 'meal_plan_created', { plan_name: mealPlanName });

      alert('Meal plan and shopping list saved successfully!');
    } catch (error) {
      console.error('Error saving meal plan and shopping list: ', error);
      alert('Failed to save meal plan');
    }
  };

  // Fetch recipes and initialize session ID when the component mounts
  useEffect(() => {
    fetchRecipes();

    let currentSessionId = sessionStorage.getItem('sessionId');
    if (!currentSessionId) {
      currentSessionId = uuidv4();
      sessionStorage.setItem('sessionId', currentSessionId);
    }
    setSessionId(currentSessionId);

    if (editingMealPlan) {
      setMealPlanName(editingMealPlan.name);
      setNumDays(Object.keys(editingMealPlan.meals).length);
      setMeals(editingMealPlan.meals);
      setNumPeople(editingMealPlan.numPeople?.toString() || '1');
    }
  }, [editingMealPlan]);

  if (mealPlanId && mealPlanData && shoppingList) {
    return (
      <MealPlanSummary
        mealPlanId={mealPlanId}
        mealPlanData={mealPlanData}
        shoppingList={shoppingList}
        recipes={recipes}
      />
    );
  }

  // Helper function to get recipe title by ID
  const getRecipeTitleById = (id) => {
    const recipe = recipes.find((r) => r.id === id);
    return recipe ? recipe.title : 'No selection';
  };

  const handleOpenSelector = (day, mealType) => {
    console.log('Opening selector for day:', day, 'meal:', mealType);
    setCurrentDay(day);
    setCurrentMealType(mealType);
    setSelectorOpen(true);
  };

  const handleCloseSelector = () => {
    setSelectorOpen(false);
  };

  const handleSelectRecipe = (recipeId) => {
    console.log('Selecting recipe:', recipeId, 'for day:', currentDay, 'meal:', currentMealType);
    setMeals(prevMeals => {
      const newMeals = {
        ...prevMeals,
        [currentDay]: { ...prevMeals[currentDay], [currentMealType]: recipeId },
      };
      console.log('Updated meals:', newMeals);
      return newMeals;
    });
    setSelectorOpen(false);
  };

  const validateNumPeople = (value) => {
    const num = parseInt(value, 10);
    if (isNaN(num) || num < 1) {
      setNumPeopleError('Please enter a number 1 or greater');
      return false;
    }
    setNumPeopleError('');
    return true;
  };

  return (
    <Paper elevation={3} style={{ padding: '16px', maxWidth: '600px', margin: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        {editingMealPlan ? 'Edit Meal Plan' : 'Create a Meal Plan'}
      </Typography>

      <form onSubmit={handleSubmit}>
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
              label="Number of People"
              variant="outlined"
              fullWidth
              value={numPeople}
              onChange={(e) => {
                setNumPeople(e.target.value);
                validateNumPeople(e.target.value);
              }}
              onBlur={() => validateNumPeople(numPeople)}
              error={!!numPeopleError}
              helperText={numPeopleError}
              required
              type="number"
              inputProps={{ min: "1" }}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Number of Days</InputLabel>
              <Select
                value={numDays}
                onChange={handleNumDaysChange}
                label="Number of Days"
              >
                {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                  <MenuItem key={day} value={day}>{day}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Dynamically generate meal inputs for each day */}
          {Object.keys(meals).map((dayKey, index) => (
            <Grid item xs={12} key={index}>
              <Typography variant="h6">{`Day ${index + 1}`}</Typography>

              {['breakfast', 'lunch', 'dinner'].map((mealType) => (
                <div key={mealType}>
                  <Typography variant="body1">
                    {mealType.charAt(0).toUpperCase() + mealType.slice(1)}:
                    {meals[dayKey][mealType] ? (
                      ` ${getRecipeTitleById(meals[dayKey][mealType])}`
                    ) : (
                      ' No selection'
                    )}
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => handleOpenSelector(dayKey, mealType)}
                    style={{ marginTop: '8px', marginBottom: '8px' }}
                  >
                    {meals[dayKey][mealType] ? 'Change Recipe' : 'Select Recipe'}
                  </Button>
                </div>
              ))}
            </Grid>
          ))}

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              type="submit"
              style={{ marginTop: '16px' }}
            >
              Save Meal Plan
            </Button>
          </Grid>
        </Grid>
      </form>

      <RecipeSelector
        open={selectorOpen}
        onClose={handleCloseSelector}
        recipes={recipes}
        onSelect={handleSelectRecipe}
      />
    </Paper>
  );
};

export default MealPlanForm;
