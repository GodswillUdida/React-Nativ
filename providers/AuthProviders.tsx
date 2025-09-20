import * as SecureStore from "expo-secure-store";
import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

// Define a User type for better extensibility (e.g., if decoding JWT to extract user info)
interface User {
  id?: string;
  email?: string;
  password?: string;
  token: string;
  // Add more fields as needed, e.g., id: string; email: string; etc.
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setIsLoading] = useState(true);

  // Load user on mount with error handling
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        const userData = await SecureStore.getItemAsync("user");
        if (token && userData) {
          // In a real app, decode JWT here: e.g., const decoded = jwtDecode(token);
          setUser(JSON.parse(userData)); // Extend User interface for decoded fields
        }
      } catch (error) {
        console.error("Failed to load auth token:", error);
        // Optionally, handle token invalidation or notify user
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  // Memoize login/logout for performance in case they're passed to many components
  const login = useCallback(async (token: string, user: User) => {
    try {
      await SecureStore.setItemAsync("token", token);
      await SecureStore.setItemAsync("user", JSON.stringify(user));
      // Decode if needed: const decoded = jwtDecode(token);
      setUser(user);
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Allow caller to handle
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("user");
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
      throw error; // Allow caller to handle
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
