import React from 'react';
import RecipeForm from './RecipeForm'; // The form component from Step 2.2
import RecipeList from './RecipeList'; // The list component we just created

function App() {
  return (
    <div>
      <h1>Recipe Manager</h1>
      {/* Recipe Form to create new recipes */}
      <RecipeForm />
      
      {/* Recipe List to display public recipes */}
      <RecipeList />
    </div>
  );
}

export default App;
