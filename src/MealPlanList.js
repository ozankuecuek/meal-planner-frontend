import React, { useState, useEffect, useCallback } from 'react';
import { db, auth } from './firebase';
import { collection, getDocs, query, where, deleteDoc, doc, documentId } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Typography, Grid, Box } from '@mui/material';
import { generateMealPlanPDF } from './utils/pdfGenerator';
import MealPlanSummary from './MealPlanSummary';

const EssensplanListe = () => {
  const [essensPlaene, setEssensPlaene] = useState([]);
  const [rezepte, setRezepte] = useState([]);  // Initialize as an empty array
  const [shoppingLists, setShoppingLists] = useState({});
  const [user] = useAuthState(auth);

  const essensplaeneAbrufen = useCallback(async () => {
    try {
      let q;
      if (user) {
        q = query(collection(db, 'mealplans'), where('userId', '==', user.uid));
      } else {
        // Fetch public meal plans for non-logged-in users
        q = query(collection(db, 'mealplans'), where('isPublic', '==', true));
      }
      const essensplanSnapshot = await getDocs(q);
      const abgerufeneEssensplaene = essensplanSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log('Abgerufene Essenspläne:', abgerufeneEssensplaene);
      setEssensPlaene(abgerufeneEssensplaene);
    } catch (error) {
      console.error('Fehler beim Abrufen der Essenspläne: ', error);
    }
  }, [user, db]);

  const rezepteAbrufen = useCallback(async () => {
    try {
      const rezeptSnapshot = await getDocs(collection(db, 'recipes'));
      const rezeptArray = rezeptSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRezepte(rezeptArray);
    } catch (error) {
      console.error('Fehler beim Abrufen der Rezepte: ', error);
    }
  }, []);

  const fetchShoppingLists = useCallback(async () => {
    const shoppingListsData = {};
    for (const plan of essensPlaene) {
      const q = query(collection(db, 'shoppinglists'), where('mealPlanId', '==', plan.id));
      const querySnapshot = await getDocs(q);
      shoppingListsData[plan.id] = querySnapshot.docs[0]?.data()?.shoppingList || {};
    }
    setShoppingLists(shoppingListsData);
  }, [essensPlaene, db]);

  const handleDownload = useCallback(async (mealPlanData) => {
    try {
      console.log("Downloading meal plan:", mealPlanData.id);
      console.log("Meal plan data:", mealPlanData);

      // Use the pre-fetched shopping list
      const shoppingList = shoppingLists[mealPlanData.id] || {};
      console.log("Shopping list:", shoppingList);

      // Fetch full recipe details
      const recipeIds = [...new Set(Object.values(mealPlanData.meals).flatMap(day => Object.values(day)))].filter(id => id !== null && id !== undefined);
      console.log("Recipe IDs:", recipeIds);
      const recipesQuery = query(collection(db, 'recipes'), where(documentId(), 'in', recipeIds));
      const recipesSnapshot = await getDocs(recipesQuery);
      const fullRecipes = recipesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log("Full recipes:", fullRecipes);

      // Generate and download PDF
      const doc = generateMealPlanPDF(mealPlanData, shoppingList, fullRecipes);
      doc.save(`${mealPlanData.name || `Essensplan ${mealPlanData.id}`}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      console.error('Error details:', error.message, error.stack);
      throw error; // Rethrow the error to be caught in the MealPlanSummary component
    }
  }, [db, shoppingLists]);

  useEffect(() => {
    console.log('Benutzerstatus geändert:', user);
    essensplaeneAbrufen();
    rezepteAbrufen();
  }, [user, essensplaeneAbrufen, rezepteAbrufen]);

  useEffect(() => {
    if (essensPlaene.length > 0) {
      fetchShoppingLists();
    }
  }, [essensPlaene, fetchShoppingLists]);

  console.log('Rendering EssensplanListe, essensPlaene:', essensPlaene);

  return (
    <Box sx={{ maxWidth: '1200px', margin: 'auto', padding: '24px' }}>
      {essensPlaene.length === 0 ? (
        <Typography>
          {user 
            ? "Sie haben noch keine Versorgungspläne erstellt." 
            : "Es sind keine öffentlichen Versorgungspläne verfügbar."}
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {essensPlaene.map((essensplan) => (
            <Grid item xs={12} sm={6} md={4} key={essensplan.id}>
              <MealPlanSummary
                mealPlanId={essensplan.id}
                mealPlanData={essensplan}
                shoppingList={shoppingLists[essensplan.id] || {}}
                recipes={rezepte}  // Pass the recipes array here
                handleDownload={handleDownload}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default EssensplanListe;
