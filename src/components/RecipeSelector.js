import React from 'react';
import { Dialog, DialogTitle, DialogContent, Grid, Card, CardContent, CardMedia, Typography, Box, Button } from '@mui/material';
import NoMealIcon from '@mui/icons-material/NoMeals';

const RezeptAuswahl = ({ open, onClose, recipes, onSelect }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.5rem', mb: 2 }}>
        Wählen Sie ein Rezept
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Card 
              onClick={() => {
                console.log('Keine Auswahl');
                onSelect(null);
              }} 
              sx={{
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'scale(1.03)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <CardContent>
                <NoMealIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center', mt: 2 }}>
                  Keine Auswahl
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          {recipes.map((rezept) => (
            <Grid item xs={12} sm={6} md={4} key={rezept.id}>
              <Card 
                onClick={() => {
                  console.log('Ausgewähltes Rezept:', rezept.id);
                  onSelect(rezept.id);
                }} 
                sx={{
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'scale(1.03)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                  },
                }}
              >
                <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
                  {rezept.imageUrl && (
                    <CardMedia
                      component="img"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                      image={rezept.imageUrl}
                      alt={rezept.title}
                    />
                  )}
                </Box>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                    {rezept.title}
                  </Typography>
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
