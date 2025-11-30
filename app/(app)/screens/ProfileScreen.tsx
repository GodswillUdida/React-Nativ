import React, { useState } from "react";
import {
  Text,
  View,
  ScrollView,
  Pressable,
  useColorScheme,
  StatusBar,
  TextInput,
  Image,
  Alert,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import { useAuth } from "@/providers/AuthProvider";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// API Service Functions
const ApiService = {
  getUserProfile: async (userId) => {
    // Replace with actual API call
    // const response = await fetch(`/api/users/${userId}`);
    // return response.json();
    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve({
            id: "user_123",
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            phone: "+1 (555) 123-4567",
            address: {
              street: "123 Main Street",
              city: "New York",
              state: "NY",
              zipCode: "10001",
            },
            avatar: "https://i.pravatar.cc/300?img=12",
            verified: true,
          }),
        1000
      );
    });
  },

  updateUserProfile: async (userId, data) => {
    // Replace with actual API call
    // const response = await fetch(`/api/users/${userId}`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });
    // return response.json();
    return new Promise((resolve) => {
      setTimeout(() => resolve(data), 1500);
    });
  },

  uploadAvatar: async (userId, imageUri) => {
    // Replace with actual API call
    // const formData = new FormData();
    // formData.append('avatar', {
    //   uri: imageUri,
    //   type: 'image/jpeg',
    //   name: 'avatar.jpg'
    // });
    // const response = await fetch(`/api/users/${userId}/avatar`, {
    //   method: 'POST',
    //   body: formData
    // });
    // return response.json();
    return new Promise((resolve) => {
      setTimeout(() => resolve({ avatarUrl: imageUri }), 1500);
    });
  },
};

