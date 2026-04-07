import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@groovebox_user_display_name';

type UserContextType = {
  /** Full name as stored (e.g. from sign-up). */
  displayName: string;
  setDisplayName: (name: string) => Promise<void>;
  /** First word of `displayName`, for “Hey {firstName}”. */
  firstName: string;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [displayName, setDisplayNameState] = useState('');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(v => {
      if (v) setDisplayNameState(v);
    });
  }, []);

  const setDisplayName = useCallback(async (name: string) => {
    const trimmed = name.trim();
    setDisplayNameState(trimmed);
    if (trimmed) await AsyncStorage.setItem(STORAGE_KEY, trimmed);
    else await AsyncStorage.removeItem(STORAGE_KEY);
  }, []);

  const firstName = useMemo(() => {
    const n = displayName.trim();
    if (!n) return '';
    return n.split(/\s+/)[0];
  }, [displayName]);

  const value = useMemo(
    () => ({ displayName, setDisplayName, firstName }),
    [displayName, setDisplayName, firstName],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser(): UserContextType {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error('useUser must be used within UserProvider');
  }
  return ctx;
}
