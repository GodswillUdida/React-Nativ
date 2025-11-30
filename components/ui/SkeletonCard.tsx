// components/ui/SkeletonCard.tsx (Lightweight pulsing skeleton with Reanimated)
import React from "react";
import { View, ViewProps } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { cn } from "@/utils/cn";

export const SkeletonCard = React.memo(function SkeletonCard({
  className,
  width = "100%",
  height = 100,
}: ViewProps & { width?: string | number; height?: string | number }) {
  const opacity = useSharedValue(0.5);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  React.useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 800 }),
      -1, // Infinite
      true // Reverse
    );
  }, [opacity]);

  return (
    <Animated.View
      className={cn(
        "bg-neutral-200 dark:bg-neutral-800 rounded-2xl",
        className
      )}
      style={[{ }, animatedStyle]}
    />
  );
});
