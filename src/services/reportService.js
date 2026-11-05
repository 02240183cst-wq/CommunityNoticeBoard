import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export const reportReasons = [
  'Spam',
  'Incorrect information',
  'Inappropriate content',
  'Duplicate notice',
  'Other',
];

export const addReport = ({ noticeId, noticeTitle, reason, reporterId }) =>
  addDoc(collection(db, 'reports'), {
    noticeId,
    noticeTitle,
    reason,
    reporterId,
    status: 'pending',
    createdAt: serverTimestamp(),
  });