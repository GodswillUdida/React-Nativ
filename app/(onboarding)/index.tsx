import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {  Text, TouchableOpacity, View } from "react-native";
import PagerView from "react-native-pager-view";

// const { width } = Dimensions.get("window");

const slides = [
  { id: "1", title: "Welcome", desc: "Track your progress and stay on top." },
  { id: "2", title: "Stay Organized", desc: "Manage tasks efficiently." },
  {
    id: "3",
    title: "Get Started",
    desc: "Join us and level up your workflow.",
  },
];

export default function Onboarding() {
  const pagerRef = useRef<PagerView>(null);
  const [page, setPage] = useState(0);
  const router = useRouter();

  const finishOnboarding = async () => {
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
    router.replace("/(auth)/register");
  };

  const skip = () => finishOnboarding();

  return (
    <View className="flex-1 bg-white">
      {/* Skip Button */}
      {page < slides.length - 1 && (
        <TouchableOpacity
          onPress={skip}
          className="absolute top-12 right-5 z-10"
        >
          <Text className="text-white font-poppins bg-slate-500 px-4 py-2 rounded">Skip</Text>
        </TouchableOpacity>
      )}

      {/* Pager */}
      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={0}
        onPageSelected={(e) => setPage(e.nativeEvent.position)}
      >
        {slides.map((slide, idx) => (
          <View
            key={slide.id}
            className="flex-1 items-center justify-center px-6"
          >
            <Text className="text-3xl font-bold mb-3 text-center">
              {slide.title}
            </Text>
            <Text className="text-base text-gray-600 text-center mb-6">
              {slide.desc}
            </Text>

            {idx === slides.length - 1 ? (
              <TouchableOpacity
                onPress={finishOnboarding}
                className="mt-6 px-8 py-3 bg-blue-600 rounded-xl"
              >
                <Text className="text-white font-semibold text-lg">
                  Get Started
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => pagerRef.current?.setPage(idx + 1)}
                className="mt-6 px-8 py-3 bg-black rounded-xl"
              >
                <Text className="text-white font-semibold text-lg">Next</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </PagerView>

      {/* Dots Indicator */}
      <View className="flex-row justify-center mb-20">
        {slides.map((_, i) => (
          <View
            key={i}
            className={`w-2 h-2 rounded-full mx-1 ${
              i === page ? "bg-black" : "bg-gray-300"
            }`}
          />
        ))}
      </View>
    </View>
  );
}
