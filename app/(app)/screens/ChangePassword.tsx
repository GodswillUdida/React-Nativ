import {
  View,
  Text,
  TextInput,
  Pressable,
  useColorScheme,
  StatusBar,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native";

// Password validation rules
const PASSWORD_RULES = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: true,
};

// API Service
const ApiService = {
  validateCurrentPassword: async (password) => {
    // Replace with actual API call
    // const response = await fetch('/api/auth/validate-password', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ password })
    // });
    // return response.json();
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate validation - replace with actual logic
        if (password === "oldpassword123") {
          resolve({ valid: true });
        } else {
          reject({ message: "Current password is incorrect" });
        }
      }, 1000);
    });
  },

  changePassword: async (currentPassword, newPassword) => {
    // Replace with actual API call
    // const response = await fetch('/api/auth/change-password', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ currentPassword, newPassword })
    // });
    // return response.json();
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate API call
        if (currentPassword === "oldpassword123") {
          resolve({
            success: true,
            message: "Password changed successfully",
            requireRelogin: true,
          });
        } else {
          reject({ message: "Current password is incorrect" });
        }
      }, 2000);
    });
  },
};

// Password strength calculator
const calculatePasswordStrength = (password) => {
  let strength = 0;
  const checks = {
    length: password.length >= PASSWORD_RULES.minLength,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  Object.values(checks).forEach((check) => {
    if (check) strength += 20;
  });

  return {
    strength,
    checks,
    label:
      strength <= 40
        ? "Weak"
        : strength <= 60
        ? "Fair"
        : strength <= 80
        ? "Good"
        : "Strong",
    color:
      strength <= 40
        ? "#EF4444"
        : strength <= 60
        ? "#F59E0B"
        : strength <= 80
        ? "#3B82F6"
        : "#10B981",
  };
};

const ChangePassword = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const theme = {
    background: isDark ? "#0F172A" : "#F8FAFC",
    cardBg: isDark ? "#1E293B" : "#FFFFFF",
    textPrimary: isDark ? "#F8FAFC" : "#0F172A",
    textSecondary: isDark ? "#94A3B8" : "#64748B",
    border: isDark ? "#334155" : "#E2E8F0",
    inputBg: isDark ? "#1E293B" : "#F9FAFB",
  };

  const passwordStrength = calculatePasswordStrength(newPassword);

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!newPassword) {
      newErrors.newPassword = "New password is required";
    } else {
      if (newPassword.length < PASSWORD_RULES.minLength) {
        newErrors.newPassword = `Password must be at least ${PASSWORD_RULES.minLength} characters`;
      }
      if (PASSWORD_RULES.requireUppercase && !/[A-Z]/.test(newPassword)) {
        newErrors.newPassword =
          "Password must contain at least one uppercase letter";
      }
      if (PASSWORD_RULES.requireLowercase && !/[a-z]/.test(newPassword)) {
        newErrors.newPassword =
          "Password must contain at least one lowercase letter";
      }
      if (PASSWORD_RULES.requireNumber && !/[0-9]/.test(newPassword)) {
        newErrors.newPassword = "Password must contain at least one number";
      }
      if (
        PASSWORD_RULES.requireSpecialChar &&
        !/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
      ) {
        newErrors.newPassword =
          "Password must contain at least one special character";
      }
      if (currentPassword && newPassword === currentPassword) {
        newErrors.newPassword =
          "New password must be different from current password";
      }
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    validateForm();
  };

  const handleSubmit = async () => {
    // Mark all fields as touched
    setTouched({
      currentPassword: true,
      newPassword: true,
      confirmPassword: true,
    });

    if (!validateForm()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const response = await ApiService.changePassword(
        currentPassword,
        newPassword
      );

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      Alert.alert(
        "Success!",
        "Your password has been changed successfully. Please sign in with your new password.",
        [
          {
            text: "OK",
            onPress: () => {
              // Navigate to login or go back
              if (response.requireRelogin) {
                // navigation.navigate('Login');
                navigation.goBack();
              } else {
                navigation.goBack();
              }
            },
          },
        ]
      );

      // Reset form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTouched({});
      setErrors({});
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        "Error",
        error.message || "Failed to change password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const PasswordInput = ({
    label,
    value,
    onChangeText,
    showPassword,
    onToggleShow,
    error,
    touched,
    onBlur,
    placeholder,
  }) => (
    <View className="mb-6">
      <Text
        style={{ color: theme.textSecondary }}
        className="text-sm font-medium mb-2"
      >
        {label}
      </Text>
      <View className="relative">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          secureTextEntry={!showPassword}
          placeholder={placeholder}
          placeholderTextColor={theme.textSecondary}
          className="border rounded-xl p-4 pr-12"
          style={{
            borderColor: touched && error ? "#EF4444" : theme.border,
            backgroundColor: theme.inputBg,
            color: theme.textPrimary,
          }}
          autoCapitalize="none"
        />
        <Pressable onPress={onToggleShow} className="absolute right-4 top-4">
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={22}
            color={theme.textSecondary}
          />
        </Pressable>
      </View>
      {touched && error && (
        <View className="flex-row items-center mt-2">
          <Ionicons name="alert-circle" size={14} color="#EF4444" />
          <Text className="text-red-500 text-xs ml-1">{error}</Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={theme.background}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <Animated.View
          entering={FadeInDown.duration(300)}
          className="flex-row items-center px-6 py-4 border-b"
          style={{ borderColor: theme.border }}
        >
          <Pressable onPress={() => navigation.goBack()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
          </Pressable>
          <View>
            <Text
              style={{ color: theme.textPrimary }}
              className="text-2xl font-bold"
            >
              Change Password
            </Text>
            <Text
              style={{ color: theme.textSecondary }}
              className="text-sm mt-1"
            >
              Keep your account secure
            </Text>
          </View>
        </Animated.View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 24 }}
        >
          {/* Security Notice */}
          <Animated.View
            entering={FadeInUp.duration(400).delay(100)}
            className="flex-row items-start p-4 rounded-2xl mb-6"
            style={{ backgroundColor: isDark ? "#1E40AF20" : "#DBEAFE" }}
          >
            <Ionicons name="shield-checkmark" size={20} color="#3B82F6" />
            <View className="flex-1 ml-3">
              <Text
                style={{ color: theme.textPrimary }}
                className="font-medium text-sm"
              >
                Security Tip
              </Text>
              <Text
                style={{ color: theme.textSecondary }}
                className="text-xs mt-1"
              >
                Use a strong password with a mix of letters, numbers, and
                special characters. Avoid using common words or personal
                information.
              </Text>
            </View>
          </Animated.View>

          {/* Current Password */}
          <Animated.View entering={FadeInUp.duration(400).delay(150)}>
            <PasswordInput
              label="Current Password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              showPassword={showCurrentPassword}
              onToggleShow={() => setShowCurrentPassword(!showCurrentPassword)}
              error={errors.currentPassword}
              touched={touched.currentPassword}
              onBlur={() => handleBlur("currentPassword")}
              placeholder="Enter current password"
            />
          </Animated.View>

          {/* New Password */}
          <Animated.View entering={FadeInUp.duration(400).delay(200)}>
            <PasswordInput
              label="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              showPassword={showNewPassword}
              onToggleShow={() => setShowNewPassword(!showNewPassword)}
              error={errors.newPassword}
              touched={touched.newPassword}
              onBlur={() => handleBlur("newPassword")}
              placeholder="Enter new password"
            />
          </Animated.View>

          {/* Password Strength Indicator */}
          {newPassword.length > 0 && (
            <Animated.View
              entering={FadeInUp.duration(400)}
              className="mb-6 -mt-2"
            >
              <View className="flex-row items-center justify-between mb-2">
                <Text
                  style={{ color: theme.textSecondary }}
                  className="text-xs"
                >
                  Password Strength
                </Text>
                <Text
                  style={{ color: passwordStrength.color }}
                  className="text-xs font-semibold"
                >
                  {passwordStrength.label}
                </Text>
              </View>
              <View className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <View
                  className="h-full rounded-full"
                  style={{
                    backgroundColor: passwordStrength.color,
                    width: `${passwordStrength.strength}%`,
                  }}
                />
              </View>

              {/* Password Requirements */}
              <View className="mt-4 space-y-2">
                {[
                  {
                    check: passwordStrength.checks.length,
                    text: `At least ${PASSWORD_RULES.minLength} characters`,
                  },
                  {
                    check: passwordStrength.checks.uppercase,
                    text: "One uppercase letter",
                  },
                  {
                    check: passwordStrength.checks.lowercase,
                    text: "One lowercase letter",
                  },
                  { check: passwordStrength.checks.number, text: "One number" },
                  {
                    check: passwordStrength.checks.specialChar,
                    text: "One special character",
                  },
                ].map((req, index) => (
                  <View key={index} className="flex-row items-center">
                    <Ionicons
                      name={req.check ? "checkmark-circle" : "ellipse-outline"}
                      size={16}
                      color={req.check ? "#10B981" : theme.textSecondary}
                    />
                    <Text
                      style={{
                        color: req.check ? "#10B981" : theme.textSecondary,
                      }}
                      className="text-xs ml-2"
                    >
                      {req.text}
                    </Text>
                  </View>
                ))}
              </View>
            </Animated.View>
          )}

          {/* Confirm Password */}
          <Animated.View entering={FadeInUp.duration(400).delay(250)}>
            <PasswordInput
              label="Confirm New Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              showPassword={showConfirmPassword}
              onToggleShow={() => setShowConfirmPassword(!showConfirmPassword)}
              error={errors.confirmPassword}
              touched={touched.confirmPassword}
              onBlur={() => handleBlur("confirmPassword")}
              placeholder="Re-enter new password"
            />
          </Animated.View>

          {/* Additional Security Options */}
          <Animated.View
            entering={FadeInUp.duration(400).delay(300)}
            className="rounded-2xl p-4 mb-6"
            style={{ backgroundColor: theme.cardBg }}
          >
            <Text
              style={{ color: theme.textPrimary }}
              className="font-semibold mb-3"
            >
              Additional Security
            </Text>

            <Pressable className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center flex-1">
                <View
                  className="w-10 h-10 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: "#3B82F615" }}
                >
                  <Ionicons name="key-outline" size={20} color="#3B82F6" />
                </View>
                <View className="flex-1">
                  <Text
                    style={{ color: theme.textPrimary }}
                    className="font-medium"
                  >
                    Sign out of all devices
                  </Text>
                  <Text
                    style={{ color: theme.textSecondary }}
                    className="text-xs mt-1"
                  >
                    Requires re-login everywhere
                  </Text>
                </View>
              </View>
            </Pressable>

            <Pressable className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center flex-1">
                <View
                  className="w-10 h-10 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: "#10B98115" }}
                >
                  <Ionicons name="mail-outline" size={20} color="#10B981" />
                </View>
                <View className="flex-1">
                  <Text
                    style={{ color: theme.textPrimary }}
                    className="font-medium"
                  >
                    Email confirmation
                  </Text>
                  <Text
                    style={{ color: theme.textSecondary }}
                    className="text-xs mt-1"
                  >
                    Send verification to your email
                  </Text>
                </View>
              </View>
            </Pressable>
          </Animated.View>

          {/* Forgot Password Link */}
          <Animated.View
            entering={FadeInUp.duration(400).delay(350)}
            className="items-center mb-6"
          >
            <Pressable>
              <Text className="text-blue-500 font-medium">
                Forgot your current password?
              </Text>
            </Pressable>
          </Animated.View>
        </ScrollView>

        {/* Submit Button */}
        <Animated.View
          entering={FadeInUp.duration(400).delay(400)}
          className="p-6 border-t"
          style={{ borderColor: theme.border }}
        >
          <Pressable
            onPress={handleSubmit}
            disabled={
              isLoading || !currentPassword || !newPassword || !confirmPassword
            }
            className="rounded-xl p-4 items-center"
            style={{
              backgroundColor:
                isLoading ||
                !currentPassword ||
                !newPassword ||
                !confirmPassword
                  ? theme.textSecondary
                  : "#3B82F6",
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? (
              <View className="flex-row items-center">
                <View className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                <Text className="text-white font-semibold">
                  Changing Password...
                </Text>
              </View>
            ) : (
              <Text className="text-white text-base font-semibold">
                Change Password
              </Text>
            )}
          </Pressable>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChangePassword;
