import React from 'react';
import { Typography, Paper, Button } from '@mui/material';
import { generateMealPlanPDF } from '../utils/pdfGenerator';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

const MealPlanSummary = ({ mealPlanId, mealPlanData, shoppingList, recipes }) => {
  // ... existing code ...

  const handleDownload = async () => {
    try {
      // Fetch full recipe details
      const recipeIds = [...new Set(Object.values(mealPlanData.meals).flatMap(day => Object.values(day)))];
      const recipesQuery = query(collection(db, 'recipes'), where('id', 'in', recipeIds));
      const recipesSnapshot = await getDocs(recipesQuery);
      const fullRecipes = recipesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const doc = generateMealPlanPDF(mealPlanData, shoppingList, fullRecipes);
      doc.save(`${mealPlanData.name}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  return (
    <Paper elevation={3} style={{ padding: '16px', marginTop: '16px' }}>
      <Typography variant="h5">{mealPlanData.name}</Typography>

      {/* ... existing code ... */}

      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleDownload} 
        style={{ marginTop: '16px' }}
      >
        Download PDF
      </Button>
    </Paper>
  );
};

export default MealPlanSummary;