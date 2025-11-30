import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

export default function QuickAction({
  icon,
  label,
  color,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="items-center active:opacity-70 w-[25%] mt-3 rounded-lg p-1"
    >
      <View className="p-4 rounded-full" style={{ backgroundColor: color }}>
        <Ionicons name={icon} size={24} color="white" />
      </View>
      <Text
        className="text-xs mt-2 font-poppins text-center"
        style={{ color: "#111827" }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
