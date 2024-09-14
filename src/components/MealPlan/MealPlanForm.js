import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebase';
import { collection, getDocs, addDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { TextField, Button, Grid, Typography, Paper, MenuItem, Select, FormControl, InputLabel, Card, CardContent, Divider, Box } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import MealPlanSummary from '../MealPlanSummary';
import { analytics } from '../../firebase';
import { logEvent } from "firebase/analytics";
import RecipeSelector from '../RecipeSelector';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import EditIcon from '@mui/icons-material/Edit';

const MealPlanForm = ({ editingMealPlan }) => {
  // ... (keep all the existing state and functions)

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: '800px', margin: 'auto', borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold', color: 'primary.main' }}>
        {editingMealPlan ? 'Versorgungsplan bearbeiten' : 'Versorgungsplan erstellen'}
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Name des Versorgungsplans"
              variant="outlined"
              fullWidth
              value={mealPlanName}
              onChange={(e) => setMealPlanName(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Anzahl der Personen"
              variant="outlined"
              fullWidth
              value={numPeople}
              onChange={(e) => {
                setNumPeople(e.target.value);
                validateNumPeople(e.target.value);
              }}
              onBlur={() => validateNumPeople(numPeople)}
              error={!!numPeopleError}
              helperText={numPeopleError}
              required
              type="number"
              inputProps={{ min: "1" }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Anzahl der Tage</InputLabel>
              <Select
                value={numDays}
                onChange={handleNumDaysChange}
                label="Anzahl der Tage"
              >
                {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                  <MenuItem key={day} value={day}>{day}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {Object.keys(meals).map((dayKey, index) => (
            <Grid item xs={12} key={index}>
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'secondary.main' }}>
                    {`Tag ${index + 1}`}
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  {['breakfast', 'lunch', 'dinner'].map((mealType) => (
                    <Box key={mealType} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <RestaurantIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body1" sx={{ flexGrow: 1 }}>
                        {mealType === 'breakfast' ? 'Frühstück' :
                         mealType === 'lunch' ? 'Mittagessen' : 'Abendessen'}:
                        {meals[dayKey][mealType] ? (
                          <strong>{` ${getRecipeTitleById(meals[dayKey][mealType])}`}</strong>
                        ) : (
                          ' Keine Auswahl'
                        )}
                      </Typography>
                      <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={() => handleOpenSelector(dayKey, mealType)}
                        size="small"
                      >
                        {meals[dayKey][mealType] ? 'Ändern' : 'Auswählen'}
                      </Button>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          ))}

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              type="submit"
              size="large"
              sx={{ mt: 2, py: 1.5 }}
            >
              Speichern
            </Button>
          </Grid>
        </Grid>
      </form>

      <RecipeSelector
        open={selectorOpen}
        onClose={handleCloseSelector}
        recipes={recipes}
        onSelect={handleSelectRecipe}
      />
    </Paper>
  );
};

export default MealPlanForm;