// Edit Profile Modal
const EditProfileModal = ({ visible, onClose, userData, onSave, theme }) => {
  const [formData, setFormData] = useState({
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    phone: userData.phone,
    street: userData.address.street,
    city: userData.address.city,
    state: userData.address.state,
    zipCode: userData.address.zipCode,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    // Basic validation
    if (!formData.firstName || !formData.lastName) {
      Alert.alert("Validation Error", "First name and last name are required");
      return;
    }

    if (!formData.email || !formData.email.includes("@")) {
      Alert.alert("Validation Error", "Please enter a valid email");
      return;
    }

    setIsLoading(true);
    try {
      await onSave(formData);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Success", "Profile updated successfully");
      onClose();
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        {/* Header */}
        <View
          className="flex-row items-center justify-between p-6 border-b"
          style={{ borderColor: theme.border }}
        >
          <Pressable onPress={onClose}>
            <Ionicons name="close" size={24} color={theme.textPrimary} />
          </Pressable>
          <Text
            style={{ color: theme.textPrimary }}
            className="text-lg font-semibold"
          >
            Edit Profile
          </Text>
          <View className="w-6" />
        </View>

        <ScrollView
          className="flex-1 px-6 py-4"
          showsVerticalScrollIndicator={false}
        >
          {/* Personal Information Section */}
          <Text
            style={{ color: theme.textPrimary }}
            className="text-base font-semibold mb-4"
          >
            Personal Information
          </Text>

          {/* First Name */}
          <View className="mb-4">
            <Text
              style={{ color: theme.textSecondary }}
              className="text-sm font-medium mb-2"
            >
              First Name *
            </Text>
            <TextInput
              value={formData.firstName}
              onChangeText={(text) =>
                setFormData({ ...formData, firstName: text })
              }
              className="border rounded-xl p-4"
              style={{
                borderColor: theme.border,
                backgroundColor: theme.cardBg,
                color: theme.textPrimary,
              }}
              placeholder="Enter first name"
              placeholderTextColor={theme.textSecondary}
            />
          </View>

          {/* Last Name */}
          <View className="mb-4">
            <Text
              style={{ color: theme.textSecondary }}
              className="text-sm font-medium mb-2"
            >
              Last Name *
            </Text>
            <TextInput
              value={formData.lastName}
              onChangeText={(text) =>
                setFormData({ ...formData, lastName: text })
              }
              className="border rounded-xl p-4"
              style={{
                borderColor: theme.border,
                backgroundColor: theme.cardBg,
                color: theme.textPrimary,
              }}
              placeholder="Enter last name"
              placeholderTextColor={theme.textSecondary}
            />
          </View>

          {/* Email */}
          <View className="mb-4">
            <Text
              style={{ color: theme.textSecondary }}
              className="text-sm font-medium mb-2"
            >
              Email *
            </Text>
            <TextInput
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              className="border rounded-xl p-4"
              style={{
                borderColor: theme.border,
                backgroundColor: theme.cardBg,
                color: theme.textPrimary,
              }}
              placeholder="Enter email"
              placeholderTextColor={theme.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Phone */}
          <View className="mb-6">
            <Text
              style={{ color: theme.textSecondary }}
              className="text-sm font-medium mb-2"
            >
              Phone Number
            </Text>
            <TextInput
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              className="border rounded-xl p-4"
              style={{
                borderColor: theme.border,
                backgroundColor: theme.cardBg,
                color: theme.textPrimary,
              }}
              placeholder="Enter phone number"
              placeholderTextColor={theme.textSecondary}
              keyboardType="phone-pad"
            />
          </View>

          {/* Address Section */}
          <Text
            style={{ color: theme.textPrimary }}
            className="text-base font-semibold mb-4 mt-2"
          >
            Address
          </Text>

          {/* Street */}
          <View className="mb-4">
            <Text
              style={{ color: theme.textSecondary }}
              className="text-sm font-medium mb-2"
            >
              Street Address
            </Text>
            <TextInput
              value={formData.street}
              onChangeText={(text) =>
                setFormData({ ...formData, street: text })
              }
              className="border rounded-xl p-4"
              style={{
                borderColor: theme.border,
                backgroundColor: theme.cardBg,
                color: theme.textPrimary,
              }}
              placeholder="Enter street address"
              placeholderTextColor={theme.textSecondary}
            />
          </View>

          {/* City & State Row */}
          <View className="flex-row mb-4">
            <View className="flex-1 mr-2">
              <Text
                style={{ color: theme.textSecondary }}
                className="text-sm font-medium mb-2"
              >
                City
              </Text>
              <TextInput
                value={formData.city}
                onChangeText={(text) =>
                  setFormData({ ...formData, city: text })
                }
                className="border rounded-xl p-4"
                style={{
                  borderColor: theme.border,
                  backgroundColor: theme.cardBg,
                  color: theme.textPrimary,
                }}
                placeholder="City"
                placeholderTextColor={theme.textSecondary}
              />
            </View>

            <View className="flex-1 ml-2">
              <Text
                style={{ color: theme.textSecondary }}
                className="text-sm font-medium mb-2"
              >
                State
              </Text>
              <TextInput
                value={formData.state}
                onChangeText={(text) =>
                  setFormData({ ...formData, state: text })
                }
                className="border rounded-xl p-4"
                style={{
                  borderColor: theme.border,
                  backgroundColor: theme.cardBg,
                  color: theme.textPrimary,
                }}
                placeholder="State"
                placeholderTextColor={theme.textSecondary}
              />
            </View>
          </View>

          {/* Zip Code */}
          <View className="mb-4">
            <Text
              style={{ color: theme.textSecondary }}
              className="text-sm font-medium mb-2"
            >
              Zip Code
            </Text>
            <TextInput
              value={formData.zipCode}
              onChangeText={(text) =>
                setFormData({ ...formData, zipCode: text })
              }
              className="border rounded-xl p-4"
              style={{
                borderColor: theme.border,
                backgroundColor: theme.cardBg,
                color: theme.textPrimary,
              }}
              placeholder="Enter zip code"
              placeholderTextColor={theme.textSecondary}
              keyboardType="number-pad"
            />
          </View>
        </ScrollView>

        {/* Save Button */}
        <View className="p-6 border-t" style={{ borderColor: theme.border }}>
          <Pressable
            onPress={handleSave}
            disabled={isLoading}
            className="rounded-xl p-4 items-center"
            style={{
              backgroundColor: isLoading ? theme.textSecondary : "#3B82F6",
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? (
              <View className="flex-row items-center">
                <View className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                <Text className="text-white font-semibold">Saving...</Text>
              </View>
            ) : (
              <Text className="text-white text-base font-semibold">
                Save Changes
              </Text>
            )}
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const ProfileScreen = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { user } = useAuth();

  const [userData, setUserData] = useState({
    id: "user_123",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: {
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
    },
    avatar: "https://i.pravatar.cc/300?img=12",
    verified: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const avatarScale = useSharedValue(1);

  const theme = {
    background: isDark ? "#0F172A" : "#F8FAFC",
    cardBg: isDark ? "#1E293B" : "#FFFFFF",
    textPrimary: isDark ? "#F8FAFC" : "#0F172A",
    textSecondary: isDark ? "#94A3B8" : "#64748B",
    border: isDark ? "#334155" : "#E2E8F0",
  };

  const animatedAvatarStyle = useAnimatedStyle(() => ({
    transform: [{ scale: avatarScale.value }],
  }));

  const handleAvatarPress = async () => {
    avatarScale.value = withSpring(0.95, {}, () => {
      avatarScale.value = withSpring(1);
    });

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please grant photo library access to change your avatar"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setIsLoading(true);
      try {
        const response = await ApiService.uploadAvatar(
          userData.id,
          result.assets[0].uri
        );
        setUserData({ ...userData, avatar: response.avatarUrl });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert("Success", "Profile photo updated!");
      } catch (error) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert("Error", "Failed to upload photo");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleUpdateProfile = async (formData) => {
    const updatedData = await ApiService.updateUserProfile(userData.id, {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
      },
    });

    setUserData({
      ...userData,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
      },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={theme.background}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View
          entering={FadeInDown.duration(400)}
          className="px-6 py-4 flex-row items-center justify-between"
        >
          <Text
            style={{ color: theme.textPrimary }}
            className="text-2xl font-bold"
          >
            Profile
          </Text>
          <Pressable
            onPress={() => setEditModalVisible(true)}
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: theme.cardBg }}
          >
            <Ionicons name="create-outline" size={20} color="#3B82F6" />
          </Pressable>
        </Animated.View>

        {/* Profile Header Card */}
        <Animated.View
          entering={FadeInUp.duration(400).delay(100)}
          className="mx-6 mb-6"
        >
          <View
            className="rounded-3xl p-6 items-center"
            style={{ backgroundColor: theme.cardBg }}
          >
            {/* Avatar */}
            <AnimatedPressable
              onPress={handleAvatarPress}
              style={animatedAvatarStyle}
              disabled={isLoading}
            >
              <View className="relative">
                <Image
                  source={{ uri: userData.avatar }}
                  className="w-28 h-28 rounded-full"
                  style={{ backgroundColor: theme.border }}
                />
                {isLoading && (
                  <View className="absolute inset-0 rounded-full bg-black/50 items-center justify-center">
                    <View className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </View>
                )}
                <View className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-blue-500 items-center justify-center border-4 border-white dark:border-gray-800">
                  <Ionicons name="camera" size={16} color="white" />
                </View>
                {userData.verified && (
                  <View className="absolute top-0 right-0 w-8 h-8 rounded-full bg-green-500 items-center justify-center border-2 border-white dark:border-gray-800">
                    <Ionicons name="checkmark" size={16} color="white" />
                  </View>
                )}
              </View>
            </AnimatedPressable>

            {/* Name */}
            <Text
              style={{ color: theme.textPrimary }}
              className="text-2xl font-bold mt-4"
            >
              {userData.firstName} {userData.lastName}
            </Text>

            {/* Email */}
            <Text
              style={{ color: theme.textSecondary }}
              className="text-sm mt-1"
            >
              {userData.email}
            </Text>
          </View>
        </Animated.View>

        {/* Personal Information Section */}
        <Animated.View
          entering={FadeInUp.duration(400).delay(200)}
          className="mb-6"
        >
          <Text
            style={{ color: theme.textPrimary }}
            className="text-lg font-semibold px-6 mb-3"
          >
            Personal Information
          </Text>

          <View
            className="mx-6 rounded-2xl overflow-hidden"
            style={{ backgroundColor: theme.cardBg }}
          >
            <Pressable
              onPress={() => setEditModalVisible(true)}
              className="flex-row items-center p-4 border-b"
              style={{ borderColor: theme.border }}
            >
              <View
                className="w-10 h-10 rounded-full items-center justify-center mr-4"
                style={{ backgroundColor: `${theme.textSecondary}15` }}
              >
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={theme.textPrimary}
                />
              </View>
              <View className="flex-1">
                <Text
                  style={{ color: theme.textPrimary }}
                  className="text-base font-medium"
                >
                  Full Name
                </Text>
                <Text
                  style={{ color: theme.textSecondary }}
                  className="text-sm mt-1"
                >
                  {userData.firstName} {userData.lastName}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.textSecondary}
              />
            </Pressable>

            <Pressable
              onPress={() => setEditModalVisible(true)}
              className="flex-row items-center p-4 border-b"
              style={{ borderColor: theme.border }}
            >
              <View
                className="w-10 h-10 rounded-full items-center justify-center mr-4"
                style={{ backgroundColor: `${theme.textSecondary}15` }}
              >
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={theme.textPrimary}
                />
              </View>
              <View className="flex-1">
                <Text
                  style={{ color: theme.textPrimary }}
                  className="text-base font-medium"
                >
                  Email
                </Text>
                <Text
                  style={{ color: theme.textSecondary }}
                  className="text-sm mt-1"
                >
                  {userData.email}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.textSecondary}
              />
            </Pressable>

            <Pressable
              onPress={() => setEditModalVisible(true)}
              className="flex-row items-center p-4"
            >
              <View
                className="w-10 h-10 rounded-full items-center justify-center mr-4"
                style={{ backgroundColor: `${theme.textSecondary}15` }}
              >
                <Ionicons
                  name="call-outline"
                  size={20}
                  color={theme.textPrimary}
                />
              </View>
              <View className="flex-1">
                <Text
                  style={{ color: theme.textPrimary }}
                  className="text-base font-medium"
                >
                  Phone Number
                </Text>
                <Text
                  style={{ color: theme.textSecondary }}
                  className="text-sm mt-1"
                >
                  {userData.phone}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.textSecondary}
              />
            </Pressable>
          </View>
        </Animated.View>

        {/* Address Section */}
        <Animated.View
          entering={FadeInUp.duration(400).delay(250)}
          className="mb-6"
        >
          <Text
            style={{ color: theme.textPrimary }}
            className="text-lg font-semibold px-6 mb-3"
          >
            Address
          </Text>

          <View
            className="mx-6 rounded-2xl overflow-hidden"
            style={{ backgroundColor: theme.cardBg }}
          >
            <Pressable
              onPress={() => setEditModalVisible(true)}
              className="flex-row items-center p-4 border-b"
              style={{ borderColor: theme.border }}
            >
              <View
                className="w-10 h-10 rounded-full items-center justify-center mr-4"
                style={{ backgroundColor: `${theme.textSecondary}15` }}
              >
                <Ionicons
                  name="location-outline"
                  size={20}
                  color={theme.textPrimary}
                />
              </View>
              <View className="flex-1">
                <Text
                  style={{ color: theme.textPrimary }}
                  className="text-base font-medium"
                >
                  Street Address
                </Text>
                <Text
                  style={{ color: theme.textSecondary }}
                  className="text-sm mt-1"
                >
                  {userData.address.street}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.textSecondary}
              />
            </Pressable>

            <Pressable
              onPress={() => setEditModalVisible(true)}
              className="flex-row items-center p-4"
            >
              <View
                className="w-10 h-10 rounded-full items-center justify-center mr-4"
                style={{ backgroundColor: `${theme.textSecondary}15` }}
              >
                <Ionicons
                  name="business-outline"
                  size={20}
                  color={theme.textPrimary}
                />
              </View>
              <View className="flex-1">
                <Text
                  style={{ color: theme.textPrimary }}
                  className="text-base font-medium"
                >
                  City, State, Zip
                </Text>
                <Text
                  style={{ color: theme.textSecondary }}
                  className="text-sm mt-1"
                >
                  {userData.address.city}, {userData.address.state}{" "}
                  {userData.address.zipCode}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.textSecondary}
              />
            </Pressable>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <EditProfileModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        userData={userData}
        onSave={handleUpdateProfile}
        theme={theme}
      />
    </SafeAreaView>
  );
};

export default ProfileScreen;
