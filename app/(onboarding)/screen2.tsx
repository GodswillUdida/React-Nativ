import { View, Text } from "react-native";

export default function Screen2() {
  return (
    <View className="flex-1 justify-center items-center bg-[#0f2027] px-6">
      <Text className="text-3xl font-bold text-white mb-4">
        Inventory
      </Text>
      <Text className="text-lg text-gray-300 text-center">
        Control Inventory
      </Text>
    </View>
  );
}
