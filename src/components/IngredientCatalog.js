import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, TextField, Button } from '@mui/material';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const IngredientCatalog = ({ open, onClose, onSelect }) => {
  const [ingredients, setIngredients] = useState([]);
  const [filteredIngredients, setFilteredIngredients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const ingredientsSnapshot = await getDocs(collection(db, 'ingredients'));
        const allIngredients = ingredientsSnapshot.docs.map(doc => doc.data().name);
        setIngredients(allIngredients.sort());
      } catch (error) {
        console.error('Error fetching ingredients:', error);
        // Handle the error appropriately (e.g., show an error message to the user)
      }
    };
    fetchIngredients();
  }, []);

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    if (searchTerm.length >= 3) {
      setFilteredIngredients(
        ingredients.filter(ingredient => ingredient.toLowerCase().includes(searchTerm))
      );
    } else {
      setFilteredIngredients([]);
    }
  };

  const handleAddNewIngredient = async () => {
    if (searchTerm.trim() !== '') {
      try {
        await addDoc(collection(db, 'ingredients'), { name: searchTerm.trim() });
        onSelect(searchTerm.trim());
      } catch (error) {
        console.error('Error adding new ingredient:', error);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Zutat auswählen</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Zutat suchen"
          type="text"
          fullWidth
          value={searchTerm}
          onChange={handleSearch}
        />
        {searchTerm.length >= 3 && (
          <List>
            {filteredIngredients.map((ingredient, index) => (
              <ListItem button key={index} onClick={() => onSelect(ingredient)}>
                <ListItemText primary={ingredient} />
              </ListItem>
            ))}
          </List>
        )}
        {searchTerm.length >= 3 && filteredIngredients.length === 0 && (
          <Button onClick={handleAddNewIngredient}>Neue Zutat hinzufügen: {searchTerm}</Button>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default IngredientCatalog;
