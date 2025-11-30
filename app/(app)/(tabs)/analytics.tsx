// import { AnalyticsKpiCards } from "@/components/ui/AnalyticsKpiCards ";
// import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
// import { MotiView } from "moti";
// import React, { useState, useMemo } from "react";
// import {
//   Dimensions,
//   Pressable,
//   ScrollView,
//   Text,
//   View,
//   useColorScheme,
//   ActivityIndicator,
//   Alert,
//   RefreshControl,
// } from "react-native";
// import { LineChart, BarChart } from "react-native-chart-kit";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import * as Haptics from "expo-haptics";
// import * as FileSystem from "expo-file-system";
// import * as Sharing from "expo-sharing";

// // ==================== API SERVICE ====================
// const API_BASE_URL =
//   process.env.EXPO_PUBLIC_API_URL || "https://api.yourapp.com";

// const analyticsService = {
//   // Fetch analytics data for specific period
//   getAnalytics: async (period: "weekly" | "monthly" | "quarterly") => {
//     // const response = await fetch(`${API_BASE_URL}/analytics?period=${period}`, {
//     //   headers: { Authorization: `Bearer ${token}` },
//     // });
//     // return response.json();

//     await new Promise((resolve) => setTimeout(resolve, 1000));
//     return {
//       period,
//       summary: {
//         totalRevenue: 525000,
//         totalExpenses: 225000,
//         netProfit: 300000,
//         profitMargin: 57.14,
//         orderCount: 156,
//         averageOrderValue: 3365,
//       },
//       dailyPerformance: [
//         {
//           day: "Mon",
//           date: "2024-01-15",
//           sales: 125000,
//           expenses: 48000,
//           profit: 77000,
//         },
//         {
//           day: "Tue",
//           date: "2024-01-16",
//           sales: 98000,
//           expenses: 36000,
//           profit: 62000,
//         },
//         {
//           day: "Wed",
//           date: "2024-01-17",
//           sales: 132000,
//           expenses: 52000,
//           profit: 80000,
//         },
//         {
//           day: "Thu",
//           date: "2024-01-18",
//           sales: 102000,
//           expenses: 49000,
//           profit: 53000,
//         },
//         {
//           day: "Fri",
//           date: "2024-01-19",
//           sales: 68000,
//           expenses: 40000,
//           profit: 28000,
//         },
//       ],
//       topProducts: [
//         {
//           id: "1",
//           rank: 1,
//           name: "Rice (50kg)",
//           units: 45,
//           revenue: 2025000,
//           growth: 12.5,
//         },
//         {
//           id: "2",
//           rank: 2,
//           name: "Beans (50kg)",
//           units: 32,
//           revenue: 1664000,
//           growth: 8.3,
//         },
//         {
//           id: "3",
//           rank: 3,
//           name: "Groundnut Oil",
//           units: 28,
//           revenue: 1176000,
//           growth: -2.1,
//         },
//         {
//           id: "4",
//           rank: 4,
//           name: "Palm Oil",
//           units: 22,
//           revenue: 836000,
//           growth: 5.7,
//         },
//         {
//           id: "5",
//           rank: 5,
//           name: "Garri (50kg)",
//           units: 18,
//           revenue: 450000,
//           growth: 15.2,
//         },
//       ],
//       categoryBreakdown: [
//         {
//           category: "Food Items",
//           revenue: 3200000,
//           percentage: 45,
//           color: "#2563EB",
//         },
//         {
//           category: "Beverages",
//           revenue: 1800000,
//           percentage: 25,
//           color: "#10B981",
//         },
//         {
//           category: "Electronics",
//           revenue: 1400000,
//           percentage: 20,
//           color: "#F59E0B",
//         },
//         {
//           category: "Others",
//           revenue: 700000,
//           percentage: 10,
//           color: "#8B5CF6",
//         },
//       ],
//       revenueComparison: {
//         current: 525000,
//         previous: 480000,
//         growth: 9.38,
//       },
//     };
//   },

//   // Export data as CSV
//   exportCSV: async (period: string) => {
//     await new Promise((resolve) => setTimeout(resolve, 1500));
//     return {
//       success: true,
//       fileUrl: "https://example.com/export.csv",
//       filename: `analytics_${period}_${Date.now()}.csv`,
//     };
//   },

