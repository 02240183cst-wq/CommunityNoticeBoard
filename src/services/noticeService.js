import {
  collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot,
  query, orderBy, serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

const noticesCol = collection(db, 'notices');

export const subscribeNotices = (callback, onError) =>
  onSnapshot(
    query(noticesCol, orderBy('createdAt', 'desc')),
    (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    onError
  );

export const subscribeNotice = (id, callback, onError) =>
  onSnapshot(
    doc(db, 'notices', id),
    (snap) => callback(snap.exists() ? { id: snap.id, ...snap.data() } : null),
    onError
  );

export const addNotice = (data) =>
  addDoc(noticesCol, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

export const updateNotice = (id, data) =>
  updateDoc(doc(db, 'notices', id), { ...data, updatedAt: serverTimestamp() });

export const deleteNotice = (id) => deleteDoc(doc(db, 'notices', id));