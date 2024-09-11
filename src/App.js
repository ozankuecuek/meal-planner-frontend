import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import RecipeForm from './RecipeForm'; // Recipe creation and editing
import RecipeList from './RecipeList'; // Recipe list component
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';

function App() {
  const [editingRecipe, setEditingRecipe] = useState(null); // For editing recipes
  const [isRegistering, setIsRegistering] = useState(false); // Toggle between login and register
  const [user] = useAuthState(auth); // Check authentication status

  // Handle when the user clicks "Edit" on a recipe
  const handleEdit = (recipe) => {
    setEditingRecipe(recipe);
  };

  return (
    <div>
      <h1>Meal Planner App</h1>

      {/* Toggle between login and register forms */}
      {!user && (
        <div>
          {isRegistering ? (
            <>
              <Register />
              <p>
                Already have an account?{' '}
                <button onClick={() => setIsRegistering(false)}>Login</button>
              </p>
            </>
          ) : (
            <>
              <Login />
              <p>
                Don't have an account?{' '}
                <button onClick={() => setIsRegistering(true)}>Register</button>
              </p>
            </>
          )}
        </div>
      )}

      {/* Show recipe management only if the user is authenticated */}
      {user && (
        <div>
          <h2>Recipe Manager</h2>
          {/* Recipe Form to create or update a recipe */}
          <RecipeForm editingRecipe={editingRecipe} />

          {/* Recipe List with edit functionality */}
          <RecipeList onEdit={handleEdit} />

          {/* Logout button */}
          <button onClick={() => auth.signOut()}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default App;
