// MealPlanSummary.js
import React from 'react';
import { Typography, Paper, Grid, Box, Divider, List, ListItem, ListItemText, Container } from '@mui/material';
import { styled } from '@mui/system';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
}));

const ItemCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  height: '100%',
}));

const MealPlanSummary = ({ mealPlanId, mealPlanData, shoppingList, recipes }) => {
  // Helper function to get recipe title by ID
  const getRecipeTitleById = (id) => {
    const recipe = recipes.find((r) => r.id === id);
    return recipe ? recipe.title : 'No selection';
  };

  return (
    <Container maxWidth="xl">
      <StyledPaper elevation={3}>
        <Typography variant="h4" gutterBottom>{mealPlanData.name}</Typography>
        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" gutterBottom>Meal Plan</Typography>
        <List>
          {Object.keys(mealPlanData.meals).map((dayKey, index) => {
            const dayMeals = mealPlanData.meals[dayKey];
            return (
              <ListItem key={index}>
                <ListItemText
                  primary={`Day ${index + 1}`}
                  secondary={
                    <>
                      <Typography component="span" variant="body2" display="block">
                        Breakfast: {getRecipeTitleById(dayMeals.breakfast)}
                      </Typography>
                      <Typography component="span" variant="body2" display="block">
                        Lunch: {getRecipeTitleById(dayMeals.lunch)}
                      </Typography>
                      <Typography component="span" variant="body2" display="block">
                        Dinner: {getRecipeTitleById(dayMeals.dinner)}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            );
          })}
        </List>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" gutterBottom>Shopping List</Typography>
        <List>
          {Object.values(shoppingList).map((item, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={item.name}
                secondary={`${item.quantity} ${item.unit}`}
              />
            </ListItem>
          ))}
        </List>
      </StyledPaper>
    </Container>
  );
};

export default MealPlanSummary;
