import React, { useState, useEffect, useCallback } from 'react';
import { db } from './firebase'; // Import Firestore
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Paper, Typography, List, ListItem, ListItemText } from '@mui/material';

const ShoppingList = ({ mealPlanId }) => {
  const [shoppingList, setShoppingList] = useState(null);

  // Fetch the shopping list from Firestore based on the meal plan ID
  const fetchShoppingList = useCallback(async () => {
    try {
      const q = query(collection(db, 'shoppinglists'), where('mealPlanId', '==', mealPlanId));
      const querySnapshot = await getDocs(q);
      const fetchedShoppingList = querySnapshot.docs.map((doc) => doc.data())[0]; // Only one shopping list per meal plan
      setShoppingList(fetchedShoppingList?.shoppingList || {});
    } catch (error) {
      console.error('Error fetching shopping list:', error);
    }
  }, [mealPlanId]);

  // Fetch shopping list when component mounts
  useEffect(() => {
    if (mealPlanId) {
      fetchShoppingList();
    }
  }, [mealPlanId, fetchShoppingList]);

  return (
    <Paper elevation={3} style={{ padding: '16px', marginTop: '16px' }}>
      <Typography variant="h6" gutterBottom>
        Shopping List
      </Typography>
      {shoppingList ? (
        <List>
          {Object.keys(shoppingList).map((key) => {
            const item = shoppingList[key];
            return (
              <ListItem key={key}>
                <ListItemText primary={`${item.name}: ${item.quantity} ${item.unit}`} />
              </ListItem>
            );
          })}
        </List>
      ) : (
        <Typography variant="body2" color="textSecondary">
          No shopping list available for this meal plan.
        </Typography>
      )}
    </Paper>
  );
};

export default ShoppingList;
