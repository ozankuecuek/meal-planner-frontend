import React from 'react';
import { Dialog, DialogTitle, DialogContent, Grid, Card, CardContent, CardMedia, Typography } from '@mui/material';

const RecipeSelector = ({ open, onClose, recipes, onSelect }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Select a Recipe</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {recipes.map((recipe) => (
            <Grid item xs={12} sm={6} md={4} key={recipe.id}>
              <Card 
                onClick={() => {
                  console.log('Selected recipe:', recipe.id);
                  onSelect(recipe.id);
                }} 
                style={{ cursor: 'pointer' }}
              >
                {recipe.imageUrl && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={recipe.imageUrl}
                    alt={recipe.title}
                  />
                )}
                <CardContent>
                  <Typography variant="h6">{recipe.title}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeSelector;
