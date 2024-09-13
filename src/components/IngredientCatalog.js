import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, TextField, Button } from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const IngredientCatalog = ({ open, onClose, onSelect }) => {
  const [ingredients, setIngredients] = useState([]);
  const [filteredIngredients, setFilteredIngredients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchIngredients = async () => {
      const recipesSnapshot = await getDocs(collection(db, 'recipes'));
      const allIngredients = new Set();
      recipesSnapshot.forEach(doc => {
        const recipeData = doc.data();
        recipeData.ingredients.forEach(ingredient => {
          allIngredients.add(ingredient.name);
        });
      });
      setIngredients(Array.from(allIngredients).sort());
      setFilteredIngredients(Array.from(allIngredients).sort());
    };
    fetchIngredients();
  }, []);

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    setFilteredIngredients(
      ingredients.filter(ingredient => ingredient.toLowerCase().includes(searchTerm))
    );
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Select an Ingredient</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Search ingredients"
          type="text"
          fullWidth
          value={searchTerm}
          onChange={handleSearch}
        />
        <List>
          {filteredIngredients.map((ingredient, index) => (
            <ListItem button key={index} onClick={() => onSelect(ingredient)}>
              <ListItemText primary={ingredient} />
            </ListItem>
          ))}
        </List>
        <Button onClick={() => onSelect(searchTerm)}>Add New Ingredient</Button>
      </DialogContent>
    </Dialog>
  );
};

export default IngredientCatalog;
