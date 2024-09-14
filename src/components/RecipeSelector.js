import React from 'react';
import { Dialog, DialogTitle, DialogContent, Grid, Card, CardContent, CardMedia, Typography } from '@mui/material';

const RezeptAuswahl = ({ open, onClose, recipes, onSelect }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Wählen Sie ein Rezept</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {recipes.map((rezept) => (
            <Grid item xs={12} sm={6} md={4} key={rezept.id}>
              <Card 
                onClick={() => {
                  console.log('Ausgewähltes Rezept:', rezept.id);
                  onSelect(rezept.id);
                }} 
                style={{ cursor: 'pointer' }}
              >
                {rezept.imageUrl && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={rezept.imageUrl}
                    alt={rezept.title}
                  />
                )}
                <CardContent>
                  <Typography variant="h6">{rezept.title}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default RezeptAuswahl;
