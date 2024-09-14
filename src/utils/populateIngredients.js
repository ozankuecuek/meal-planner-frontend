import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';

const germanIngredients = [
  'Äpfel', 'Bananen', 'Karotten', 'Kartoffeln', 'Zwiebeln', 'Tomaten', 'Gurken', 'Salat', 'Paprika',
  'Brokkoli', 'Blumenkohl', 'Zucchini', 'Aubergine', 'Pilze', 'Spinat', 'Knoblauch', 'Ingwer',
  'Rinderhackfleisch', 'Schweinefleisch', 'Hühnerbrust', 'Putenbrust', 'Lachs', 'Thunfisch', 'Forelle',
  'Eier', 'Milch', 'Joghurt', 'Quark', 'Sahne', 'Butter', 'Käse', 'Gouda', 'Emmentaler', 'Mozzarella',
  'Brot', 'Brötchen', 'Vollkornbrot', 'Toastbrot', 'Nudeln', 'Spaghetti', 'Reis', 'Quinoa', 'Haferflocken',
  'Mehl', 'Zucker', 'Salz', 'Pfeffer', 'Olivenöl', 'Sonnenblumenöl', 'Essig', 'Senf', 'Ketchup', 'Mayonnaise',
  'Schokolade', 'Kekse', 'Chips', 'Nüsse', 'Mandeln', 'Rosinen', 'Honig', 'Marmelade',
  'Kaffee', 'Tee', 'Orangensaft', 'Apfelsaft', 'Mineralwasser', 'Limonade',
  'Waschmittel', 'Spülmittel', 'Toilettenpapier', 'Zahnpasta', 'Shampoo', 'Seife'
];

export const populateIngredients = async () => {
  try {
    for (const ingredient of germanIngredients) {
      const q = query(collection(db, 'ingredients'), where('name', '==', ingredient));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        try {
          await addDoc(collection(db, 'ingredients'), { name: ingredient });
          console.log(`Added: ${ingredient}`);
        } catch (error) {
          console.error(`Error adding ${ingredient}:`, error);
        }
      }
    }
    console.log('Ingredient population complete');
  } catch (error) {
    console.error('Error populating ingredients:', error);
  }
};