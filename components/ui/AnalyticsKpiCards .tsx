import React from "react";
import { View, Text, FlatList } from "react-native";
import { MotiView } from "moti";
import { Feather } from "@expo/vector-icons";

const kpiData = [
  {
    id: "1",
    title: "Total Sales",
    value: "₦1.2M",
    icon: "trending-up",
    color: "#3b82f6",
    bg: "bg-blue-50",
  },
  {
    id: "2",
    title: "Total Expenses",
    value: "₦350K",
    icon: "trending-down",
    color: "#ef4444",
    bg: "bg-red-50",
  },
  {
    id: "3",
    title: "Net Profit",
    value: "₦850K",
    icon: "dollar-sign",
    color: "#10b981",
    bg: "bg-green-50",
  },
  {
    id: "4",
    title: "New Customers",
    value: "120",
    icon: "users",
    color: "#f59e0b",
    bg: "bg-yellow-50",
  },
];

export const AnalyticsKpiCards = () => {
  return (
    <View className="mt-4 mb-6 flex-row flex-wrap">
      <FlatList
        data={kpiData}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: index * 100, type: "timing", duration: 500 }}
            className={`mr-4 ${item.bg} p-4 rounded-2xl w-48 shadow-sm`}
          >
            <View className="flex-row items-center mb-2">
              <Feather name={item.icon as any} size={22} color={item.color} />
              <Text className="ml-2 text-gray-700 text-base font-poppinsSemiBold">
                {item.title}
              </Text>
            </View>
            <Text className="text-2xl font-poppinsBold text-gray-900">
              {item.value}
            </Text>
          </MotiView>
        )}
      />
    </View>
  );
};
