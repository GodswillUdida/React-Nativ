import * as SecureStore from "expo-secure-store";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import * as LocalAuthentication from "expo-local-authentication";
// import { AppState, AppStateStatus } from "react-native";

// Define User interface for type safety and extensibility (e.g., for JWT claims or additional profile data)
interface User {
  id?: string;
  name?: string;
  email?: string;
  password?: string; // Avoid storing passwords; use for temp input only in real apps
  token: string;
  avatar?: string;
  businessName?:string;
  refreshToken?: string; // Uncomment for token refresh flows
}

// Auth context type: Comprehensive for enterprise needs, including biometrics and loading state
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (token: string, user: Omit<User, "token">) => Promise<void>; // Omit token from input for security
  logout: () => Promise<void>;
  isBiometricsEnabled: boolean;
  isBiometricsSupported: boolean; // Added for UX checks
  enableBiometrics: () => Promise<boolean>; // Explicit enable function
  tryBiometricLogin: () => Promise<boolean>; // Returns success for caller handling
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBiometricsEnabled, setIsBiometricsEnabled] = useState(false);
  const [isBiometricsSupported, setIsBiometricsSupported] = useState(false);

  // Init: Check biometrics support and load stored data on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check biometric hardware and enrollment
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        setIsBiometricsSupported(hasHardware);

        // Load stored data
        const token = await SecureStore.getItemAsync("token");
        const userData = await SecureStore.getItemAsync("user");
        const biometricsEnabled =
          await SecureStore.getItemAsync("biometricsEnabled");

        setIsBiometricsEnabled(biometricsEnabled === "true");

        if (token && userData) {
          const parsedUser: Omit<User, "token"> = JSON.parse(userData);
          setUser({ ...parsedUser, token });
          // In prod: Validate token expiry via decode or API
        }
      } catch (err) {
        console.error("Auth initialization failed:", err);
        setError("Failed to initialize authentication.");
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []); // Mount-only

  // Memoized login: Stores token/user securely, clears error
  const login = useCallback(
    async (token: string, userData: Omit<User, "token">) => {
      try {
        await SecureStore.setItemAsync("token", token);
        await SecureStore.setItemAsync("user", JSON.stringify(userData));
        setUser({ ...userData, token });
        setError(null);
      } catch (err) {
        console.error("Login failed:", err);
        setError("Login operation failed. Please try again.");
        throw err; // Allow caller to handle (e.g., UI feedback)
      }
    },
    []
  );

  // Memoized logout: Clears storage, resets state
  const logout = useCallback(async () => {
    try {
      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("user");
      await SecureStore.deleteItemAsync("biometricsEnabled");
      setUser(null);
      setIsBiometricsEnabled(false);
      setError(null);
    } catch (err) {
      console.error("Logout failed:", err);
      setError("Logout operation failed. Please try again.");
      throw err;
    }
  }, []);

  // Enable biometrics: Authenticates and sets flag
  const enableBiometrics = useCallback(async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Enable biometrics for quick login",
        cancelLabel: "Cancel",
        fallbackLabel: "Use passcode",
      });
      if (result.success) {
        await SecureStore.setItemAsync("biometricsEnabled", "true");
        setIsBiometricsEnabled(true);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Biometrics enable failed:", err);
      setError("Failed to enable biometrics.");
      return false;
    }
  }, []);

  // Try biometric login: Verifies and loads user if success
  const tryBiometricLogin = useCallback(async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Login with biometrics",
        cancelLabel: "Cancel",
        fallbackLabel: "Use passcode",
      });
      if (result.success) {
        const token = await SecureStore.getItemAsync("token");
        const userData = await SecureStore.getItemAsync("user");
        if (token && userData) {
          const parsedUser: Omit<User, "token"> = JSON.parse(userData);
          setUser({ ...parsedUser, token });
          return true;
        }
      }
      return false;
    } catch (err) {
      console.error("Biometric login failed:", err);
      setError("Biometric authentication failed.");
      return false;
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        isBiometricsEnabled,
        isBiometricsSupported,
        enableBiometrics,
        tryBiometricLogin,
      }}
    >
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

// Utility functions: Exported for modularity (e.g., use in other modules)
export async function saveToStorage(key: string, value: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (err) {
    console.error(`Failed to save ${key}:`, err);
    throw err;
  }
}

export async function getFromStorage(key: string): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (err) {
    console.error(`Failed to get ${key}:`, err);
    return null;
  }
}