//   // Export data as PDF
//   exportPDF: async (period: string) => {
//     await new Promise((resolve) => setTimeout(resolve, 1500));
//     return {
//       success: true,
//       fileUrl: "https://example.com/export.pdf",
//       filename: `analytics_${period}_${Date.now()}.pdf`,
//     };
//   },
// };

// // ==================== TYPES ====================
// interface AnalyticsData {
//   period: string;
//   summary: {
//     totalRevenue: number;
//     totalExpenses: number;
//     netProfit: number;
//     profitMargin: number;
//     orderCount: number;
//     averageOrderValue: number;
//   };
//   dailyPerformance: Array<{
//     day: string;
//     date: string;
//     sales: number;
//     expenses: number;
//     profit: number;
//   }>;
//   topProducts: Array<{
//     id: string;
//     rank: number;
//     name: string;
//     units: number;
//     revenue: number;
//     growth: number;
//   }>;
//   categoryBreakdown: Array<{
//     category: string;
//     revenue: number;
//     percentage: number;
//     color: string;
//   }>;
//   revenueComparison: {
//     current: number;
//     previous: number;
//     growth: number;
//   };
// }

// type PeriodType = "weekly" | "monthly" | "quarterly";

// // ==================== UTILITY FUNCTIONS ====================
// const formatCurrency = (amount: number): string => {
//   if (amount >= 1000000) {
//     return `₦${(amount / 1000000).toFixed(1)}M`;
//   } else if (amount >= 1000) {
//     return `₦${(amount / 1000).toFixed(0)}K`;
//   }
//   return `₦${amount.toLocaleString()}`;
// };

// const formatPercentage = (value: number): string => {
//   return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
// };

// // ==================== MAIN COMPONENT ====================
// export default function AnalyticsScreen() {
//   const [period, setPeriod] = useState<PeriodType>("weekly");
//   const [isExporting, setIsExporting] = useState(false);
//   const colorScheme = useColorScheme();
//   const queryClient = useQueryClient();
//   const screenWidth = Dimensions.get("window").width;

//   const theme = {
//     background: colorScheme === "dark" ? "#0F172A" : "#F8FAFC",
//     cardBg: colorScheme === "dark" ? "#1E293B" : "#FFFFFF",
//     textPrimary: colorScheme === "dark" ? "#F8FAFC" : "#0F172A",
//     textSecondary: colorScheme === "dark" ? "#94A3B8" : "#64748B",
//     border: colorScheme === "dark" ? "#334155" : "#E2E8F0",
//     primaryBlue: "#2563EB",
//   };

//   const periods: { value: PeriodType; label: string }[] = [
//     { value: "weekly", label: "Weekly" },
//     { value: "monthly", label: "Monthly" },
//     { value: "quarterly", label: "Quarterly" },
//   ];

//   // ==================== QUERIES ====================
//   const {
//     data: analytics,
//     isLoading,
//     refetch,
//     isRefetching,
//   } = useQuery<AnalyticsData>({
//     queryKey: ["analytics", period],
//     queryFn: () => analyticsService.getAnalytics(period),
//     staleTime: 60000, // 1 minute
//   });

//   // ==================== CHART CONFIG ====================
//   const chartConfig = {
//     backgroundGradientFrom: theme.cardBg,
//     backgroundGradientTo: theme.cardBg,
//     color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
//     labelColor: (opacity = 1) => theme.textSecondary,
//     strokeWidth: 3,
//     propsForDots: { r: "6", strokeWidth: "2", stroke: theme.primaryBlue },
//     decimalPlaces: 0,
//   };

//   // ==================== HANDLERS ====================
//   const handlePeriodChange = (newPeriod: PeriodType) => {
//     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
//     setPeriod(newPeriod);
//   };

//   const handleRefresh = async () => {
//     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
//     await refetch();
//   };

//   const handleExport = async (format: "csv" | "pdf") => {
//     try {
//       setIsExporting(true);
//       Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

//       const result =
//         format === "csv"
//           ? await analyticsService.exportCSV(period)
//           : await analyticsService.exportPDF(period);

//       if (result.success) {
//         // In production, download the file from result.fileUrl
//         // const fileUri = `${FileSystem.documentDirectory}${result.filename}`;
//         // await FileSystem.downloadAsync(result.fileUrl, fileUri);
//         // await Sharing.shareAsync(fileUri);

