import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

const RecipeList = ({ onEdit }) => {
  const [recipes, setRecipes] = useState([]);
  const [user] = useAuthState(auth); // Get current user

  // Fetch recipes from Firestore
  useEffect(() => {
    const fetchRecipes = async () => {
      const querySnapshot = await getDocs(collection(db, 'recipes'));
      const recipesList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecipes(recipesList);
    };
    fetchRecipes();
  }, []);

  // Function to delete a recipe
  const handleDelete = async (recipeId) => {
    await deleteDoc(doc(db, 'recipes', recipeId));
    alert('Recipe deleted successfully!');
    setRecipes(recipes.filter((recipe) => recipe.id !== recipeId)); // Update state to remove deleted recipe
  };

  return (
    <div>
      <h2>Public Recipes</h2>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.id}>
            <h3>{recipe.title}</h3>
            <p><strong>Ingredients:</strong> {recipe.ingredients}</p>
            <p><strong>Instructions:</strong> {recipe.instructions}</p>

            {/* Only show the edit button if the user is the owner */}
            {user && user.uid === recipe.authorId && (
              <button onClick={() => onEdit(recipe)}>Edit</button>
            )}

            {/* Only show the delete button if the user is the owner */}
            {user && user.uid === recipe.authorId && (
              <button onClick={() => handleDelete(recipe.id)}>Delete</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecipeList;
