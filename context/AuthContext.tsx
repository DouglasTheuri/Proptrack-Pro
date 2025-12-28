
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  name: string;
  email: string;
  picture: string;
  isGuest?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credential: string) => void;
  loginAsGuest: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('propTrackUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (credential: string) => {
    try {
      const base64Url = credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const payload = JSON.parse(jsonPayload);
      const newUser: User = {
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
        isGuest: false
      };
      
      setUser(newUser);
      localStorage.setItem('propTrackUser', JSON.stringify(newUser));
      console.log("PropTrack: User authenticated via Google:", newUser.email);
    } catch (e) {
      console.error("Failed to decode Google Credential", e);
    }
  };

  const loginAsGuest = () => {
    const guestUser: User = {
      name: 'Demo Manager',
      email: 'demo@proptrack.io',
      picture: 'https://ui-avatars.com/api/?name=Demo+Manager&background=4f46e5&color=fff',
      isGuest: true
    };
    setUser(guestUser);
    localStorage.setItem('propTrackUser', JSON.stringify(guestUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('propTrackUser');
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginAsGuest, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