//         Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
//         Alert.alert(
//           "Export Successful",
//           `Your ${format.toUpperCase()} file is ready to download.`,
//           [{ text: "OK" }]
//         );
//       }
//     } catch (error) {
//       Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
//       Alert.alert("Export Failed", "Unable to export data. Please try again.");
//     } finally {
//       setIsExporting(false);
//     }
//   };

//   // ==================== COMPUTED VALUES ====================
//   const chartData = useMemo(() => {
//     if (!analytics) return null;

//     return {
//       labels: analytics.dailyPerformance.map((d) => d.day),
//       datasets: [
//         {
//           data: analytics.dailyPerformance.map((d) => d.sales),
//           color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
//           strokeWidth: 3,
//         },
//         {
//           data: analytics.dailyPerformance.map((d) => d.expenses),
//           color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
//           strokeWidth: 3,
//         },
//       ],
//       legend: ["Sales", "Expenses"],
//     };
//   }, [analytics]);

//   const maxValue = useMemo(() => {
//     if (!analytics) return 35000;
//     const allValues = analytics.dailyPerformance.flatMap((d) => [
//       d.sales,
//       d.expenses,
//     ]);
//     return Math.max(...allValues);
//   }, [analytics]);

//   // ==================== RENDER LOADING ====================
//   if (isLoading) {
//     return (
//       <SafeAreaView
//         className="flex-1 justify-center items-center"
//         style={{ backgroundColor: theme.background }}
//       >
//         <ActivityIndicator size="large" color={theme.primaryBlue} />
//         <Text className="mt-4 text-base" style={{ color: theme.textSecondary }}>
//           Loading analytics...
//         </Text>
//       </SafeAreaView>
//     );
//   }

//   // ==================== RENDER MAIN UI ====================
//   return (
//     <SafeAreaView
//       className="flex-1"
//       style={{ backgroundColor: theme.background }}
//     >
//       <ScrollView
//         className="flex-1"
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingBottom: 100 }}
//         refreshControl={
//           <RefreshControl
//             refreshing={isRefetching}
//             onRefresh={handleRefresh}
//             tintColor={theme.primaryBlue}
//           />
//         }
//       >
//         {/* Header */}
//         <MotiView
//           from={{ opacity: 0, translateY: -20 }}
//           animate={{ opacity: 1, translateY: 0 }}
//           transition={{ type: "timing", duration: 400 }}
//           className="px-6 py-4"
//         >
//           <View className="flex-row justify-between items-center mb-2">
//             <View>
//               <Text className="text-sm" style={{ color: theme.textSecondary }}>
//                 Business Analytics
//               </Text>
//               <Text
//                 className="text-3xl font-bold mt-1"
//                 style={{ color: theme.textPrimary }}
//               >
//                 Dashboard
//               </Text>
//             </View>
//             <View className="flex-row gap-2">
//               <Pressable
//                 onPress={handleRefresh}
//                 className="p-3 rounded-full"
//                 style={{ backgroundColor: theme.cardBg }}
//               >
//                 <Ionicons name="refresh" size={22} color={theme.primaryBlue} />
//               </Pressable>
//               <Pressable
//                 onPress={() => Alert.alert("Filters", "Coming soon!")}
//                 className="p-3 rounded-full"
//                 style={{ backgroundColor: theme.cardBg }}
//               >
//                 <Ionicons name="filter" size={22} color={theme.primaryBlue} />
//               </Pressable>
//             </View>
//           </View>
//         </MotiView>

//         {/* Period Selector */}
//         <MotiView
//           from={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ type: "timing", duration: 400, delay: 100 }}
//           className="px-6 mb-4"
//         >
//           <View
//             className="flex-row rounded-2xl p-1"
//             style={{ backgroundColor: theme.cardBg }}
//           >
//             {periods.map((p) => (
//               <Pressable
//                 key={p.value}
//                 onPress={() => handlePeriodChange(p.value)}
//                 className={`flex-1 py-3 rounded-xl`}
//                 style={{
//                   backgroundColor:
//                     period === p.value ? theme.primaryBlue : "transparent",
//                 }}
//               >
//                 <Text
//                   className="font-bold text-center"
//                   style={{
//                     color: period === p.value ? "white" : theme.textSecondary,
//                   }}
//                 >
//                   {p.label}
//                 </Text>
//               </Pressable>
//             ))}
//           </View>
//         </MotiView>

