import { useState, useEffect } from 'react';
import { db } from './firebase'; // Import the Firestore instance
import { collection, getDocs } from 'firebase/firestore'; // Firestore functions to fetch data

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);

  // Function to fetch recipes from Firestore
  useEffect(() => {
    const fetchRecipes = async () => {
      const querySnapshot = await getDocs(collection(db, 'recipes')); // Fetch all recipes from Firestore
      const recipesList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setRecipes(recipesList); // Set the fetched recipes in state
    };
    fetchRecipes();
  }, []);

  return (
    <div>
      <h2>Public Recipes</h2>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.id}>
            <h3>{recipe.title}</h3>
            <p><strong>Ingredients:</strong> {recipe.ingredients}</p>
            <p><strong>Instructions:</strong> {recipe.instructions}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecipeList;