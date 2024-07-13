// app/AuthProvider.tsx
'use client'
import { auth } from "@/firebase/firbaseConfig"; // Adjust path as needed
import { onAuthStateChanged, User } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { parse, serialize } from 'cookie'; // Import from 'cookie' package

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user || null);
      setLoading(false);

      // Set cookie when user signs in
      if (user) {
        user?.getIdToken().then(token => {
          document.cookie = serialize('auth_token', token, { path: '/', maxAge: 86400 }); // Example: Set cookie with user's token
        });
      } else {
        document.cookie = serialize('auth_token', '', { maxAge: -1 }); // Remove cookie when user signs out
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
