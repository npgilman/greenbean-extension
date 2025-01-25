import { getDocs, collection } from 'firebase/firestore';
import { db } from './firebaseConfig.js';

export async function getDataFromFirestore() {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  } catch (e) {
    console.error("Error getting documents: ", e);
  }
}
