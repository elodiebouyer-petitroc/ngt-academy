import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        const userEmail = currentUser.email?.toLowerCase().trim();
        const adminEmail = "elodie.bouyer@laposte.net".toLowerCase().trim();

        console.log("[Auth Debug] Logged in as:", userEmail);
        console.log("[Auth Debug] Admin email target:", adminEmail);
        console.log("[Auth Debug] Match:", userEmail === adminEmail);
        
        if (userEmail === adminEmail) {
          console.log("[Auth Debug] ADMIN ACCESS GRANTED (Email Match)");
          setIsAdmin(true);
          setLoading(false);
        } else {
          console.log("[Auth Debug] Checking Firestore role for:", currentUser.uid);
          const userDoc = doc(db, 'users', currentUser.uid);
          const unsubDoc = onSnapshot(userDoc, (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              console.log("[Auth Debug] Firestore Data:", data);
              if (data.role === 'admin') {
                console.log("[Auth Debug] ADMIN ACCESS GRANTED (Firestore Role)");
                setIsAdmin(true);
              } else {
                setIsAdmin(false);
              }
            } else {
              console.log("[Auth Debug] No Firestore document found for user");
              setIsAdmin(false);
            }
            setLoading(false);
          }, (error) => {
            console.error("[Auth Debug] Firestore Error:", error);
            setLoading(false);
          });
          return () => unsubDoc();
        }
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return { user, isAdmin, loading, logout };
}