//         {/* Revenue Comparison Card */}
//         <MotiView
//           from={{ opacity: 0, translateY: 20 }}
//           animate={{ opacity: 1, translateY: 0 }}
//           transition={{ type: "timing", duration: 400, delay: 150 }}
//           className="mx-6 mb-6 rounded-3xl p-6"
//           style={{ backgroundColor: theme.primaryBlue }}
//         >
//           <View className="flex-row justify-between items-start mb-4">
//             <View>
//               <Text className="text-white/80 text-sm mb-2">Total Revenue</Text>
//               <Text className="text-white text-4xl font-bold">
//                 {formatCurrency(analytics?.summary.totalRevenue || 0)}
//               </Text>
//             </View>
//             <View
//               className="px-3 py-2 rounded-full"
//               style={{
//                 backgroundColor:
//                   (analytics?.revenueComparison.growth || 0) > 0
//                     ? "#10B98130"
//                     : "#EF444430",
//               }}
//             >
//               <View className="flex-row items-center">
//                 <Ionicons
//                   name={
//                     (analytics?.revenueComparison.growth || 0) > 0
//                       ? "trending-up"
//                       : "trending-down"
//                   }
//                   size={16}
//                   color={
//                     (analytics?.revenueComparison.growth || 0) > 0
//                       ? "#10B981"
//                       : "#EF4444"
//                   }
//                 />
//                 <Text
//                   className="ml-1 font-bold text-sm"
//                   style={{
//                     color:
//                       (analytics?.revenueComparison.growth || 0) > 0
//                         ? "#10B981"
//                         : "#EF4444",
//                   }}
//                 >
//                   {formatPercentage(analytics?.revenueComparison.growth || 0)}
//                 </Text>
//               </View>
//             </View>
//           </View>
//           <View className="flex-row justify-between">
//             <View>
//               <Text className="text-white/70 text-xs">Current Period</Text>
//               <Text className="text-white text-lg font-bold mt-1">
//                 {formatCurrency(analytics?.revenueComparison.current || 0)}
//               </Text>
//             </View>
//             <View className="items-end">
//               <Text className="text-white/70 text-xs">Previous Period</Text>
//               <Text className="text-white text-lg font-bold mt-1">
//                 {formatCurrency(analytics?.revenueComparison.previous || 0)}
//               </Text>
//             </View>
//           </View>
//         </MotiView>

//         {/* KPI Cards */}
//         <View className="px-6 mb-6">
//           <AnalyticsKpiCards data={analytics?.summary} />
//         </View>

//         {/* Performance Chart */}
//         <MotiView
//           from={{ opacity: 0, translateY: 20 }}
//           animate={{ opacity: 1, translateY: 0 }}
//           transition={{ type: "timing", duration: 400, delay: 200 }}
//           className="mx-6 mb-6 rounded-3xl p-4"
//           style={{ backgroundColor: theme.cardBg }}
//         >
//           <View className="flex-row justify-between items-center mb-4">
//             <Text
//               className="text-xl font-bold"
//               style={{ color: theme.textPrimary }}
//             >
//               Sales vs Expenses
//             </Text>
//             <View className="flex-row gap-3">
//               <View className="flex-row items-center">
//                 <View className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
//                 <Text
//                   className="text-xs"
//                   style={{ color: theme.textSecondary }}
//                 >
//                   Sales
//                 </Text>
//               </View>
//               <View className="flex-row items-center">
//                 <View className="w-3 h-3 rounded-full bg-red-500 mr-2" />
//                 <Text
//                   className="text-xs"
//                   style={{ color: theme.textSecondary }}
//                 >
//                   Expenses
//                 </Text>
//               </View>
//             </View>
//           </View>
//           {chartData && (
//             <LineChart
//               data={chartData}
//               width={screenWidth - 80}
//               height={240}
//               chartConfig={chartConfig}
//               bezier
//               style={{ marginLeft: -15 }}
//               withInnerLines={false}
//               withOuterLines={true}
//               withVerticalLabels={true}
//               withHorizontalLabels={true}
//               formatYLabel={(value) => formatCurrency(parseFloat(value))}
//             />
//           )}
//         </MotiView>

//         {/* Daily Performance Breakdown */}
//         <MotiView
//           from={{ opacity: 0, translateY: 20 }}
//           animate={{ opacity: 1, translateY: 0 }}
//           transition={{ type: "timing", duration: 400, delay: 250 }}
//           className="mx-6 mb-6 rounded-3xl p-6"
//           style={{ backgroundColor: theme.cardBg }}
//         >
//           <Text
//             className="text-xl font-bold mb-4"
//             style={{ color: theme.textPrimary }}
//           >
//             Daily Performance
//           </Text>

