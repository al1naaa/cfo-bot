import { db } from "../config/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy
} from "firebase/firestore";

export async function saveSession(inputs, result) {
  await addDoc(collection(db, "sessions"), {
    inputs,
    result,
    createdAt: Date.now()
  });
}

export async function loadSessions() {
  const q = query(
    collection(db, "sessions"),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}