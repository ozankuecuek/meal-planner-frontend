import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

const JsonRecipeInput = ({ open, onClose, onSubmit }) => {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    try {
      let recipe;
      try {
        recipe = JSON.parse(jsonInput);
      } catch (parseError) {
        // If parsing fails, try evaluating as a JavaScript object
        recipe = eval(`(${jsonInput})`);
      }

      // Adjusted validation
      if (!recipe.title || !Array.isArray(recipe.ingredients) || !Array.isArray(recipe.instructions)) {
        throw new Error('Invalid recipe structure');
      }
      // Check if ingredients have the correct structure
      if (!recipe.ingredients.every(ing => ing.name && (ing.menge !== undefined) && ing.einheit)) {
        throw new Error('Invalid ingredient structure');
      }
      onSubmit(recipe);
      setError('');
    } catch (err) {
      console.error('Error parsing JSON:', err);
      setError('Invalid JSON format or recipe structure');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Provide Recipe as JSON</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          multiline
          rows={10}
          variant="outlined"
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          error={!!error}
          helperText={error}
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary">Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default JsonRecipeInput;