//           {analytics?.dailyPerformance.map((item, index) => {
//             const salesWidth = (item.sales / maxValue) * 100;
//             const expenseWidth = (item.expenses / maxValue) * 100;
//             const profitMargin = ((item.profit / item.sales) * 100).toFixed(1);

//             return (
//               <MotiView
//                 key={item.date}
//                 from={{ opacity: 0, translateX: -20 }}
//                 animate={{ opacity: 1, translateX: 0 }}
//                 transition={{
//                   delay: index * 100,
//                   type: "timing",
//                   duration: 300,
//                 }}
//                 className="mb-5"
//               >
//                 <View className="flex-row justify-between items-center mb-2">
//                   <View>
//                     <Text
//                       className="font-bold text-base"
//                       style={{ color: theme.textPrimary }}
//                     >
//                       {item.day}
//                     </Text>
//                     <Text
//                       className="text-xs"
//                       style={{ color: theme.textSecondary }}
//                     >
//                       {item.date}
//                     </Text>
//                   </View>
//                   <View className="items-end">
//                     <Text className="text-green-600 font-bold">
//                       {formatCurrency(item.profit)}
//                     </Text>
//                     <Text
//                       className="text-xs"
//                       style={{ color: theme.textSecondary }}
//                     >
//                       {profitMargin}% margin
//                     </Text>
//                   </View>
//                 </View>

//                 <View
//                   className="h-3 rounded-full overflow-hidden flex-row"
//                   style={{ backgroundColor: theme.border }}
//                 >
//                   <MotiView
//                     from={{ width: "0%" }}
//                     animate={{ width: `${salesWidth}%` }}
//                     transition={{
//                       type: "timing",
//                       duration: 700,
//                       delay: index * 50,
//                     }}
//                     className="h-full bg-blue-500"
//                   />
//                 </View>

//                 <View className="flex-row justify-between mt-2">
//                   <Text
//                     className="text-xs"
//                     style={{ color: theme.textSecondary }}
//                   >
//                     Sales: {formatCurrency(item.sales)}
//                   </Text>
//                   <Text
//                     className="text-xs"
//                     style={{ color: theme.textSecondary }}
//                   >
//                     Expenses: {formatCurrency(item.expenses)}
//                   </Text>
//                 </View>
//               </MotiView>
//             );
//           })}
//         </MotiView>

//         {/* Top Products */}
//         <MotiView
//           from={{ opacity: 0, translateY: 20 }}
//           animate={{ opacity: 1, translateY: 0 }}
//           transition={{ type: "timing", duration: 400, delay: 300 }}
//           className="mx-6 mb-6 rounded-3xl p-6"
//           style={{ backgroundColor: theme.cardBg }}
//         >
//           <View className="flex-row justify-between items-center mb-4">
//             <Text
//               className="text-xl font-bold"
//               style={{ color: theme.textPrimary }}
//             >
//               Top Products
//             </Text>
//             <Pressable>
//               <Text
//                 className="text-sm font-semibold"
//                 style={{ color: theme.primaryBlue }}
//               >
//                 View All
//               </Text>
//             </Pressable>
//           </View>

//           {analytics?.topProducts.map((item, idx) => (
//             <MotiView
//               key={item.id}
//               from={{ opacity: 0, translateX: -20 }}
//               animate={{ opacity: 1, translateX: 0 }}
//               transition={{
//                 delay: idx * 80,
//                 type: "timing",
//                 duration: 300,
//               }}
//               className={`flex-row justify-between items-center py-4 ${
//                 idx < (analytics?.topProducts.length || 0) - 1 ? "border-b" : ""
//               }`}
//               style={{ borderColor: theme.border }}
//             >
//               <View className="flex-row items-center flex-1">
//                 <View
//                   className="w-10 h-10 rounded-full items-center justify-center mr-3"
//                   style={{ backgroundColor: theme.primaryBlue + "20" }}
//                 >
//                   <Text
//                     className="font-bold"
//                     style={{ color: theme.primaryBlue }}
//                   >
//                     #{item.rank}
//                   </Text>
//                 </View>
//                 <View className="flex-1">
//                   <Text
//                     className="font-bold text-base"
//                     style={{ color: theme.textPrimary }}
//                   >
//                     {item.name}
//                   </Text>
//                   <Text
//                     className="text-xs mt-1"
//                     style={{ color: theme.textSecondary }}
//                   >
//                     {item.units} units sold
//                   </Text>
//                 </View>
//               </View>
//               <View className="items-end">
//                 <Text
//                   className="font-bold text-base"
//                   style={{ color: theme.textPrimary }}
//                 >
//                   {formatCurrency(item.revenue)}
//                 </Text>
//                 <View
//                   className="px-2 py-1 rounded-full mt-1"
//                   style={{
//                     backgroundColor:
//                       item.growth > 0 ? "#10B98120" : "#EF444420",
//                   }}
//                 >
//                   <Text
//                     className="text-xs font-bold"
//                     style={{
//                       color: item.growth > 0 ? "#10B981" : "#EF4444",
//                     }}
//                   >
//                     {formatPercentage(item.growth)}
//                   </Text>
//                 </View>
//               </View>
//             </MotiView>
//           ))}
//         </MotiView>

