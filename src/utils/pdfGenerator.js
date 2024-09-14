import { jsPDF } from "jspdf";
import "jspdf-autotable";

export const generateMealPlanPDF = (mealPlanData, shoppingList, recipes) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text(`Meal Plan: ${mealPlanData.name}`, 14, 15);

  // Add meal plan overview
  doc.setFontSize(16);
  doc.text("Meal Plan Overview", 14, 25);
  let yOffset = 35;
  Object.entries(mealPlanData.meals).forEach(([day, meals], index) => {
    doc.setFontSize(14);
    doc.text(`Day ${index + 1}:`, 14, yOffset);
    yOffset += 7;
    Object.entries(meals).forEach(([mealType, recipeId]) => {
      const recipe = recipes.find(r => r.id === recipeId);
      doc.setFontSize(12);
      doc.text(`${mealType.charAt(0).toUpperCase() + mealType.slice(1)}: ${recipe ? recipe.title : 'Not selected'}`, 20, yOffset);
      yOffset += 7;
    });
    yOffset += 5;
  });

  // Add shopping list
  doc.addPage();
  doc.setFontSize(16);
  doc.text("Shopping List", 14, 15);
  const shoppingListData = Object.values(shoppingList).map(item => [item.name, `${item.quantity} ${item.unit}`]);
  doc.autoTable({
    startY: 25,
    head: [["Ingredient", "Quantity"]],
    body: shoppingListData,
  });

  // Add recipes (only unique recipes)
  const uniqueRecipes = [...new Set(recipes)];
  uniqueRecipes.forEach((recipe, index) => {
    doc.addPage();
    doc.setFontSize(18);
    doc.text(recipe.title, 14, 15);

    let yOffset = 25;

    // Ingredients
    doc.setFontSize(14);
    doc.text("Ingredients:", 14, yOffset);
    yOffset += 10;
    
    // Calculate the scaling factor
    const recipeServings = recipe.servings || 1;
    const scalingFactor = mealPlanData.numPeople / recipeServings;

    recipe.ingredients.forEach(ingredient => {
      doc.setFontSize(12);
      const scaledQuantity = (parseFloat(ingredient.quantity || ingredient.menge || 0) * scalingFactor).toFixed(2);
      const ingredientText = `- ${ingredient.name}: ${scaledQuantity} ${ingredient.unit || ingredient.einheit || ''}`;
      const lines = doc.splitTextToSize(ingredientText, 180);
      doc.text(lines, 20, yOffset);
      yOffset += 7 * lines.length;
    });

    // Instructions
    yOffset += 10;
    doc.setFontSize(14);
    doc.text("Instructions:", 14, yOffset);
    yOffset += 10;
    recipe.instructions.forEach((instruction, i) => {
      doc.setFontSize(12);
      const instructionText = `${i + 1}. ${instruction}`;
      const lines = doc.splitTextToSize(instructionText, 180);
      doc.text(lines, 20, yOffset);
      yOffset += 7 * lines.length;

      // Check if we need to start a new page
      if (yOffset > 280) {
        doc.addPage();
        yOffset = 20;
      }
    });

    // Add additional recipe details if available
    if (recipe.prepTime || recipe.cookTime || recipe.servings) {
      yOffset += 10;
      doc.setFontSize(12);
      if (recipe.prepTime) {
        doc.text(`Preparation Time: ${recipe.prepTime}`, 14, yOffset);
        yOffset += 7;
      }
      if (recipe.cookTime) {
        doc.text(`Cooking Time: ${recipe.cookTime}`, 14, yOffset);
        yOffset += 7;
      }
      if (recipe.servings) {
        const scaledServings = Math.round(recipe.servings * scalingFactor);
        doc.text(`Servings: ${scaledServings} (scaled for meal plan)`, 14, yOffset);
      }
    }
  });

  return doc;
};