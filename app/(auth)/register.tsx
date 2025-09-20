import { useAuth } from "@/providers/AuthProviders"; // Corrected import path
import * as LocalAuthentication from "expo-local-authentication"; // For biometrics integration
import { Link, router } from "expo-router";
import * as SecureStore from "expo-secure-store"; // To store biometrics enable flag
import { useCallback, useEffect, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";

// Modern enhancements: Added biometrics opt-in post-registration for secure future logins
// Design: Minimalist with soft rounded edges, clean spacing, password strength validation, and accessible inputs per 2025 trends

export default function RegisterScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [isBiometricEnrolled, setIsBiometricEnrolled] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false); // To trigger biometric prompt

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

  // Prompt to enable biometrics after successful registration
  useEffect(() => {
    if (registrationSuccess && isBiometricSupported && isBiometricEnrolled) {
      Alert.alert(
        "Enable Biometrics",
        "Would you like to enable quick login with biometrics (Face ID/Touch ID)?",
        [
          { text: "No Thanks", onPress: () => redirectToTabs() },
          {
            text: "Yes",
            onPress: async () => {
              try {
                const result = await LocalAuthentication.authenticateAsync({
                  promptMessage: "Confirm to enable biometrics",
                  cancelLabel: "Cancel",
                  fallbackLabel: "Use passcode",
                  disableDeviceFallback: false,
                });
                if (result.success) {
                  await SecureStore.setItemAsync("biometricsEnabled", "true");
                  Alert.alert(
                    "Success",
                    "Biometrics enabled for future logins!"
                  );
                }
              } catch (err) {
                console.error("Biometrics enable error:", err);
              } finally {
                redirectToTabs();
              }
            },
          },
        ]
      );
    } else if (registrationSuccess) {
      redirectToTabs();
    }
  }, [registrationSuccess, isBiometricSupported, isBiometricEnrolled]);

  const redirectToTabs = () => {
    router.replace("/(tabs)/home");
  };

  // Memoized handler with validations (password strength, match, email format)
  const handleRegister = useCallback(async () => {
    setError(null);
    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email format");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    // Additional strength: Check for uppercase, number, etc. (enhance with regex or libs like zxcvbn)

    setLoading(true);
    try {
      // Simulate API signup (in real: fetch to backend, get token)
      const fakeToken = "fake-jwt-token";
      const fakeUser = { id: "1", email, token: fakeToken };
      // On success:
      await login(fakeToken, fakeUser); // Adjusted to match context (token only); decode in provider for user data
      setRegistrationSuccess(true); // Trigger biometric prompt and redirect
    } catch (err) {
      console.error("Registration failed", err);
      setError("Registration failed. Please try again.");
      setLoading(false);
    }
  }, [email, password, confirmPassword, login]);

  return (
    <View className="flex-1 justify-center px-6 bg-white">
      <Text className="text-3xl font-bold mb-8 text-center text-gray-800">
        Create Account
      </Text>{" "}
      {/* Modern: Friendlier title */}
      {error && <Text className="text-red-500 mb-4 text-center">{error}</Text>}
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
        className="border border-gray-300 p-4 rounded-lg mb-4 bg-gray-50"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        accessibilityLabel="Password input"
      />
      <TextInput
        className="border border-gray-300 p-4 rounded-lg mb-6 bg-gray-50"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        accessibilityLabel="Confirm password input"
      />
      <Pressable
        onPress={handleRegister}
        className={`p-4 rounded-lg ${loading ? "bg-gray-400" : "bg-green-600"}`}
        disabled={loading}
        accessibilityRole="button"
      >
        <Text className="text-white text-center font-semibold">
          {loading ? "Registering..." : "Register"}
        </Text>
      </Pressable>
      <Link
        href="/(auth)/login"
        className="mt-6 text-blue-600 text-center font-medium"
      >
        Already have an account? Login
      </Link>
    </View>
  );
}
