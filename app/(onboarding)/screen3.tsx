import { View, Text } from "react-native";

export default function Screen3() {
  return (
    <View className="flex-1 justify-center items-center bg-[#0f2027] px-6">
      <Text className="text-3xl font-bold text-white mb-4">Wallet</Text>
      <Text className="text-lg text-gray-300 text-center">
        Send and receive money
      </Text>
    </View>
  );
}
