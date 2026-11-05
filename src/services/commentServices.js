import {
  collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

export const subscribeComments = (noticeId, callback, onError) =>
  onSnapshot(
    query(collection(db, 'notices', noticeId, 'comments'), orderBy('createdAt', 'asc')),
    (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    onError
  );

export const addComment = (noticeId, { text, authorId, authorName }) =>
  addDoc(collection(db, 'notices', noticeId, 'comments'), {
    text,
    authorId,
    authorName,
    createdAt: serverTimestamp(),
  });

export const deleteComment = (noticeId, commentId) =>
  deleteDoc(doc(db, 'notices', noticeId, 'comments', commentId));