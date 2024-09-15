import React, { useState } from 'react';
import { 
  Typography, 
  Paper, 
  Box, 
  IconButton, 
  Tooltip, 
  List, 
  ListItem, 
  ListItemText,
  Collapse,
  Divider,
  CircularProgress
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import RestaurantIcon from '@mui/icons-material/Restaurant';

const MealPlanSummary = ({ mealPlanId, mealPlanData, shoppingList, recipes, handleDownload }) => {
  const [expanded, setExpanded] = useState(false);
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getRecipeTitleById = (id) => {
    if (!Array.isArray(recipes)) {
      console.error('recipes is not an array:', recipes);
      return 'Nicht ausgewählt';
    }
    const recipe = recipes.find(r => r.id === id);
    return recipe ? recipe.title : 'Nicht ausgewählt';
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const toggleShoppingList = () => {
    setShowShoppingList(!showShoppingList);
  };

  const onDownloadClick = async () => {
    if (typeof handleDownload === 'function') {
      setIsLoading(true);
      try {
        await handleDownload(mealPlanData);
      } catch (error) {
        console.error("Error downloading PDF:", error);
        alert("Error generating PDF. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      console.error("handleDownload is not a function");
      alert("Unable to download PDF at this time. Please try again later.");
    }
  };

  return (
    <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {mealPlanData.name || `Versorgungsplan ${mealPlanId}`}
          </Typography>
          <Box>
            <Tooltip title="Einkaufsliste">
              <IconButton size="small" color="inherit" onClick={toggleShoppingList}>
                <ShoppingCartIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="PDF herunterladen">
              <IconButton 
                size="small" 
                color="inherit" 
                onClick={onDownloadClick}
                disabled={isLoading || Object.keys(recipes).length === 0}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : <PictureAsPdfIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title={expanded ? "Zuklappen" : "Aufklappen"}>
              <IconButton size="small" color="inherit" onClick={toggleExpanded}>
                {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>
      <Collapse in={expanded}>
        <Box sx={{ p: 2 }}>
          {mealPlanData.meals && Object.entries(mealPlanData.meals).map(([dayKey, meals], index) => (
            <Box key={dayKey} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Tag {index + 1}
              </Typography>
              <List dense>
                {['breakfast', 'lunch', 'dinner'].map((mealType) => (
                  <ListItem key={mealType} sx={{ py: 0 }}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <RestaurantIcon sx={{ mr: 1, fontSize: 'small', color: 'primary.main' }} />
                          <Typography variant="body2">
                            {mealType === 'breakfast' ? 'Frühstück' :
                             mealType === 'lunch' ? 'Mittagessen' : 'Abendessen'}
                          </Typography>
                        </Box>
                      }
                      secondary={getRecipeTitleById(meals[mealType])}
                    />
                  </ListItem>
                ))}
              </List>
              {index < Object.entries(mealPlanData.meals).length - 1 && <Divider />}
            </Box>
          ))}
        </Box>
      </Collapse>
      <Collapse in={showShoppingList}>
        <Box sx={{ p: 2, bgcolor: 'grey.100' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Einkaufsliste</Typography>
          <List dense>
            {Object.entries(shoppingList).map(([itemId, item]) => (
              <ListItem key={itemId}>
                <ListItemText
                  primary={item.name}
                  secondary={`${item.quantity} ${item.unit}`}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default MealPlanSummary;
