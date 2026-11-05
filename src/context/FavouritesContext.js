import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  collection, doc, setDoc, deleteDoc, onSnapshot, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from './AuthContext';

const FavouritesContext = createContext();

export const FavouritesProvider = ({ children }) => {
  const { user } = useAuth();
  const [favIds, setFavIds] = useState([]);

  useEffect(() => {
    if (!user) {
      setFavIds([]);
      return;
    }
    const unsub = onSnapshot(
      collection(db, 'users', user.uid, 'favourites'),
      (snap) => setFavIds(snap.docs.map((d) => d.id)),
      () => {}
    );
    return unsub;
  }, [user?.uid]);

  const isFavourite = (id) => favIds.includes(id);

  const toggleFavourite = async (id) => {
    if (!user) return;
    const ref = doc(db, 'users', user.uid, 'favourites', id);
    try {
      if (favIds.includes(id)) await deleteDoc(ref);
      else await setDoc(ref, { noticeId: id, createdAt: serverTimestamp() });
    } catch (e) {}
  };

  return (
    <FavouritesContext.Provider value={{ favIds, isFavourite, toggleFavourite }}>
      {children}
    </FavouritesContext.Provider>
  );
};

export const useFavourites = () => useContext(FavouritesContext);