import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const fetchExistingIngredients = async () => {
  const recipesRef = collection(db, 'recipes');
  const snapshot = await getDocs(recipesRef);
  const ingredients = new Set();

  snapshot.forEach(doc => {
    const recipe = doc.data();
    recipe.ingredients.forEach(ingredient => {
      ingredients.add(ingredient.name);
    });
  });

  return Array.from(ingredients);
};

export const addNewIngredient = async (ingredientName) => {
  try {
    await addDoc(collection(db, 'ingredients'), { name: ingredientName });
    console.log(`Added new ingredient: ${ingredientName}`);
  } catch (error) {
    console.error(`Error adding new ingredient ${ingredientName}:`, error);
  }
};