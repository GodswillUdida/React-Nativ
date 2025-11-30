import KpiCards from "@/components/ui/KpiCards";
import { useAuth } from "@/providers/AuthProvider";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { MotiText, MotiView } from "moti";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import * as Sharing from "expo-sharing";
// import ViewShot from "react-native-view-shot";
import {
  AddExpenseModal,
  ManageStockModal,
  NotificationModal,
  RecordSaleModal,
  SendReceiptModal,
} from "@/components/ui/Home/Modals";
import QuickAction from "@/components/ui/Home/Action";

// Mock products data

const fetchDashboardData = async () => {
  return {
    balance: 250000,
    sales: 80000,
    expenses: 30000,
    invoices: 15000,
    lowStock: 5,
    symbol: "₦",
    profit: 50000,
    transactionsCount: 124,
    recentTransactions: [
      {
        id: "1",
        title: "Payment from Ada",
        amount: 10000,
        type: "income",
        date: "Today",
      },
      {
        id: "2",
        title: "Bought Supplies",
        amount: -3500,
        type: "expense",
        date: "Yesterday",
      },
      {
        id: "3",
        title: "Payment from Uche",
        amount: 22000,
        type: "income",
        date: "2 days ago",
      },
    ],
  };
};

// Notification Modal Component

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const firstName = user?.name?.split(" ")[0] ?? "User";
  const colorScheme = useColorScheme();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modal states
  const [notificationModalVisible, setNotificationModalVisible] =
    useState(false);
  const [recordSaleModalVisible, setRecordSaleModalVisible] = useState(false);
  const [addExpenseModalVisible, setAddExpenseModalVisible] = useState(false);
  const [manageStockModalVisible, setManageStockModalVisible] = useState(false);
  const [sendReceiptModalVisible, setSendReceiptModalVisible] = useState(false);

  const theme = {
    primaryBlue: "#2563EB",
    white: colorScheme === "dark" ? "#111827" : "#FFFFFF",
    textPrimary: colorScheme === "dark" ? "#F9FAFB" : "#111827",
    textSecondary: colorScheme === "dark" ? "#9CA3AF" : "#6B7280",
    positive: "#10B981",
    negative: "#EF4444",
    cardBg: colorScheme === "dark" ? "#1F2937" : "#FFFFFF",
  };

  const { data, refetch } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboardData,
    staleTime: 5 * 60 * 1000,
  });

  const greeting = useCallback(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  }, [refetch]);

  const handleQuickAction = (action: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    switch (action) {
      case "Record Sale":
        setRecordSaleModalVisible(true);
        break;
      case "Add Expense":
        setAddExpenseModalVisible(true);
        break;
      case "Manage Stocks":
        setManageStockModalVisible(true);
        break;
      case "Send Receipt":
        setSendReceiptModalVisible(true);
        break;
    }
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: theme.white }}>
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={theme.primaryBlue}
          />
        }
      >
        {/* Modern Header with User Image & Notification */}
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 600 }}
          className="mt-3 flex-row items-center justify-between"
        >
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              // router.push("/profile");
            }}
            className="flex-row items-center active:opacity-70"
          >
            <Image
              source={{
                uri:
                  user?.avatar ||
                  "https://instagram.flos2-2.fna.fbcdn.net/v/t51.2885-19/539605569_17848265964548323_6690144778166017305_n.jpg?stp=dst-jpg_s150x150_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby44NDAuYzIifQ&_nc_ht=instagram.flos2-2.fna.fbcdn.net&_nc_cat=107&_nc_oc=Q6cZ2QH1_dw9F6eiMq2Vphad17z5UFwR5LB2MYSgKkpVLjST2c1pm7E1Q0sUxHgah6FdkN8&_nc_ohc=IkYSWJJ3SfUQ7kNvwFM9Fpl&_nc_gid=4vyowAGF4VxOXr8lxbTTRw&edm=AP4sbd4BAAAA&ccb=7-5&oh=00_AfcO53uly-qLYLpU0Iq0T-HpwcJj4oZFycNb7T5vo3t6aQ&oe=68FDD8E2&_nc_sid=7a9f4b",
              }}
              className="w-12 h-12 rounded-full mr-2 bg-slate-400"
            />
            <View>
              <MotiText
                className="text-xl font-poppinsSemiBold"
                style={{ color: theme.textPrimary }}
              >
                {greeting()} 👋
              </MotiText>
              <Text
                className="text-md font-poppins"
                style={{ color: theme.textPrimary }}
              >
                {firstName || "Godswill"} Store
              </Text>
            </View>
          </Pressable>
          <View className="flex-row gap-x-4">
            <TouchableOpacity
              className="bg-gray-200 p-1.5 rounded-full active:opacity-70"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setNotificationModalVisible(true);
              }}
            >
              <Ionicons
                name="notifications-outline"
                size={24}
                color={theme.primaryBlue}
              />
            </TouchableOpacity>
            {/* <TouchableOpacity
              className="bg-gray-200 p-1.5 rounded-full active:opacity-70"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push("/(app)/screens/settings");
              }}
            >
              <Ionicons
                name="settings-outline"
                size={24}
                color={theme.primaryBlue}
              />
            </TouchableOpacity> */}
          </View>
        </MotiView>

        {/* Modern KPI Cards with Icons */}
        <View className="flex-row flex-wrap justify-between mt-4">
          <KpiCards
            title="Today's Profit"
            value={data?.profit ?? 0}
            symbol={data?.symbol}
            icon="pricetag-outline"
            iconColor="blue"
            width="full"
          />
          <KpiCards
            title="Sales"
            value={data?.sales ?? 0}
            symbol={data?.symbol}
            icon="trending-up-outline"
            iconColor="blue"
          />
          <KpiCards
            title="Expenses"
            value={data?.expenses ?? 0}
            symbol={data?.symbol}
            icon="trending-down-outline"
            iconColor="red"
          />
          {/* <KpiCards
            title="Low Stock"
            value={data?.lowStock ?? 0}
            icon="alert-circle-outline"
            iconColor="orange"
          /> */}
          {/* <KpiCards
            title="Profit"
            value={data?.profit ?? 0}
            symbol={data?.symbol}
            icon="cash-outline"
            iconColor="#2563EB"
          /> */}
        </View>

        {/* Quick Actions (modern icons, haptic) */}
        <MotiView
          from={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", delay: 300 }}
          className="flex-row justify-between flex-wrap"
        >
          <QuickAction
            icon="add-circle"
            label="Record Sale"
            color={theme.primaryBlue}
            onPress={() => handleQuickAction("Record Sale")}
          />
          <QuickAction
            icon="remove-circle"
            label="Add Expense"
            color={theme.negative}
            onPress={() => handleQuickAction("Add Expense")}
          />
          <QuickAction
            icon="pencil-outline"
            label="Manage Stocks"
            color={theme.primaryBlue}
            onPress={() => handleQuickAction("Manage Stocks")}
          />
          <QuickAction
            icon="receipt-outline"
            label="Send Receipt"
            color={theme.negative}
            onPress={() => handleQuickAction("Send Receipt")}
          />
        </MotiView>

         <KpiCards
            title="Low Stock"
            value={data?.lowStock ?? 0}
            icon="alert-circle-outline"
           iconColor="orange"
           width="full"
          /> 

        {/* Recent Transactions */}
        <View className="mt-8">
          <View className="flex flex-row justify-between mb-3">
            <Text
              className="text-lg font-poppinsBold mb-3"
              style={{ color: theme.textPrimary }}
            >
              Recent Transactions
            </Text>
            <Pressable
              onPress={() => {
                // router.push("/transactions");
              }}
              className="flex flex-row gap-x-1 border p-2 rounded-lg border-blue-700"
            >
              <Text
                className="text-sm font-poppins"
                // style={{ color: BRAND_BLUE }}
              >
                View All
              </Text>
              <MaterialIcons name="arrow-forward" size={17} color="blue" />
            </Pressable>
          </View>
          <FlatList
            data={data?.recentTransactions}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item, index }) => (
              <MotiView
                from={{ opacity: 0, translateY: 15 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{
                  type: "timing",
                  duration: 500,
                  delay: index * 150,
                }}
                className="flex-row justify-between items-center bg-gray-100 dark:bg-neutral-900 rounded-xl p-4 mb-3 shadow-sm"
              >
                <View>
                  <Text
                    className="font-poppinsSemiBold"
                    style={{ color: theme.textPrimary }}
                  >
                    {item.title}
                  </Text>
                  <Text
                    className="text-xs font-poppins"
                    style={{ color: theme.textSecondary }}
                  >
                    {item.date}
                  </Text>
                </View>
                <Text
                  className={`text-base font-poppinsSemiBold ${
                    item.type === "income" ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {item.amount > 0
                    ? `+₦${item.amount.toLocaleString()}`
                    : `₦${Math.abs(item.amount).toLocaleString()}`}
                </Text>
              </MotiView>
            )}
          />
        </View>
      </ScrollView>

      {/* Modals */}
      <NotificationModal
        visible={notificationModalVisible}
        onClose={() => setNotificationModalVisible(false)}
        theme={theme}
      />

      <RecordSaleModal
        visible={recordSaleModalVisible}
        onClose={() => setRecordSaleModalVisible(false)}
        theme={theme}
        onSaleRecorded={refetch}
      />

      <AddExpenseModal
        visible={addExpenseModalVisible}
        onClose={() => setAddExpenseModalVisible(false)}
        theme={theme}
        onExpenseAdded={refetch}
      />

      <ManageStockModal
        visible={manageStockModalVisible}
        onClose={() => setManageStockModalVisible(false)}
        theme={theme}
        onStockUpdated={refetch}
      />

      <SendReceiptModal
        visible={sendReceiptModalVisible}
        onClose={() => setSendReceiptModalVisible(false)}
        theme={theme}
      />
    </SafeAreaView>
  );
}
