import { useAuth } from "@/providers/AuthProvider";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { MotiView } from "moti";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Linking,
  Pressable,
  Switch,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import api from "@/lib/api"; // your Axios or Fetch wrapper

interface SettingItem {
  icon: string;
  label: string;
  type: "toggle" | "link" | "button";
  action?: () => void;
  toggleValue?: boolean;
  onToggleChange?: (value: boolean) => void;
  accessory?: string;
}

const SettingRow = memo(({ item }: { item: SettingItem }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    item.action?.();
  };

  return (
    <TouchableOpacity
      disabled={item.type === "toggle"}
      onPress={item.type !== "toggle" ? handlePress : undefined}
      className="flex-row items-center py-4 border-b border-neutral-200 dark:border-neutral-800"
    >
      <MaterialCommunityIcons
        name={item.icon as any}
        size={22}
        color={isDark ? "#D1D5DB" : "#6B7280"}
        style={{ marginRight: 14 }}
      />
      <Text className="flex-1 text-base font-poppins text-neutral-900 dark:text-white">
        {item.label}
      </Text>

      {item.type === "toggle" ? (
        <Switch
          value={item.toggleValue}
          onValueChange={(v) => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            item.onToggleChange?.(v);
          }}
          trackColor={{ false: "#767577", true: "#6366F1" }}
          thumbColor="#fff"
        />
      ) : item.accessory ? (
        <Text className="text-neutral-500 dark:text-neutral-400 mr-2">
          {item.accessory}
        </Text>
      ) : (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={isDark ? "#9CA3AF" : "#6B7280"}
        />
      )}
    </TouchableOpacity>
  );
});

SettingRow.displayName = "SettingRow";

