import React, { useState, useCallback } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { MotiView } from "moti";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
// import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import { Link, router } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";
import { useTheme } from "@react-navigation/native";

// ==================== ANIMATED COMPONENTS ====================
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ==================== MAIN COMPONENT ====================
export default function RegisterScreen() {
  const { user, login } = useAuth();
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const [isBiometricEnrolled, setIsBiometricEnrolled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const { colors } = useTheme();
  const buttonScale = useSharedValue(1);

  // ==================== ANIMATED STYLES ====================
  const primaryButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));


  const handlePasswordLogin = useCallback(async () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email format");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const fakeToken = "fake-jwt-token";
      const fakeUser = { id: "1", email, token: fakeToken };

      await SecureStore.setItemAsync("authToken", fakeToken);
      await login(fakeToken,fakeUser)

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/(auth)/login");
    } catch (err) {
      console.error("Registration failed", err);
      setError("Invalid credentials. Please try again.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  }, [email, password, login]);

  // ==================== RENDER ====================
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <StatusBar
        barStyle={colors.text === "#0F172A" ? "dark-content" : "light-content"}
        backgroundColor={colors.background}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Top Section - Brand */}
        <View className="flex-[0.2] justify-center items-center px-6 bg-gray-400 dark:bg-gray-800">
          <MotiView
            from={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "timing", duration: 800 }}
          >
            <Image
              source={require("../../assets/images/KudiFlooww.jpg")}
              className="w-24 h-24 mb-4 rounded-md"
              accessibilityLabel="KudiFlow logo"
            />
          </MotiView>
        </View>

        {/* Bottom Section - Form */}
        <View className="flex-[0.7] bg-white dark:bg-gray-900">
          <Animated.View
            entering={FadeInUp.duration(600).delay(200)}
            className="flex-1 px-6 pt-8"
          >
            <Text
              className="text-xl mb-6 font-poppinsBold text-blue-700"
              // style={{ color: colors.text + "80" }}
            >
              Register to have an account
            </Text>

            {/* Error Message */}
            {error && (
              <MotiView
                from={{ opacity: 0, translateY: -10 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: "timing", duration: 400 }}
                className="mb-4 p-4 rounded-2xl flex-row items-center bg-red-50"
              >
                <Ionicons name="alert-circle" size={20} color="#EF4444" />
                <Text className="ml-3 flex-1 text-sm text-red-600">
                  {error}
                </Text>
              </MotiView>
            )}

            {/* Email Input */}
            <View className="mb-4">
              <Text
                className="text-sm font-poppinsSemiBold mb-2"
                style={{ color: colors.text }}
              >
                Email Address
              </Text>
              <View
                className={`flex-row items-center rounded-2xl px-4 py-3 border-2 ${focusedField === "email" ? "border-blue-600" : "border-transparent"} bg-gray-100 dark:bg-gray-800`}
              >
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={
                    focusedField === "email"
                      ? colors.primary
                      : colors.text + "80"
                  }
                />
                <TextInput
                  placeholder="Enter your email"
                  placeholderTextColor={colors.text + "80"}
                  className="flex-1 ml-3 text-base"
                  style={{ color: colors.text }}
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  editable={!loading}
                  accessibilityLabel="Email address"
                />
              </View>
            </View>

            {/* Password Input */}
            <View className="mb-6">
              <View className="flex-row justify-between items-center mb-2">
                <Text
                  className="text-sm font-poppinsSemiBold"
                  style={{ color: colors.text }}
                >
                  Password
                </Text>
              </View>
              <View
                className={`flex-row items-center rounded-2xl px-4 py-3 border-2 ${focusedField === "password" ? "border-blue-600" : "border-transparent"} bg-gray-100 dark:bg-gray-800`}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={
                    focusedField === "password"
                      ? colors.primary
                      : colors.text + "80"
                  }
                />
                <TextInput
                  placeholder="Enter your password"
                  placeholderTextColor={colors.text + "80"}
                  className="flex-1 ml-3 text-base"
                  style={{ color: colors.text }}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  editable={!loading}
                  accessibilityLabel="Password"
                />
                <Pressable
                  onPress={() => {
                    setShowPassword(!showPassword);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  className="p-1"
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={colors.text + "80"}
                  />
                </Pressable>
              </View>
            </View>

            {/* Primary Login Button */}
            <AnimatedPressable
              onPressIn={() => (buttonScale.value = withSpring(0.97))}
              onPressOut={() => (buttonScale.value = withSpring(1))}
              onPress={handlePasswordLogin}
              disabled={loading}
              style={[primaryButtonStyle]}
              className="rounded-2xl overflow-hidden mb-3"
            >
              <LinearGradient
                colors={[colors.primary, "#1E40AF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="py-4 items-center"
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-base font-poppinsBold">
                    Register
                  </Text>
                )}
              </LinearGradient>
            </AnimatedPressable>

            {/* Divider */}
            <View className="flex-row items-center mb-6">
              <View className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
              <Text
                className="mx-4 text-sm font-poppins"
                style={{ color: colors.text + "80" }}
              >
                or continue with
              </Text>
              <View className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
            </View>

            {/* Social Login */}
            <View className="flex-row justify-center gap-4 mb-6">
              <Pressable
                onPress={() =>
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                }
                className="w-14 h-14 rounded-full items-center justify-center border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 active:bg-gray-100 dark:active:bg-gray-700"
              >
                <Image
                  source={require("../../assets/images/pngwing.com.png")}
                  className="w-6 h-6"
                  accessibilityLabel="Sign in with Google"
                />
              </Pressable>
              <Pressable
                onPress={() =>
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                }
                className="w-14 h-14 rounded-full items-center justify-center border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 active:bg-gray-100 dark:active:bg-gray-700"
              >
                <Image
                  source={require("../../assets/images/apple_png.png")}
                  className="w-6 h-6"
                  accessibilityLabel="Sign in with Apple"
                />
              </Pressable>
            </View>

            {/* Register Link */}
            <View className="flex-row justify-center items-center">
              <Text className="text-sm font-poppins" style={{ color: colors.text + "80" }}>
                {" Already have an account?"}{" "}
              </Text>
              <Link href="/(auth)/login" asChild>
                <Pressable
                  onPress={() =>
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                  }
                >
                  <Text className="text-sm font-poppinsBold text-blue-600">
                    Login
                  </Text>
                </Pressable>
              </Link>
            </View>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
