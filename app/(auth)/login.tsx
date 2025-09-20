import { useAuth } from "@/providers/AuthProviders";
import { Ionicons } from "@expo/vector-icons";
import * as LocalAuthentication from "expo-local-authentication"; // For biometrics (Face ID/Touch ID)
import { Link, router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

// Modern enhancements: Added biometrics for seamless, secure login (primary if supported)
// Design: Minimalist with soft rounded edges, clean spacing, and accessible inputs per 2025 trends

export default function LoginScreen() {
  const { user,login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [isBiometricEnrolled, setIsBiometricEnrolled] = useState(false);

  // Check biometric hardware and enrollment on mount
  useEffect(() => {
    (async () => {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(hasHardware);
      if (hasHardware) {
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        setIsBiometricEnrolled(enrolled);
      }
    })();
  }, []);

  // Memoized biometric handler: Authenticate then auto-login (simulate; in real: retrieve stored creds/token)
  const handleBiometricLogin = useCallback(async () => {
    if (!isBiometricEnrolled) {
      setError("No biometrics enrolled on this device");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to login",
        cancelLabel: "Cancel",
        fallbackLabel: "Use password instead",
        disableDeviceFallback: false, // Allow fallback to device passcode
      });
      if (result.success) {
        // In production: Retrieve encrypted credentials or token from SecureStore
        // Here: Simulate successful login
        const fakeToken = "fake-jwt-token";
        const fakeUser = {
          id: "1",
          email: "",
          token: fakeToken,
        };
        await login("fake-jwt-token", fakeUser);
        router.replace("/(tabs)/home");
      } else {
        setError("Biometric authentication failed. Try again or use password.");
      }
    } catch (err) {
      console.error("Biometrics error:", err);
      setError("An error occurred with biometrics. Please use password login.");
    } finally {
      setLoading(false);
    }
  }, [isBiometricEnrolled, login]);

  // Memoized password handler (as before, with validations)
  const handlePasswordLogin = useCallback(async () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email format");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const fakeToken = "fake-jwt-token";
      const fakeUser = {
        id: "1",
        email: "",
        token: fakeToken,
      };
      await login("fake-jwt-token", fakeUser); // Simulate; replace with real API
      router.replace("/(tabs)/home");
    } catch (err) {
      console.error("Login failed", err);
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [email, password, login]);

  return (
    <View className="flex-1 justify-center px-6 bg-white">
      <Text className="text-3xl font-bold mb-8 text-center text-gray-800">
        Welcome Back {user?.email ? `, ${user.email}` : ""}!
      </Text>{" "}
      {/* Modern: Friendlier title */}
      {error && <Text className="text-red-500 mb-4 text-center">{error}</Text>}
      {/* Biometrics button: Prominent if supported/enrolled, for quick access */}
      {isBiometricSupported && isBiometricEnrolled && (
        <Pressable
          onPress={handleBiometricLogin}
          className={`mb-6 p-4 rounded-lg bg-green-500 ${loading ? "opacity-50" : ""}`}
          disabled={loading}
          accessibilityRole="button"
          accessibilityLabel="Login with biometrics"
        >
          <Text className="text-white text-center font-semibold">
            <Ionicons name="finger-print" size={20} color="white" />
            {loading ? "Authenticating..." : "Login with Biometrics"}
          </Text>
        </Pressable>
      )}
      {/* Inputs: Soft rounded, subtle borders, modern keyboard optimizations */}
      <TextInput
        className="border border-gray-300 p-4 rounded-lg mb-4 bg-gray-50"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        accessibilityLabel="Email input"
      />
      <TextInput
        className="border border-gray-300 p-4 rounded-lg mb-6 bg-gray-50"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        accessibilityLabel="Password input"
      />
      <Pressable
        onPress={handlePasswordLogin}
        className={`p-4 rounded-lg ${loading ? "bg-gray-400" : "bg-blue-600"}`}
        disabled={loading}
        accessibilityRole="button"
      >
        <Text className="text-white text-center font-semibold">
          {loading ? "Logging in..." : "Login with Password"}
        </Text>
      </Pressable>
      <Link
        href="/(auth)/register"
        className="mt-6 text-blue-600 text-center font-medium"
      >
        <Text> {"Don 't have an account? Sign Up"}</Text>
      </Link>
    </View>
  );
}
