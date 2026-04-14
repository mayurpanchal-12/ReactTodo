import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, deleteUser , reauthenticateWithPopup } from 'firebase/auth';
import { auth , googleProvider} from '../firebase';



// Add account-picker so users can switch Google accounts
googleProvider.setCustomParameters({ prompt: 'select_account' });

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ?? null);
    });
    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const deleteAccount = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('No user is currently signed in.');

    setIsDeleting(true);
    try {
      await deleteUser(currentUser);
      // user state will auto-update to null via onAuthStateChanged
    } catch (err) {
     if (err.code === 'auth/requires-recent-login') {
       try {
         await reauthenticateWithPopup(currentUser, googleProvider);
         await deleteUser(currentUser);
         // success — onAuthStateChanged auto-sets user to null
       } catch (reAuthErr) {
         setIsDeleting(false);
         throw reAuthErr;
      }
    } else {
       setIsDeleting(false);
     throw err;
   }
  }
  };

  return (
    <AuthContext.Provider value={{ user, logout, deleteAccount, isDeleting }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}