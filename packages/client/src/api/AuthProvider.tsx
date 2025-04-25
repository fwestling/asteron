import { auth } from '@/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';

interface AuthContextType {
  loading: boolean;
  user?: User;
  token?: string;
}

const AuthContext = createContext<AuthContextType>({
  loading: true,
  user: undefined,
  token: undefined,
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | undefined>();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      console.log('AuthState has changed', user);
      if (user) {
        setUser(user);
        user
          .getIdToken()
          .then((token) => {
            localStorage.setItem('authToken', token);
            setToken(token);
            setLoading(false);
          })
          .catch((error) => {
            console.error('Error getting token', error);
            setLoading(false);
          });
      } else {
        setUser(undefined);
        setLoading(false);
      }
    });
  }, []);

  const [token, setToken] = useState<string | undefined>(
    localStorage.getItem('authToken') ?? undefined,
  ); // Initialize with an empty string or your default token

  return (
    <AuthContext.Provider value={{ token, loading, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthToken = () => {
  const { token, loading } = useContext(AuthContext);
  return { token, loading };
};

export const useAuthUser = () => {
  const { user, loading } = useContext(AuthContext);
  return { user, loading };
};
