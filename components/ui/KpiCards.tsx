import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import React, { FC } from "react";
import { Text, useColorScheme } from "react-native";

// ---- Types ----
interface KpiCardProps {
  title: string;
  value: string | number;
  symbol?: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  width?: string;
}

// ---- Theme helper ----
function useThemeColors() {
  const colorScheme = useColorScheme();
  return {
    primaryBlue: "#2563EB",
    white: "#FFFFFF",
    textPrimary: colorScheme === "dark" ? "#F9FAFB" : "#111827",
    textSecondary: colorScheme === "dark" ? "#9CA3AF" : "#6B7280",
    cardBg: colorScheme === "dark" ? "#1F2937" : "#FFFFFF",
  };
}

// ---- Presentational KPI Card ----
const KpiCard: FC<KpiCardProps> = ({
  title,
  value,
  symbol,
  icon,
  iconColor = "#2563EB",
  width,
}) => {
  const theme = useThemeColors();

  // Format large numbers with commas
  const formattedValue =
    typeof value === "number" ? value.toLocaleString() : value;

  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 400 }}
      className={`w-${width ? "full" : "48%"} rounded-2xl w-[48%] p-3 shadow-sm mt-3 border-[silver] border`}
      style={{ backgroundColor: theme.cardBg }}
    >
      <Ionicons name={icon} size={24} color={iconColor} />
      <Text
        className="text-sm font-poppinsSemiBold mt-2"
        style={{ color: theme.textSecondary }}
      >
        {title}
      </Text>
      <Text
        className="text-xl font-poppinsBold mt-1"
        style={{ color: theme.textPrimary }}
      >
        {symbol ? `${symbol}${formattedValue}` : `${formattedValue}${" items"}`}
      </Text>
    </MotiView>
  );
};

export default KpiCard;
