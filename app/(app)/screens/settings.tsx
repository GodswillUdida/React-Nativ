import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  TextInput,
  FlatList,
  Alert,
  Image,
  useColorScheme,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState, useMemo, useCallback } from "react";
import * as Haptics from "expo-haptics";
import { MotiView } from "moti";
import { useNavigation } from "@react-navigation/native";

interface SettingItem {
  icon: string;
  label: string;
  type: "toggle" | "link" | "button";
  action?: () => void;
  toggleValue?: boolean;
  onToggleChange?: (value: boolean) => void;
  accessory?: string;
}

const SettingRow = React.memo(function SettingRow({
  item,
}: {
  item: SettingItem;
}) {
  const colorScheme = useColorScheme();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (item.action) item.action();
  };

  return (
    <TouchableOpacity
      onPress={item.type !== "toggle" ? handlePress : undefined}
      className="flex-row items-center py-4 border-b border-neutral-200 dark:border-neutral-800"
    >
      <MaterialCommunityIcons
        name={item.icon}
        size={22}
        color={colorScheme === "dark" ? "#D1D5DB" : "#6B7280"}
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
            if (item.onToggleChange) item.onToggleChange(v);
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
          color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
        />
      )}
    </TouchableOpacity>
  );
});

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(colorScheme === "dark");
  const [notifications, setNotifications] = useState(true);
  const [biometrics, setBiometrics] = useState(false);

  const theme = useMemo(
    () => ({
      background: colorScheme === "dark" ? "#111827" : "#F9FAFB",
    }),
    [colorScheme]
  );

  // ✅ Real actions
  const handleLogout = useCallback(() => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          console.log("User logged out");
          // replace with your auth signout logic
          // e.g. supabase.auth.signOut() or firebase.auth().signOut()
        },
      },
    ]);
  }, []);

  const openLink = (url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert("Error", "Unable to open link");
    });
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
            action: () => navigation.navigate("ProfileScreen"),
          },
          {
            icon: "briefcase-outline",
            label: "Business",
            type: "link",
            accessory: "Switch",
            action: () => navigation.navigate("BusinessSwitchScreen"),
          },
          {
            icon: "email-outline",
            label: "Email",
            type: "link",
            accessory: "user@biz.com",
            action: () => console.log("Change Email"),
          },
          {
            icon: "lock-outline",
            label: "Change Password",
            type: "link",
            action: () => navigation.navigate("ChangePasswordScreen"),
          },
        ],
      },
      {
        title: "Notifications",
        items: [
          {
            icon: "bell-outline",
            label: "Push Notifications",
            type: "toggle",
            toggleValue: notifications,
            onToggleChange: setNotifications,
          },
          {
            icon: "email-outline",
            label: "Email Alerts",
            type: "toggle",
            toggleValue: true,
            onToggleChange: () => console.log("Email alerts toggled"),
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
            onToggleChange: (v) => {
              setDarkMode(v);
              console.log("Dark mode:", v);
              // Integrate with theme context/provider if available
            },
          },
          {
            icon: "translate",
            label: "Language",
            type: "link",
            accessory: "English",
            action: () => navigation.navigate("LanguageScreen"),
          },
          {
            icon: "currency-ngn",
            label: "Currency",
            type: "link",
            accessory: "₦",
            action: () => navigation.navigate("CurrencyScreen"),
          },
        ],
      },
      {
        title: "Security",
        items: [
          {
            icon: "fingerprint",
            label: "Biometrics",
            type: "toggle",
            toggleValue: biometrics,
            onToggleChange: setBiometrics,
          },
          {
            icon: "shield-lock-outline",
            label: "Two-Factor Auth",
            type: "link",
            action: () => navigation.navigate("TwoFAScreen"),
          },
          {
            icon: "cellphone-lock",
            label: "Device Management",
            type: "link",
            action: () => navigation.navigate("DeviceManagementScreen"),
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
          {
            icon: "star-outline",
            label: "Rate App",
            type: "link",
            action: () =>
              openLink(
                "https://play.google.com/store/apps/details?id=com.yourapp"
              ),
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
            accessory: "1.0.0",
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
    [notifications, darkMode, biometrics, handleLogout]
  );

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: theme.background }}
    >
      {/* Profile Header */}
      <MotiView
        from={{ opacity: 0, translateY: -10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 400 }}
        className="px-4 py-6 bg-white dark:bg-neutral-900 shadow-sm rounded-b-3xl mb-2"
      >
        <View className="flex-row items-center">
          <Image
            source={{
              uri: "https://instagram.flos2-2.fna.fbcdn.net/v/t51.2885-19/539605569_17848265964548323_6690144778166017305_n.jpg?stp=dst-jpg_s150x150_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby44NDAuYzIifQ&_nc_ht=instagram.flos2-2.fna.fbcdn.net&_nc_cat=107&_nc_oc=Q6cZ2QHaWXdyMCTtDsOycMZ_znt1weI5_izBt4VgaYXlVo-dkFtkt7oMU716gN0jl9OuP_4&_nc_ohc=IkYSWJJ3SfUQ7kNvwFM9Fpl&_nc_gid=Ng3ynZ9IZUImwFfApdGxbw&edm=AP4sbd4BAAAA&ccb=7-5&oh=00_AfcE27xxWMgVxHP7e8H1K5c0oqeK4tQ4uNTJlp1Fw4EdbQ&oe=68FE4962&_nc_sid=7a9f4b",
            }}
            className="w-14 h-14 rounded-full mr-4"
          />
          <View className="flex-1">
            <Text className="text-lg font-poppins text-neutral-900 dark:text-white">
              Godswill Udida
            </Text>
            <Text className="text-sm font-poppinsSemiBold text-blue-500 dark:text-neutral-400">
              Godswill Stores
            </Text>
            <Text className="text-sm text-neutral-500 dark:text-neutral-400">
              udidagodswill7@gmail.com
            </Text>
          </View>
          <Ionicons
            name="pencil-outline"
            size={20}
            color="#6366F1"
            onPress={() => navigation.navigate("ProfileScreen")}
          />
        </View>
      </MotiView>

      {/* Search */}
      <View className="px-4 mb-2">
        <TextInput
          placeholder="Search settings..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          className="bg-neutral-100 dark:bg-neutral-800 p-3 rounded-2xl border border-neutral-400 dark:border-neutral-700"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {/* Sections */}
      <FlatList
        data={sections}
        keyExtractor={(section) => section.title}
        renderItem={({ item: section }) => (
          <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 400 }}
            className="mx-4 mb-10 p-6 rounded-2xl bg-white dark:bg-neutral-900 shadow-sm border"
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
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </SafeAreaView>
  );
}
