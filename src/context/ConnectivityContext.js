import React, { createContext, useContext, useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

const ConnectivityContext = createContext({ isOnline: true });

export const ConnectivityProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsub = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected !== false && state.isInternetReachable !== false);
    });
    return unsub;
  }, []);

  return (
    <ConnectivityContext.Provider value={{ isOnline }}>
      {children}
    </ConnectivityContext.Provider>
  );
};

export const useConnectivity = () => useContext(ConnectivityContext);