// import { useAuth } from "@/providers/AuthProvider"; // Fixed import path
// import { Redirect, router } from "expo-router"; // Added router for fallback
// import * as SplashScreen from "expo-splash-screen"; // Modern splash handling
// import { useEffect } from "react";
// import { ActivityIndicator, Text, View, useColorScheme } from "react-native"; // For loader and scheme

// // Prevent auto-hide until auth ready (call in app entry)
// SplashScreen.preventAutoHideAsync();

// export default function Index() {
//   const { user, loading } = useAuth(); // Renamed for clarity; assume error added to context
//   const colorScheme = useColorScheme(); // Modern: Dark mode support

//   // Hide splash once loaded (efficient, runs once)
//   useEffect(() => {
//     if (!loading) {
//       if (user) {
//         router.replace("/(app)/(tabs)/home");
//       } else {
//         router.replace("/(auth)/login");
//       }
//     }
//   }, [loading, user]);

//   if (loading) {
//     return (
//       <View
//         className={`flex-1 items-center justify-center ${colorScheme === "dark" ? "bg-gray-900" : "bg-white"}`}
//       >
//         <ActivityIndicator
//           size="large"
//           color={colorScheme === "dark" ? "#fff" : "#000"}
//         />
//         <Text
//           className={`mt-2 ${colorScheme === "dark" ? "text-white" : "text-black"}`}
//         >
//           Loading...
//         </Text>
//       </View>
//     );
//   }

//   // Modern redirect: If migrating to v5 protected routes, remove this and use folder-based auth (e.g., (app)/_layout.tsx with checks)
//   if (!user) {
//     return <Redirect href="/(onboarding)" />;
//   }

//   return <Redirect href="/(app)/(tabs)/home" />;
// }

import { useAuth } from "@/providers/AuthProvider";
import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function Index() {
  const { loading, user } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace("/(auth)/login");
        // router.replace("/(app)/(tabs)/home");
      } else {
        router.replace("/(auth)/login");
        // router.replace("/(app)/(tabs)/home");
      }
    }
  }, [loading, user]);

  // if (isLoading) {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator size="large" color="#000" />
      <Text className="mt-2">Loading...</Text>
    </View>
  );
}

// return null;
// }
