import React, { useState, useEffect, useCallback } from 'react';
import { db, auth } from './firebase';
import { collection, getDocs, query, where, deleteDoc, doc, documentId } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Typography, Button, Grid, Paper } from '@mui/material';
import EinkaufsListe from './EinkaufsListe';
import ShoppingList from './ShoppingList';
import { generateMealPlanPDF } from './utils/pdfGenerator';

const EssensplanListe = () => {
  const [essensPlaene, setEssensPlaene] = useState([]);
  const [rezepte, setRezepte] = useState({});
  const [einkaufsListeExistiert, setEinkaufsListeExistiert] = useState({});
  const [user] = useAuthState(auth);
  const [openShoppingList, setOpenShoppingList] = useState({});

  const essensplaeneAbrufen = useCallback(async () => {
    if (!user) return;
    try {
      const q = query(collection(db, 'mealplans'), where('userId', '==', user.uid));
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
  }, [user]);

  const rezepteAbrufen = useCallback(async () => {
    try {
      const rezeptSnapshot = await getDocs(collection(db, 'recipes'));
      const rezeptMap = {};
      rezeptSnapshot.forEach((doc) => {
        const rezept = doc.data();
        rezeptMap[doc.id] = rezept.title;
      });
      setRezepte(rezeptMap);
    } catch (error) {
      console.error('Fehler beim Abrufen der Rezepte: ', error);
    }
  }, []);

  const einkaufslistenPruefen = useCallback(async () => {
    try {
      const einkaufslistenMap = {};
      for (let essensplan of essensPlaene) {
        const q = query(collection(db, 'shoppinglists'), where('mealPlanId', '==', essensplan.id));
        const querySnapshot = await getDocs(q);
        einkaufslistenMap[essensplan.id] = !querySnapshot.empty;
      }
      setEinkaufsListeExistiert(einkaufslistenMap);
    } catch (error) {
      console.error('Fehler beim Prüfen der Einkaufslisten:', error);
    }
  }, [essensPlaene]);

  const essensplanLoeschen = useCallback(async (essensplanId) => {
    if (!user) {
      alert('Sie müssen angemeldet sein, um Essenspläne zu löschen.');
      return;
    }
    try {
      console.log('Versuch, Essensplan zu löschen:', essensplanId);
      
      await deleteDoc(doc(db, 'mealplans', essensplanId));
      console.log('Essensplan erfolgreich gelöscht');

      const einkaufslistenQuery = query(collection(db, 'shoppinglists'), where('mealPlanId', '==', essensplanId));
      const einkaufslistenSnapshot = await getDocs(einkaufslistenQuery);
      const loeschVersprechen = einkaufslistenSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(loeschVersprechen);
      console.log('Zugehörige Einkaufslisten gelöscht');

      setEssensPlaene(vorherigePlaene => vorherigePlaene.filter(plan => plan.id !== essensplanId));
      console.log('Status aktualisiert');

      alert('Essensplan und zugehörige Einkaufsliste wurden gelöscht.');
    } catch (error) {
      console.error('Fehler beim Löschen des Essensplans: ', error);
      alert(`Fehler beim Löschen des Essensplans. Fehler: ${error.message}`);
    }
  }, [user, setEssensPlaene]);

  const toggleShoppingList = (essensplanId) => {
    setOpenShoppingList(prev => ({
      ...prev,
      [essensplanId]: !prev[essensplanId]
    }));
  };

  const handleDownload = async (essensplan) => {
    try {
      // Fetch shopping list
      const shoppingListQuery = query(collection(db, 'shoppinglists'), where('mealPlanId', '==', essensplan.id));
      const shoppingListSnapshot = await getDocs(shoppingListQuery);
      const shoppingList = shoppingListSnapshot.docs[0]?.data()?.shoppingList || {};

      // Fetch full recipe details
      const recipeIds = [...new Set(Object.values(essensplan.meals).flatMap(day => Object.values(day)))];
      const recipesQuery = query(collection(db, 'recipes'), where(documentId(), 'in', recipeIds));
      const recipesSnapshot = await getDocs(recipesQuery);
      const fullRecipes = recipesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Generate and download PDF
      const doc = generateMealPlanPDF(essensplan, shoppingList, fullRecipes);
      doc.save(`${essensplan.name || `Essensplan ${essensplan.id}`}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  useEffect(() => {
    console.log('Benutzerstatus geändert:', user);
    if (user) {
      essensplaeneAbrufen();
      rezepteAbrufen();
    }
  }, [user, essensplaeneAbrufen, rezepteAbrufen]);

  useEffect(() => {
    if (essensPlaene.length > 0) {
      einkaufslistenPruefen();
    }
  }, [essensPlaene, einkaufslistenPruefen]);

  console.log('Rendering EssensplanListe, essensPlaene:', essensPlaene);

  if (!user) {
    return <Typography>Bitte melden Sie sich an, um Ihre Essenspläne zu sehen.</Typography>;
  }

  if (essensPlaene.length === 0) {
    return <Typography>Sie haben noch keine Essenspläne erstellt.</Typography>;
  }

  return (
    <Grid container spacing={2} style={{ marginTop: '16px' }}>
      {essensPlaene.map((essensplan) => (
        <Grid item xs={12} sm={6} md={4} key={essensplan.id}>
          <Paper elevation={3} style={{ padding: '16px' }}>
            <Typography variant="h6">{essensplan.name || `Essensplan ${essensplan.id}`}</Typography>
            {essensplan.meals ? (
              Object.keys(essensplan.meals).map((tagKey, index) => (
                <div key={index}>
                  <Typography variant="subtitle1">{`Tag ${index + 1}`}</Typography>
                  <Typography variant="body2">
                    <strong>Frühstück:</strong> {rezepte[essensplan.meals[tagKey].breakfast] || 'Nicht ausgewählt'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Mittagessen:</strong> {rezepte[essensplan.meals[tagKey].lunch] || 'Nicht ausgewählt'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Abendessen:</strong> {rezepte[essensplan.meals[tagKey].dinner] || 'Nicht ausgewählt'}
                  </Typography>
                </div>
              ))
            ) : (
              <Typography variant="body2">Keine Mahlzeiten für diesen Plan verfügbar</Typography>
            )}
            <Button
              variant="outlined"
              color="primary"
              onClick={() => toggleShoppingList(essensplan.id)}
              style={{ marginTop: '16px' }}
            >
              {openShoppingList[essensplan.id] ? 'Einkaufsliste ausblenden' : 'Einkaufsliste anzeigen'}
            </Button>
            {openShoppingList[essensplan.id] && (
              <ShoppingList mealPlanId={essensplan.id} />
            )}
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleDownload(essensplan)}
              style={{ marginTop: '16px' }}
            >
              PDF herunterladen
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => essensplanLoeschen(essensplan.id)}
              style={{ marginTop: '16px' }}
            >
              Versorgungsplan löschen
            </Button>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default EssensplanListe;