//         {/* Category Breakdown */}
//         <MotiView
//           from={{ opacity: 0, translateY: 20 }}
//           animate={{ opacity: 1, translateY: 0 }}
//           transition={{ type: "timing", duration: 400, delay: 350 }}
//           className="mx-6 mb-6 rounded-3xl p-6"
//           style={{ backgroundColor: theme.cardBg }}
//         >
//           <Text
//             className="text-xl font-bold mb-4"
//             style={{ color: theme.textPrimary }}
//           >
//             Revenue by Category
//           </Text>

//           {analytics?.categoryBreakdown.map((item, idx) => (
//             <View key={idx} className="mb-4">
//               <View className="flex-row justify-between mb-2">
//                 <Text
//                   className="font-semibold"
//                   style={{ color: theme.textPrimary }}
//                 >
//                   {item.category}
//                 </Text>
//                 <Text className="font-bold" style={{ color: item.color }}>
//                   {item.percentage}%
//                 </Text>
//               </View>
//               <View
//                 className="h-3 rounded-full overflow-hidden"
//                 style={{ backgroundColor: theme.border }}
//               >
//                 <MotiView
//                   from={{ width: "0%" }}
//                   animate={{ width: `${item.percentage}%` }}
//                   transition={{
//                     type: "timing",
//                     duration: 800,
//                     delay: idx * 100,
//                   }}
//                   className="h-full"
//                   style={{ backgroundColor: item.color }}
//                 />
//               </View>
//               <Text
//                 className="text-xs mt-1"
//                 style={{ color: theme.textSecondary }}
//               >
//                 {formatCurrency(item.revenue)}
//               </Text>
//             </View>
//           ))}
//         </MotiView>

//         {/* Export Buttons */}
//         <MotiView
//           from={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ type: "timing", duration: 400, delay: 400 }}
//           className="mx-6 mb-8"
//         >
//           <View className="flex-row gap-3">
//             <Pressable
//               onPress={() => handleExport("csv")}
//               disabled={isExporting}
//               className="flex-1 flex-row items-center justify-center py-4 rounded-2xl"
//               style={{
//                 backgroundColor: theme.primaryBlue,
//                 opacity: isExporting ? 0.7 : 1,
//               }}
//             >
//               {isExporting ? (
//                 <ActivityIndicator color="white" />
//               ) : (
//                 <>
//                   <Ionicons name="download-outline" size={20} color="white" />
//                   <Text className="text-white font-bold ml-2">Export CSV</Text>
//                 </>
//               )}
//             </Pressable>

//             <Pressable
//               onPress={() => handleExport("pdf")}
//               disabled={isExporting}
//               className="flex-1 flex-row items-center justify-center py-4 rounded-2xl border-2"
//               style={{
//                 borderColor: theme.primaryBlue,
//                 opacity: isExporting ? 0.7 : 1,
//               }}
//             >
//               {isExporting ? (
//                 <ActivityIndicator color={theme.primaryBlue} />
//               ) : (
//                 <>
//                   <Ionicons
//                     name="document-text-outline"
//                     size={20}
//                     color={theme.primaryBlue}
//                   />
//                   <Text
//                     className="font-bold ml-2"
//                     style={{ color: theme.primaryBlue }}
//                   >
//                     Export PDF
//                   </Text>
//                 </>
//               )}
//             </Pressable>
//           </View>
//         </MotiView>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }
