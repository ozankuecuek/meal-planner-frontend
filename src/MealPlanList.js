import React, { useState, useEffect, useCallback } from 'react';
import { db, auth } from './firebase';
import { collection, getDocs, query, where, deleteDoc, doc, documentId } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Typography, Button, Grid, Paper, Box, Divider, IconButton, Tooltip, Accordion, AccordionSummary, AccordionDetails, useMediaQuery, useTheme } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ShoppingList from './ShoppingList';
import { generateMealPlanPDF } from './utils/pdfGenerator';

const EssensplanListe = () => {
  const [essensPlaene, setEssensPlaene] = useState([]);
  const [rezepte, setRezepte] = useState({});
  const [einkaufsListeExistiert, setEinkaufsListeExistiert] = useState({});
  const [user] = useAuthState(auth);
  const [openShoppingList, setOpenShoppingList] = useState({});
  const [expandedDays, setExpandedDays] = useState({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
      const recipeIds = [...new Set(Object.values(essensplan.meals).flatMap(day => Object.values(day)))].filter(id => id !== null && id !== undefined);
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

  const handleAccordionChange = (essensplanId, dayIndex) => (event, isExpanded) => {
    setExpandedDays(prev => ({
      ...prev,
      [essensplanId]: {
        ...prev[essensplanId],
        [dayIndex]: isExpanded
      }
    }));
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

  return (
    <Box sx={{ maxWidth: '1200px', margin: 'auto', padding: '24px' }}>
      {essensPlaene.length === 0 ? (
        <Typography>Sie haben noch keine Versorgungspläne erstellt.</Typography>
      ) : (
        <Grid container spacing={3} alignItems="flex-start">
          {essensPlaene.map((essensplan) => (
            <Grid item xs={12} sm={6} md={4} key={essensplan.id} sx={{ display: 'flex' }}>
              <Paper 
                elevation={3} 
                sx={{ 
                  borderRadius: 2, 
                  overflow: 'hidden', 
                  display: 'flex', 
                  flexDirection: 'column',
                  width: '100%',
                  height: 'auto',
                  minHeight: '100%'
                }}
              >
                <Box sx={{ 
                  bgcolor: 'primary.main', 
                  color: 'primary.contrastText', 
                  p: 2,
                  display: 'flex', 
                  flexDirection: 'column',
                }}>
                  <Typography 
                    variant="h6" 
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      lineHeight: 1.2,
                      marginBottom: 1
                    }}
                  >
                    {essensplan.name || `Versorgungsplan ${essensplan.id}`}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Tooltip title="Einkaufsliste">
                      <IconButton size="small" color="inherit" onClick={() => toggleShoppingList(essensplan.id)}>
                        <ShoppingCartIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="PDF herunterladen">
                      <IconButton size="small" color="inherit" onClick={() => handleDownload(essensplan)}>
                        <PictureAsPdfIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Löschen">
                      <IconButton size="small" color="inherit" onClick={() => essensplanLoeschen(essensplan.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                  {essensplan.meals ? (
                    Object.keys(essensplan.meals).map((tagKey, index) => (
                      <Accordion 
                        key={`${essensplan.id}-${index}`}
                        expanded={expandedDays[essensplan.id]?.[index] || false}
                        onChange={handleAccordionChange(essensplan.id, index)}
                        sx={{
                          '&.Mui-expanded': {
                            margin: 0,
                          },
                          '&:before': {
                            display: 'none',
                          },
                        }}
                      >
                        <AccordionSummary 
                          expandIcon={<ExpandMoreIcon />}
                          sx={{
                            '&.Mui-expanded': {
                              minHeight: 48,
                            },
                          }}
                        >
                          <Typography>{`Tag ${index + 1}`}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography paragraph>
                            <strong>Frühstück:</strong> {rezepte[essensplan.meals[tagKey].breakfast] || 'Nicht ausgewählt'}
                          </Typography>
                          <Typography paragraph>
                            <strong>Mittagessen:</strong> {rezepte[essensplan.meals[tagKey].lunch] || 'Nicht ausgewählt'}
                          </Typography>
                          <Typography>
                            <strong>Abendessen:</strong> {rezepte[essensplan.meals[tagKey].dinner] || 'Nicht ausgewählt'}
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                    ))
                  ) : (
                    <Typography>Keine Mahlzeiten für diesen Plan verfügbar</Typography>
                  )}
                </Box>
                {openShoppingList[essensplan.id] && (
                  <Box sx={{ p: 2, bgcolor: 'grey.100' }}>
                    <ShoppingList mealPlanId={essensplan.id} />
                  </Box>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default EssensplanListe;
