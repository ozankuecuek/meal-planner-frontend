import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

const MealPlanList = () => {
  const [mealPlans, setMealPlans] = useState([]);
  const [user] = useAuthState(auth); // Get the current user

  useEffect(() => {
    if (user) {
      const fetchMealPlans = async () => {
        const q = query(collection(db, 'mealplans'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const plans = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMealPlans(plans);
      };
      fetchMealPlans();
    }
  }, [user]);

  return (
    <div>
      <h2>My Meal Plans</h2>
      <ul>
        {mealPlans.map((plan) => (
          <li key={plan.id}>
            {/* Dynamically display meals for each day */}
            {Object.keys(plan.meals).map((dayKey, index) => (
              <div key={index}>
                <h4>{`Day ${index + 1}`}</h4>
                <p>Breakfast: {plan.meals[dayKey].breakfast}</p>
                <p>Lunch: {plan.meals[dayKey].lunch}</p>
                <p>Dinner: {plan.meals[dayKey].dinner}</p>
              </div>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MealPlanList;
