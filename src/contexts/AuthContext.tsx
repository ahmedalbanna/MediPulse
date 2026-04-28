import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, getUsers } from '../services/userService';

interface AuthContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  switchRole: (role: UserRole) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch to set a default user
    getUsers().then(users => {
      const admin = users.find(u => u.role === 'Admin') || users[0];
      setCurrentUser(admin);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const switchRole = async (role: UserRole) => {
    setLoading(true);
    try {
      const users = await getUsers();
      const user = users.find(u => u.role === role);
      if (user) {
        setCurrentUser(user);
      } else {
        // If role doesn't exist, mock it temporarily
        setCurrentUser({
          id: 'MOCK',
          name: `Mock ${role}`,
          email: `${role.toLowerCase()}@mediflow.com`,
          role,
          department: 'General',
          status: 'Active',
          permissions: [],
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, switchRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
