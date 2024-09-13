// MealPlanSummary.js
import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Typography, Paper } from '@mui/material';

const MealPlanSummary = ({ mealPlanId, mealPlanData, shoppingList, recipes }) => {
  // Since mealPlanData and shoppingList are already passed as props,
  // we don't need to fetch them again.

  // Helper function to get recipe title by ID
  const getRecipeTitleById = (id) => {
    const recipe = recipes.find((r) => r.id === id);
    return recipe ? recipe.title : 'No selection';
  };

  return (
    <Paper elevation={3} style={{ padding: '16px', marginTop: '16px' }}>
      <Typography variant="h5">{mealPlanData.name}</Typography>

      <Typography variant="h6" style={{ marginTop: '16px' }}>
        Meal Plan
      </Typography>
      {Object.keys(mealPlanData.meals).map((dayKey, index) => {
        const dayMeals = mealPlanData.meals[dayKey];
        return (
          <div key={index} style={{ marginTop: '8px' }}>
            <Typography variant="subtitle1">{`Day ${index + 1}`}</Typography>
            <Typography variant="body2">Breakfast: {getRecipeTitleById(dayMeals.breakfast)}</Typography>
            <Typography variant="body2">Lunch: {getRecipeTitleById(dayMeals.lunch)}</Typography>
            <Typography variant="body2">Dinner: {getRecipeTitleById(dayMeals.dinner)}</Typography>
          </div>
        );
      })}

      <Typography variant="h6" style={{ marginTop: '16px' }}>
        Shopping List
      </Typography>
      <ul>
        {Object.values(shoppingList).map((item, index) => (
          <li key={index}>
            {item.name}: {item.quantity} {item.unit}
          </li>
        ))}
      </ul>
    </Paper>
  );
};

export default MealPlanSummary;
