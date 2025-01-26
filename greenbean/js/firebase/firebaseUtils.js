import { getDocs, collection, query, where, doc, setDoc, documentId } from "firebase/firestore";
import { db } from './firebaseConfig.js';


export async function getUserData(userId) {
  try {
    const q = query(collection(db, 'users'), where(documentId(), "==", userId));
    return await getDocs(q);
  } catch (e) {
    console.error("Error getting documents: ", e);
  }
}


export async function enrollUser(userId, name) {
  await setDoc(doc(db, "users", userId), {
    userName: name,
    dateJoined: new Date(),
    queryCounter: 0,
    queryTimes: []
  });
}
