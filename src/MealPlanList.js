import React, { useState, useEffect, useCallback } from 'react';
import { db, auth } from './firebase';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Typography, Button, Grid, Paper } from '@mui/material';
import ShoppingList from './ShoppingList';

const MealPlanList = () => {
  const [mealPlans, setMealPlans] = useState([]);
  const [recipes, setRecipes] = useState({});
  const [shoppingListExists, setShoppingListExists] = useState({});
  const [user] = useAuthState(auth);

  const fetchMealPlans = useCallback(async () => {
    if (!user) return;
    try {
      const q = query(collection(db, 'mealplans'), where('userId', '==', user.uid));
      const mealPlanSnapshot = await getDocs(q);
      const fetchedMealPlans = mealPlanSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log('Fetched meal plans:', fetchedMealPlans);
      setMealPlans(fetchedMealPlans);
    } catch (error) {
      console.error('Error fetching meal plans: ', error);
    }
  }, [user]);

  const fetchRecipes = useCallback(async () => {
    try {
      const recipeSnapshot = await getDocs(collection(db, 'recipes'));
      const recipeMap = {};
      recipeSnapshot.forEach((doc) => {
        const recipe = doc.data();
        recipeMap[doc.id] = recipe.title;
      });
      setRecipes(recipeMap);
    } catch (error) {
      console.error('Error fetching recipes: ', error);
    }
  }, []);

  const checkShoppingLists = useCallback(async () => {
    try {
      const shoppingListMap = {};
      for (let mealPlan of mealPlans) {
        const q = query(collection(db, 'shoppinglists'), where('mealPlanId', '==', mealPlan.id));
        const querySnapshot = await getDocs(q);
        shoppingListMap[mealPlan.id] = !querySnapshot.empty;
      }
      setShoppingListExists(shoppingListMap);
    } catch (error) {
      console.error('Error checking shopping lists:', error);
    }
  }, [mealPlans]);

  const handleDeleteMealPlan = useCallback(async (mealPlanId) => {
    if (!user) {
      alert('You must be logged in to delete meal plans.');
      return;
    }
    try {
      console.log('Attempting to delete meal plan:', mealPlanId);
      
      await deleteDoc(doc(db, 'mealplans', mealPlanId));
      console.log('Meal plan deleted successfully');

      const shoppingListQuery = query(collection(db, 'shoppinglists'), where('mealPlanId', '==', mealPlanId));
      const shoppingListSnapshot = await getDocs(shoppingListQuery);
      const deletePromises = shoppingListSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      console.log('Associated shopping lists deleted');

      setMealPlans(prevMealPlans => prevMealPlans.filter(plan => plan.id !== mealPlanId));
      console.log('State updated');

      alert('Meal plan and its shopping list have been deleted.');
    } catch (error) {
      console.error('Error deleting meal plan: ', error);
      alert(`Failed to delete meal plan. Error: ${error.message}`);
    }
  }, [user, setMealPlans]);

  useEffect(() => {
    console.log('User state changed:', user);
    if (user) {
      fetchMealPlans();
      fetchRecipes();
    }
  }, [user, fetchMealPlans, fetchRecipes]);

  useEffect(() => {
    if (mealPlans.length > 0) {
      checkShoppingLists();
    }
  }, [mealPlans, checkShoppingLists]);

  console.log('Rendering MealPlanList, mealPlans:', mealPlans);

  if (!user) {
    return <Typography>Please log in to view your meal plans.</Typography>;
  }

  if (mealPlans.length === 0) {
    return <Typography>You haven't created any meal plans yet.</Typography>;
  }

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
            {shoppingListExists[mealPlan.id] && (
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setShoppingListExists({ ...shoppingListExists, [mealPlan.id]: !shoppingListExists[mealPlan.id] })}
                style={{ marginTop: '16px' }}
              >
                {shoppingListExists[mealPlan.id] ? 'Hide Shopping List' : 'View Shopping List'}
              </Button>
            )}
            {shoppingListExists[mealPlan.id] && <ShoppingList mealPlanId={mealPlan.id} />}
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
