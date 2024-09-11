import React, { useState } from 'react';
import { db, auth } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

const MealPlanForm = () => {
  const [numDays, setNumDays] = useState(1); // Number of days in the meal plan
  const [meals, setMeals] = useState({});
  const [user] = useAuthState(auth);

  // Initialize meal plan structure dynamically based on the number of days
  const initializeMeals = (days) => {
    const newMeals = {};
    for (let i = 1; i <= days; i++) {
      newMeals[`day${i}`] = { breakfast: '', lunch: '', dinner: '' };
    }
    setMeals(newMeals);
  };

  // Handle the number of days change
  const handleNumDaysChange = (e) => {
    const days = parseInt(e.target.value, 10);
    setNumDays(days);
    initializeMeals(days); // Reinitialize the meals structure based on the new number of days
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, 'mealplans'), {
        userId: user.uid,
        meals,
      });
      alert('Meal plan added successfully!');
      // Reset form fields
      setNumDays(1);
      setMeals({});
    } catch (error) {
      alert('Failed to create meal plan');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create a Meal Plan</h2>
      <label>
        Number of Days:
        <input
          type="number"
          value={numDays}
          onChange={handleNumDaysChange}
          min="1"
          required
        />
      </label>

      {/* Dynamically generate meal inputs for each day */}
      {Object.keys(meals).map((dayKey, index) => (
        <div key={index}>
          <h3>{`Day ${index + 1}`}</h3>
          <label>
            Breakfast:
            <input
              type="text"
              value={meals[dayKey].breakfast}
              onChange={(e) =>
                setMeals({ ...meals, [dayKey]: { ...meals[dayKey], breakfast: e.target.value } })
              }
            />
          </label>
          <label>
            Lunch:
            <input
              type="text"
              value={meals[dayKey].lunch}
              onChange={(e) =>
                setMeals({ ...meals, [dayKey]: { ...meals[dayKey], lunch: e.target.value } })
              }
            />
          </label>
          <label>
            Dinner:
            <input
              type="text"
              value={meals[dayKey].dinner}
              onChange={(e) =>
                setMeals({ ...meals, [dayKey]: { ...meals[dayKey], dinner: e.target.value } })
              }
            />
          </label>
        </div>
      ))}

      <button type="submit">Save Meal Plan</button>
    </form>
  );
};

export default MealPlanForm;