export default function MoreScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { user, logout } = useAuth();

  const [darkMode, setDarkMode] = useState(isDark);
  const [notifications, setNotifications] = useState(true);
  const [biometrics, setBiometrics] = useState(false);
  const [appVersion, setAppVersion] = useState("1.0.0");
  const [subscription, setSubscription] = useState<string | null>(null);

  const theme = {
    background: isDark ? "#111827" : "#F9FAFB",
  };

  // Fetch user subscription or settings from API
  useEffect(() => {
    (async () => {
      try {
        // const res = await api.get("/user/settings");
        // setSubscription(res.data.subscription);
      } catch {
        console.log("Failed to load settings");
      }
    })();
  }, []);

  const handleLogout = useCallback(() => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            // await api.post("/auth/logout");
            await logout();
          } catch (e) {
            console.log("Logout failed", e);
          }
        },
      },
    ]);
  }, [logout]);

  const openLink = (url: string) => {
    Linking.openURL(url).catch(() => Alert.alert("Error", "Cannot open link"));
  };

  const sections = useMemo(
    () => [
      {
        title: "Account",
        items: [
          {
            icon: "account-circle-outline",
            label: "Profile",
            type: "link",
            accessory: "Edit",
            action: () => router.push("/screens/ProfileScreen"),
          },
          {
            icon: "briefcase-outline",
            label: "Business",
            type: "link",
            accessory: "Switch",
            action: () => router.push("/screens/BusinessSwitchScreen"),
          },
          {
            icon: "email-outline",
            label: "Email",
            type: "link",
            accessory: user?.email || "—",
          },
          {
            icon: "lock-outline",
            label: "Change Password",
            type: "link",
            action: () => router.push("/screens/ChangePassword"),
          },
        ],
      },
      {
        title: "Preferences",
        items: [
          {
            icon: "theme-light-dark",
            label: "Dark Mode",
            type: "toggle",
            toggleValue: darkMode,
            onToggleChange: setDarkMode,
          },
          {
            icon: "bell-outline",
            label: "Notifications",
            type: "toggle",
            toggleValue: notifications,
            onToggleChange: setNotifications,
          },
          {
            icon: "fingerprint",
            label: "Biometrics",
            type: "toggle",
            toggleValue: biometrics,
            onToggleChange: setBiometrics,
          },
        ],
      },
      {
        title: "Support",
        items: [
          {
            icon: "help-circle-outline",
            label: "Help Center",
            type: "link",
            action: () => openLink("https://yourapp.com/help"),
          },
          {
            icon: "chat-outline",
            label: "Contact Support",
            type: "link",
            action: () => openLink("mailto:support@yourapp.com"),
          },
        ],
      },
      {
        title: "App",
        items: [
          {
            icon: "information-outline",
            label: "Version",
            type: "link",
            accessory: appVersion,
          },
          {
            icon: "logout",
            label: "Logout",
            type: "button",
            action: handleLogout,
          },
        ],
      },
    ],
    [user, darkMode, notifications, biometrics, handleLogout]
  );

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: theme.background }}
    >
      {/* User Header */}
      <MotiView
        from={{ opacity: 0, translateY: -10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 400 }}
        className="px-4 py-6 bg-white dark:bg-neutral-900 shadow-sm rounded-b-3xl mb-2"
      >
        <View className="flex-row items-center">
          <Image
            source={{
              uri:
                user?.avatar ||
                "https://instagram.flos2-2.fna.fbcdn.net/v/t51.2885-19/539605569_17848265964548323_6690144778166017305_n.jpg?stp=dst-jpg_s150x150_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby44NDAuYzIifQ&_nc_ht=instagram.flos2-2.fna.fbcdn.net&_nc_cat=107&_nc_oc=Q6cZ2QHaWXdyMCTtDsOycMZ_znt1weI5_izBt4VgaYXlVo-dkFtkt7oMU716gN0jl9OuP_4&_nc_ohc=IkYSWJJ3SfUQ7kNvwFM9Fpl&_nc_gid=Ng3ynZ9IZUImwFfApdGxbw&edm=AP4sbd4BAAAA&ccb=7-5&oh=00_AfcE27xxWMgVxHP7e8H1K5c0oqeK4tQ4uNTJlp1Fw4EdbQ&oe=68FE4962&_nc_sid=7a9f4b",
            }}
            className="w-14 h-14 rounded-full mr-4"
          />
          <View className="flex-1">
            <Text className="text-lg font-poppinsSemiBold text-neutral-900 dark:text-white">
              {user?.name || "User"}
            </Text>
            <Text className="text-sm font-poppins text-blue-500 dark:text-neutral-400">
              {user?.businessName || "No Business Linked"}
            </Text>
            <Text className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              {user?.email}
            </Text>
          </View>
        </View>
      </MotiView>

      {/* Subscription Card */}
      {/* {subscription && ( */}
      <MotiView
        from={{ opacity: 0, translateY: -10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 400 }}
        className="mx-4 mb-3 p-5 bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border"
      >
        <View className="flex-row items-center">
          <View className="w-14 h-14 rounded-full mr-4 border border-blue-600 flex justify-center items-center">
            <MaterialCommunityIcons
              name="crown-outline"
              size={32}
              color="blue"
            />
          </View>
          <View className="flex-1 flex flex-col">
            <Text className="text-lg font-poppinsSemiBold text-blue-900 dark:text-white">
              {/* {user?.plan || "Premium Plan"} */} Premium Plan
            </Text>
            <Text className="text-lg font-poppinsSemiBold text-neutral-900 dark:text-white">
              {subscription}
            </Text>
            <Text className="text-sm font-poppins text-blue-500 dark:text-neutral-400">
              ₦2,500/month • Active
            </Text>
          </View>
        </View>
        <Pressable
          onPress={() => router.push("/screens/Subscription")}
          className="rounded-md border border-green-500 mt-3 py-3"
        >
          <Text className="text-center font-poppins">Manage Subscription</Text>
        </Pressable>
      </MotiView>
      {/* )} */}

      {/* Settings List */}
      <FlatList
        data={sections}
        keyExtractor={(section) => section.title}
        renderItem={({ item: section }) => (
          <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 400 }}
            className="mx-4 mb-8 p-5 rounded-2xl bg-white dark:bg-neutral-900 shadow-sm border"
          >
            <Text className="text-sm font-poppinsBold mb-3 text-blue-500 dark:text-neutral-400 uppercase tracking-wide">
              {section.title}
            </Text>
            {section.items.map((item, idx) => (
              <SettingRow key={idx} item={item} />
            ))}
          </MotiView>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </SafeAreaView>
  );
}
