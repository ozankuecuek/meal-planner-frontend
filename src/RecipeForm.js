import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

const RecipeForm = ({ editingRecipe }) => {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [user] = useAuthState(auth); // Get current user
  const [isEditing, setIsEditing] = useState(false);
  const [currentRecipeId, setCurrentRecipeId] = useState(null);

  useEffect(() => {
    if (editingRecipe) {
      setTitle(editingRecipe.title);
      setIngredients(editingRecipe.ingredients);
      setInstructions(editingRecipe.instructions);
      setIsPublic(editingRecipe.public);
      setIsEditing(true);
      setCurrentRecipeId(editingRecipe.id);
    }
  }, [editingRecipe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEditing && currentRecipeId) {
      const recipeRef = doc(db, 'recipes', currentRecipeId);
      await updateDoc(recipeRef, {
        title,
        ingredients,
        instructions,
        public: isPublic,
      });
      alert('Recipe updated successfully!');
    } else {
      // Add new recipe with user ID (authorId)
      await addDoc(collection(db, 'recipes'), {
        title,
        ingredients,
        instructions,
        public: isPublic,
        authorId: user.uid, // Store the creator's UID (user ID)
      });
      alert('Recipe added successfully!');
    }

    setTitle('');
    setIngredients('');
    setInstructions('');
    setIsPublic(false);
    setIsEditing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Recipe Title"
        required
      />
      <textarea
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        placeholder="Ingredients (comma-separated)"
        required
      />
      <textarea
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
        placeholder="Instructions"
        required
      />
      <label>
        Public:
        <input
          type="checkbox"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
        />
      </label>
      <button type="submit">{isEditing ? 'Update Recipe' : 'Add Recipe'}</button>
    </form>
  );
};

export default RecipeForm;
