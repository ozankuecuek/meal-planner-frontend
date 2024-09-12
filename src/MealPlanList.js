import React, { useState, useEffect } from 'react';
import { db } from './firebase'; // Firestore
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import ShoppingList from './ShoppingList'; // Import the ShoppingList component
import { Grid, Paper, Typography, Button } from '@mui/material';

const MealPlanList = () => {
  const [mealPlans, setMealPlans] = useState([]);
  const [recipes, setRecipes] = useState({}); // Map recipe ID -> recipe title
  const [shoppingListExists, setShoppingListExists] = useState({}); // To track if shopping list exists

  // Fetch all meal plans from Firestore
  const fetchMealPlans = async () => {
    try {
      const mealPlanSnapshot = await getDocs(collection(db, 'mealplans'));
      const fetchedMealPlans = mealPlanSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMealPlans(fetchedMealPlans);
    } catch (error) {
      console.error('Error fetching meal plans: ', error);
    }
  };

  // Fetch all recipes and create a map for recipe ID -> recipe title
  const fetchRecipes = async () => {
    try {
      const recipeSnapshot = await getDocs(collection(db, 'recipes'));
      const recipeMap = {};
      recipeSnapshot.forEach((doc) => {
        const recipe = doc.data();
        recipeMap[doc.id] = recipe.title; // Map recipe ID to its title
      });
      setRecipes(recipeMap);
    } catch (error) {
      console.error('Error fetching recipes: ', error);
    }
  };

  // Check if shopping list exists for each meal plan
  const checkShoppingLists = async () => {
    try {
      const shoppingListMap = {};
      for (let mealPlan of mealPlans) {
        const q = query(collection(db, 'shoppinglists'), where('mealPlanId', '==', mealPlan.id));
        const querySnapshot = await getDocs(q);
        shoppingListMap[mealPlan.id] = !querySnapshot.empty; // If querySnapshot is not empty, shopping list exists
      }
      setShoppingListExists(shoppingListMap);
    } catch (error) {
      console.error('Error checking shopping lists:', error);
    }
  };

  // Delete meal plan and its shopping list
  const handleDeleteMealPlan = async (mealPlanId) => {
    try {
      // Delete the meal plan
      await deleteDoc(doc(db, 'mealplans', mealPlanId));

      // Also delete the corresponding shopping list
      const shoppingListQuery = query(collection(db, 'shoppinglists'), where('mealPlanId', '==', mealPlanId));
      const shoppingListSnapshot = await getDocs(shoppingListQuery);
      shoppingListSnapshot.forEach((docSnapshot) => {
        deleteDoc(doc(db, 'shoppinglists', docSnapshot.id)); // Delete each shopping list
      });

      // Update state to remove the deleted meal plan
      setMealPlans(mealPlans.filter((plan) => plan.id !== mealPlanId));

      alert('Meal plan and its shopping list have been deleted.');
    } catch (error) {
      console.error('Error deleting meal plan: ', error);
      alert('Failed to delete meal plan.');
    }
  };

  // Fetch meal plans and recipes when component mounts
  useEffect(() => {
    fetchMealPlans();
    fetchRecipes();
  }, []);

  // Check for shopping lists whenever meal plans are fetched
  useEffect(() => {
    if (mealPlans.length > 0) {
      checkShoppingLists();
    }
  }, [mealPlans]);

  return (
    <Grid container spacing={2} style={{ marginTop: '16px' }}>
      {mealPlans.map((mealPlan) => (
        <Grid item xs={12} sm={6} md={4} key={mealPlan.id}>
          <Paper elevation={3} style={{ padding: '16px' }}>
            <Typography variant="h6">{mealPlan.name || `Meal Plan ${mealPlan.id}`}</Typography>

            {mealPlan.meals ? (
              Object.keys(mealPlan.meals).map((dayKey, index) => (
                <div key={index}>
                  <Typography variant="subtitle1">{`Day ${index + 1}`}</Typography>
                  <Typography variant="body2">
                    <strong>Breakfast:</strong> {recipes[mealPlan.meals[dayKey].breakfast] || 'Not selected'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Lunch:</strong> {recipes[mealPlan.meals[dayKey].lunch] || 'Not selected'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Dinner:</strong> {recipes[mealPlan.meals[dayKey].dinner] || 'Not selected'}
                  </Typography>
                </div>
              ))
            ) : (
              <Typography variant="body2">No meals available for this plan</Typography>
            )}

            {/* Show "View Shopping List" button only if shopping list exists */}
            {shoppingListExists[mealPlan.id] ? (
              <div>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() =>
                    setShoppingListExists({ ...shoppingListExists, [mealPlan.id]: !shoppingListExists[mealPlan.id] })
                  }
                  style={{ marginTop: '16px' }}
                >
                  {shoppingListExists[mealPlan.id] ? 'Hide Shopping List' : 'View Shopping List'}
                </Button>

                {/* Show shopping list below the respective meal plan */}
                {shoppingListExists[mealPlan.id] && <ShoppingList mealPlanId={mealPlan.id} />}
              </div>
            ) : (
              <Typography variant="body2" color="textSecondary" style={{ marginTop: '16px' }}>
                No shopping list available for this meal plan.
              </Typography>
            )}

            {/* Delete Meal Plan button */}
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => handleDeleteMealPlan(mealPlan.id)}
              style={{ marginTop: '16px' }}
            >
              Delete Meal Plan
            </Button>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default MealPlanList;
