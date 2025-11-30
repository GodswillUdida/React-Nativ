// components/TopBar.tsx (Pro design: Title/search left, notifications/avatar right; modern, haptic)
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { cn } from "@/utils/cn";
import { useAuth } from "@/providers/AuthProvider"; // Assume for user data

interface TopBarProps {
  title: string;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
  notificationsCount?: number;
  onNotificationsPress?: () => void;
  onProfilePress?: () => void;
}

export const TopBar = React.memo(function TopBar({
  title,
  showSearch = false,
  onSearch,
  notificationsCount = 0,
  onNotificationsPress,
  onProfilePress,
}: TopBarProps) {
  const colorScheme = useColorScheme();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = useCallback(
    (text: string) => {
      setSearchQuery(text);
      if (onSearch) onSearch(text);
    },
    [onSearch]
  );

  const handleNotifications = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onNotificationsPress) onNotificationsPress();
  }, [onNotificationsPress]);

  const handleProfile = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onProfilePress) onProfilePress();
  }, [onProfilePress]);

  return (
    <View
      className={cn(
        "flex-row items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800",
        "bg-white dark:bg-neutral-900" // Blue/white brand
      )}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
      }}
    >
      {showSearch ? (
        <TextInput
          placeholder={`Search ${title.toLowerCase()}...`}
          value={searchQuery}
          onChangeText={handleSearchChange}
          className="flex-1 bg-neutral-100 dark:bg-neutral-800 p-3 rounded-xl mr-3"
          placeholderTextColor="#9CA3AF"
          clearButtonMode="while-editing"
        />
      ) : (
        <Text className="text-xl font-poppinsBold text-neutral-900 dark:text-white">
          {title}
        </Text>
      )}
      <View className="flex-row items-center space-x-4">
        <TouchableOpacity onPress={handleNotifications} className="relative">
          <Ionicons
            name="notifications-outline"
            size={24}
            color={colorScheme === "dark" ? "#D1D5DB" : "#6B7280"}
          />
          {notificationsCount > 0 && (
            <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 items-center justify-center">
              <Text className="text-white text-xs">
                {notificationsCount > 9 ? "9+" : notificationsCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={handleProfile}>
          <Image
            source={{ uri: user?.avatar || "https://placeholder.com/32" }}
            className="w-8 h-8 rounded-full"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
});
