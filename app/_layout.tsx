// import {
//   AuthProvider,
//   getFromStorage,
//   useAuth,
// } from "@/providers/AuthProvider";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { router, Stack } from "expo-router";
// import { useFonts } from "expo-font";
// import * as SplashScreen from "expo-splash-screen";
// import { useEffect, useState } from "react";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import "../global.css";

// SplashScreen.preventAutoHideAsync();

// const queryClient = new QueryClient();

// function RootLayoutNav() {
//   const { user } = useAuth();
//   const [loading, setLoading] = useState(true);
//   const [loaded, error] = useFonts({
//     Poppins: require("./assets/fonts/Poppins-Regular.ttf"),
//     "Poppins-Bold": require("./assets/fonts/Poppins-Bold.ttf"),
//     "Poppins-SemiBold": require("./assets/fonts/Poppins-SemiBold.ttf"),
//   });

//   useEffect(() => {
//     const checkOnboarding = async () => {
//       const hasSeen = await getFromStorage("hasSeenOnboarding");

//       if (hasSeen) {
//         router.replace("/(app)/(tabs)/home");
//       } else {
//         // router.replace("/(onboarding)");
//         router.replace("/(app)/(tabs)/home");
//       }

//       setLoading(false);
//       SplashScreen.hideAsync();
//     };
//     checkOnboarding();
//   }, []);

//   return (
//     <Stack screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="index" options={{ headerShown: false }} />
//       {!user ? <Stack.Screen name="(tabs)" /> : <Stack.Screen name="(auth)" />}
//     </Stack>
//   );
// }

// export default function RootLayout() {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <GestureHandlerRootView style={{ flex: 1 }}>
//         <AuthProvider>
//           <RootLayoutNav />
//         </AuthProvider>
//       </GestureHandlerRootView>
//     </QueryClientProvider>
//   );
// }

import {
  AuthProvider,
  getFromStorage,
  useAuth,
} from "@/providers/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../global.css";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(
    null
  );

  const [fontsLoaded] = useFonts({
    Poppins: require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
  });

  useEffect(() => {
    const init = async () => {
      try {
        const seen = await getFromStorage("hasSeenOnboarding");
        setHasSeenOnboarding(seen === "true");
      } catch (e) {
        console.error("Failed to load onboarding flag:", e);
        setHasSeenOnboarding(false);
      } finally {
        setLoading(false);
        await SplashScreen.hideAsync();
      }
    };

    if (fontsLoaded) init();
  }, [fontsLoaded]);

  if (loading || !fontsLoaded || hasSeenOnboarding === null) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Onboarding flow */}
      {!user && hasSeenOnboarding === false && (
        <Stack.Screen name="(onboarding)" />
      )}

      {/* Auth flow */}
      {!user && hasSeenOnboarding === true && <Stack.Screen name="(auth)" />}

      {/* App flow */}
      {user && <Stack.Screen name="(tabs)" />}

      {/* fallback (rare) */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
          <RootLayoutNav />
        </AuthProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
