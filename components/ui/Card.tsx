// components/ui/Card.tsx (Reusable Card with modern shadow, theme-aware)
import React from "react";
import { View, ViewProps, useColorScheme } from "react-native";
import { cn } from "@/utils/cn"; // Assume class-variance-authority or tailwind-merge

export const Card = React.memo(function Card({
  children,
  className,
  ...props
}: ViewProps) {
  const colorScheme = useColorScheme();
  return (
    <View
      className={cn(
        "bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-4",
        className
      )}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: colorScheme === "dark" ? 0.3 : 0.1,
        shadowRadius: 4,
        elevation: 4, // Android
      }}
      {...props}
    >
      {children}
    </View>
  );
});
