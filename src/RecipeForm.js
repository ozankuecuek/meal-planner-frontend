import { useState } from 'react';
import { db } from './firebase'; // import Firestore
import { collection, addDoc } from 'firebase/firestore';

const RecipeForm = () => {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, 'recipes'), {
        title,
        ingredients,
        instructions,
        public: isPublic,
      });
      alert('Recipe added successfully!');
    } catch (error) {
      alert('Failed to add recipe');
    }
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
      <button type="submit">Add Recipe</button>
    </form>
  );
};

export default RecipeForm;
