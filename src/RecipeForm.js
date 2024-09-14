import React, { useState, useEffect } from 'react';
import { db, auth, storage } from './firebase';
import { collection, addDoc, doc, updateDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuthState } from 'react-firebase-hooks/auth';
import { TextField, Button, Grid, Typography, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

const RezeptFormular = ({ editingRecipe, onSubmit }) => {
  const [titel, setTitel] = useState('');
  const [zutaten, setZutaten] = useState([{ name: '', menge: '', einheit: '' }]);
  const [anweisungen, setAnweisungen] = useState(['']);
  const [bild, setBild] = useState(null);
  const [benutzer] = useAuthState(auth);
  const [existingIngredients, setExistingIngredients] = useState([]);
  const [filteredIngredients, setFilteredIngredients] = useState([]);
  const [editingIngredientIndex, setEditingIngredientIndex] = useState(null);
  const [servings, setServings] = useState(1); // New state for servings
  const navigiere = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (editingRecipe) {
      setTitel(editingRecipe.title);
      setZutaten(editingRecipe.ingredients.map(ingredient => ({
        name: ingredient.name || '',
        menge: ingredient.menge || '',
        einheit: ingredient.einheit || ''
      })));
      setAnweisungen(editingRecipe.instructions);
      setServings(editingRecipe.servings || 1); // Set servings when editing
    }
    
    fetchExistingIngredients().then(ingredients => {
      setExistingIngredients(ingredients);
    });
  }, [editingRecipe]);

  const zutatHinzufuegen = () => {
    setZutaten([...zutaten, { name: '', menge: '', einheit: '' }]);
  };

  const zutatEntfernen = (index) => {
    const neueZutaten = zutaten.filter((_, i) => i !== index);
    setZutaten(neueZutaten);
  };

  const zutatAktualisieren = (index, feld, wert) => {
    const neueZutaten = [...zutaten];
    neueZutaten[index][feld] = wert;
    setZutaten(neueZutaten);
  };

  const anweisungHinzufuegen = () => {
    setAnweisungen([...anweisungen, '']);
  };

  const anweisungEntfernen = (index) => {
    const neueAnweisungen = anweisungen.filter((_, i) => i !== index);
    setAnweisungen(neueAnweisungen);
  };

  const anweisungAktualisieren = (index, wert) => {
    const neueAnweisungen = [...anweisungen];
    neueAnweisungen[index] = wert;
    setAnweisungen(neueAnweisungen);
  };

  const bildHochladen = (e) => {
    const datei = e.target.files[0];
    setBild(datei);
  };

  const formularAbsenden = async (e) => {
    e.preventDefault();
    if (!benutzer) {
      alert('Sie müssen angemeldet sein, um ein Rezept zu speichern');
      return;
    }

    try {
      let bildUrl = editingRecipe ? editingRecipe.imageUrl : '';
      if (bild) {
        const speicherRef = ref(storage, `rezeptBilder/${bild.name}`);
        await uploadBytes(speicherRef, bild);
        bildUrl = await getDownloadURL(speicherRef);
      }

      const rezeptDaten = {
        title: titel,
        ingredients: zutaten,
        instructions: anweisungen,
        imageUrl: bildUrl,
        userId: benutzer.uid,
        updatedAt: new Date(),
        servings: parseInt(servings, 10) // Add servings to recipe data
      };

      console.log('Recipe data to be saved:', rezeptDaten);

      if (editingRecipe) {
        await updateDoc(doc(db, 'recipes', editingRecipe.id), rezeptDaten);
      } else {
        rezeptDaten.createdAt = new Date();
        await addDoc(collection(db, 'recipes'), rezeptDaten);
      }

      alert('Rezept erfolgreich gespeichert!');
      if (onSubmit) onSubmit();
      navigiere('/rezepte');
    } catch (fehler) {
      console.error('Fehler beim Speichern des Rezepts:', fehler);
      alert(`Fehler beim Speichern des Rezepts: ${fehler.message}`);
    }
  };

  const handleIngredientChange = (index, value) => {
    zutatAktualisieren(index, 'name', value);
    setEditingIngredientIndex(index);
    if (value) {
      const filtered = existingIngredients.filter(ingredient => 
        ingredient.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredIngredients(filtered);
    } else {
      setFilteredIngredients([]);
    }
  };

  const selectIngredient = (index, value) => {
    zutatAktualisieren(index, 'name', value);
    setFilteredIngredients([]);
    setEditingIngredientIndex(null);
  };

  const addIngredient = async (index, value) => {
    if (!existingIngredients.includes(value)) {
      await addNewIngredient(value);
      setExistingIngredients([...existingIngredients, value]);
    }
    selectIngredient(index, value);
  };

  const fetchExistingIngredients = async () => {
    const recipesRef = collection(db, 'recipes');
    const snapshot = await getDocs(recipesRef);
    const ingredients = new Set();

    snapshot.forEach(doc => {
      const recipe = doc.data();
      recipe.ingredients.forEach(ingredient => {
        ingredients.add(ingredient.name);
      });
    });

    return Array.from(ingredients);
  };

  const addNewIngredient = async (ingredientName) => {
    try {
      await addDoc(collection(db, 'ingredients'), { name: ingredientName });
      console.log(`Added new ingredient: ${ingredientName}`);
    } catch (error) {
      console.error(`Error adding new ingredient ${ingredientName}:`, error);
    }
  };

  return (
    <Paper elevation={3} style={{ padding: '16px', maxWidth: '600px', margin: 'auto', marginBottom: '20px' }}>
      <Typography variant="h5" gutterBottom>
        {editingRecipe ? 'Rezept bearbeiten' : 'Neues Rezept erstellen'}
      </Typography>
      <form onSubmit={formularAbsenden}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Rezepttitel"
              variant="outlined"
              fullWidth
              value={titel}
              onChange={(e) => setTitel(e.target.value)}
              required
            />
          </Grid>
          
          {/* New input field for servings */}
          <Grid item xs={12}>
            <TextField
              label="Portionen"
              variant="outlined"
              type="number"
              fullWidth
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              required
              inputProps={{ min: "1" }}
            />
          </Grid>

          {/* Zutaten */}
          {zutaten.map((zutat, index) => (
            <Grid item xs={12} key={index}>
              <Grid container spacing={2}>
                <Grid item xs={4} style={{ position: 'relative' }}>
                  <TextField
                    label="Zutat"
                    variant="outlined"
                    fullWidth
                    value={zutat.name}
                    onChange={(e) => handleIngredientChange(index, e.target.value)}
                    onFocus={() => setEditingIngredientIndex(index)}
                    required
                  />
                  {editingIngredientIndex === index && (filteredIngredients.length > 0 || zutat.name) && (
                    <Paper 
                      style={{ 
                        position: 'absolute', 
                        zIndex: 1, 
                        width: '200%', 
                        maxHeight: 200, 
                        overflow: 'auto',
                        marginTop: '5px'
                      }}
                    >
                      {filteredIngredients.map((ingredient, i) => (
                        <MenuItem key={i} onClick={() => selectIngredient(index, ingredient)}>
                          {ingredient}
                        </MenuItem>
                      ))}
                      {zutat.name && !filteredIngredients.includes(zutat.name) && (
                        <MenuItem onClick={() => addIngredient(index, zutat.name)}>
                          <em>Füge "{zutat.name}" als neue Zutat hinzu</em>
                        </MenuItem>
                      )}
                    </Paper>
                  )}
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    label="Menge"
                    variant="outlined"
                    fullWidth
                    value={zutat.menge}
                    onChange={(e) => zutatAktualisieren(index, 'menge', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={3}>
                  <FormControl variant="outlined" fullWidth required>
                    <InputLabel>Einheit</InputLabel>
                    <Select
                      value={zutat.einheit}
                      onChange={(e) => zutatAktualisieren(index, 'einheit', e.target.value)}
                      label="Einheit"
                    >
                      <MenuItem value="Stk">Stk</MenuItem>
                      <MenuItem value="EL">EL</MenuItem>
                      <MenuItem value="TL">TL</MenuItem>
                      <MenuItem value="ml">ml</MenuItem>
                      <MenuItem value="g">g</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={2}>
                  <Button onClick={() => zutatEntfernen(index)}>Entfernen</Button>
                </Grid>
              </Grid>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button onClick={zutatHinzufuegen}>Zutat hinzufügen</Button>
          </Grid>

          {/* Anweisungen */}
          {anweisungen.map((anweisung, index) => (
            <Grid item xs={12} key={index}>
              <Grid container spacing={2}>
                <Grid item xs={10}>
                  <TextField
                    label={`Schritt ${index + 1}`}
                    variant="outlined"
                    fullWidth
                    value={anweisung}
                    onChange={(e) => anweisungAktualisieren(index, e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={2}>
                  <Button onClick={() => anweisungEntfernen(index)}>Entfernen</Button>
                </Grid>
              </Grid>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button onClick={anweisungHinzufuegen}>Schritt hinzufügen</Button>
          </Grid>

          {/* Bild hochladen */}
          <Grid item xs={12}>
            <input
              accept="image/*"
              type="file"
              onChange={bildHochladen}
            />
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Rezept speichern
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default RezeptFormular;
