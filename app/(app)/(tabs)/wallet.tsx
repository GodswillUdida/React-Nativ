import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import {
  View,
  Text,
  Pressable,
  Alert,
  Platform,
  TextInput,
  KeyboardAvoidingView,
  FlatList,
  useColorScheme,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import * as LocalAuthentication from "expo-local-authentication";
import * as Haptics from "expo-haptics";
import { MotiView, MotiText } from "moti";
import { Skeleton } from "moti/skeleton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { parse } from "react-native-svg";

// ==================== API SERVICE ====================
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "https://api.yourapp.com";

const walletService = {
  // Fetch wallet balance
  getWalletBalance: async () => {
    // const response = await fetch(`${API_BASE_URL}/wallet/balance`, {
    //   headers: { Authorization: `Bearer ${token}` },
    // });
    // return response.json();

    // Mock data
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      balance: 255000,
      currency: "₦",
      lastUpdated: new Date().toISOString(),
    };
  },

  // Fetch transactions
  getTransactions: async (limit = 10) => {
    // const response = await fetch(`${API_BASE_URL}/wallet/transactions?limit=${limit}`, {
    //   headers: { Authorization: `Bearer ${token}` },
    // });
    // return response.json();

    await new Promise((resolve) => setTimeout(resolve, 800));
    return [
      {
        id: "1",
        title: "POS Payment",
        amount: -8500,
        type: "expense",
        date: "Today, 2:30 PM",
        status: "completed",
        reference: "TXN001234",
      },
      {
        id: "2",
        title: "Transfer from John",
        amount: 20000,
        type: "income",
        date: "Today, 10:15 AM",
        status: "completed",
        reference: "TXN001233",
      },
      {
        id: "3",
        title: "Electricity Bill",
        amount: -6000,
        type: "expense",
        date: "Yesterday, 5:45 PM",
        status: "completed",
        reference: "TXN001232",
      },
    ];
  },

  // Add funds
  addFunds: async (amount: number, method: string) => {
    // const response = await fetch(`${API_BASE_URL}/wallet/add`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    //   body: JSON.stringify({ amount, method }),
    // });
    // return response.json();

    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
      success: true,
      message: "Funds added successfully",
      transactionId: "TXN" + Date.now(),
    };
  },

  // Withdraw funds
  withdrawFunds: async (amount: number, bankAccount: string) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
      success: true,
      message: "Withdrawal initiated",
      transactionId: "TXN" + Date.now(),
    };
  },

  // Transfer funds
  transferFunds: async (amount: number, recipient: string, note?: string) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
      success: true,
      message: "Transfer successful",
      transactionId: "TXN" + Date.now(),
    };
  },

  // Buy airtime
  buyAirtime: async (amount: number, phoneNumber: string, network: string) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
      success: true,
      message: "Airtime purchase successful",
      transactionId: "TXN" + Date.now(),
    };
  },

  // Buy data
  buyData: async (planId: string, phoneNumber: string, network: string) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
      success: true,
      message: "Data purchase successful",
      transactionId: "TXN" + Date.now(),
    };
  },

  // Pay bills
  payBill: async (billType: string, amount: number, reference: string) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
      success: true,
      message: "Bill payment successful",
      transactionId: "TXN" + Date.now(),
    };
  },
};

// ==================== TYPES ====================
interface WalletBalance {
  balance: number;
  currency: string;
  lastUpdated: string;
}

interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  status: string;
  reference: string;
}

type ActionType =
  | "add"
  | "withdraw"
  | "transfer"
  | "airtime"
  | "data"
  | "bills"
  | null;

// ==================== THEME ====================
const BRAND_BLUE = "#2563eb";
const BRAND_DARK = "#1e3a8a";
const BRAND_LIGHT = "#60a5fa";

// ==================== MAIN COMPONENT ====================
export default function WalletScreen() {
  const [authenticated, setAuthenticated] = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [activeAction, setActiveAction] = useState<ActionType>(null);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["75%", "90%"], []);
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const queryClient = useQueryClient();

  const theme = {
    background: colorScheme === "dark" ? "#0F172A" : "#F8FAFC",
    cardBg: colorScheme === "dark" ? "#1E293B" : "#FFFFFF",
    textPrimary: colorScheme === "dark" ? "#F8FAFC" : "#0F172A",
    textSecondary: colorScheme === "dark" ? "#94A3B8" : "#64748B",
    border: colorScheme === "dark" ? "#334155" : "#E2E8F0",
  };

  // ==================== QUERIES ====================
  const {
    data: walletData,
    isLoading: walletLoading,
    refetch: refetchWallet,
  } = useQuery<WalletBalance>({
    queryKey: ["wallet-balance"],
    queryFn: walletService.getWalletBalance,
    enabled: authenticated,
    staleTime: 30000, // 30 seconds
  });

  const {
    data: transactions,
    isLoading: transactionsLoading,
    refetch: refetchTransactions,
  } = useQuery<Transaction[]>({
    queryKey: ["wallet-transactions"],
    queryFn: () => walletService.getTransactions(10),
    enabled: authenticated,
    staleTime: 60000, // 1 minute
  });

  // ==================== AUTHENTICATION ====================
  const authenticate = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      if (!compatible) {
        setAuthenticated(true);
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Unlock Your Wallet",
        fallbackLabel: "Use Passcode",
      });

      if (result.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setAuthenticated(true);
      }
    } catch (error) {
      Alert.alert("Authentication Failed", "Please try again.");
    }
  };

  useEffect(() => {
    authenticate();
  }, []);

  // ==================== HANDLERS ====================
  const toggleBalanceVisibility = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setBalanceVisible(!balanceVisible);
  };

  const openSheet = (action: ActionType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setActiveAction(action);
    bottomSheetRef.current?.present();
  };

  const closeSheet = () => {
    bottomSheetRef.current?.dismiss();
    setActiveAction(null);
  };

  const handleRefresh = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await Promise.all([refetchWallet(), refetchTransactions()]);
  };

  // ==================== RENDER LOADING ====================
  if (!authenticated) {
    return (
      <View
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: theme.background }}
      >
        <Ionicons name="lock-closed" size={48} color={BRAND_BLUE} />
        <Text className="mt-4 text-lg" style={{ color: theme.textSecondary }}>
          Authenticating...
        </Text>
      </View>
    );
  }

  // ==================== RENDER MAIN UI ====================
  return (
    <BottomSheetModalProvider>
      <View
        className="flex-1"
        style={{ backgroundColor: theme.background, paddingTop: insets.top }}
      >
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Header */}
          <View className="px-6 py-4 flex-row justify-between items-center">
            <View>
              <Text className="text-sm font-poppinsSemiBold" style={{ color: theme.textSecondary }}>
                My Wallet
              </Text>
              <Text
                className="text-2xl font-poppins mt-1"
                style={{ color: theme.textPrimary }}
              >
                Digital Wallet
              </Text>
            </View>
            <Pressable
              onPress={handleRefresh}
              className="p-2 rounded-full"
              style={{ backgroundColor: theme.cardBg }}
            >
              <Ionicons name="refresh" size={24} color={BRAND_BLUE} />
            </Pressable>
          </View>

          {/* Wallet Balance Card */}
          <MotiView
            from={{ opacity: 0, translateY: 30 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 700 }}
            className="mx-6 mt-4 rounded-3xl overflow-hidden shadow-xl"
          >
            <LinearGradient
              colors={[BRAND_BLUE, BRAND_DARK]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="p-6"
            >
              <View className="flex-row justify-between items-start mb-8">
                <View>
                  <Text className="text-white/80 text-sm font-poppinsSemiBold mb-2">
                    Available Balance
                  </Text>
                  {walletLoading ? (
                    <Skeleton
                      colorMode="light"
                      height={40}
                      width={200}
                      radius="round"
                    />
                  ) : (
                    <View className="flex-row items-center">
                      <Text className="text-white text-4xl font-poppins">
                        {balanceVisible
                          ? `${walletData?.currency || "₦"}${walletData?.balance.toLocaleString() || "0"}`
                          : "••••••"}
                      </Text>
                      <Pressable
                        onPress={toggleBalanceVisibility}
                        className="ml-3 p-2"
                      >
                        <Ionicons
                          name={
                            balanceVisible ? "eye-outline" : "eye-off-outline"
                          }
                          size={24}
                          color="white"
                        />
                      </Pressable>
                    </View>
                  )}
                </View>
                <MaterialCommunityIcons
                  name="wallet"
                  size={40}
                  color="white"
                  style={{ opacity: 0.3 }}
                />
              </View>

              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-white/70 text-xs font-poppins">Card Number</Text>
                  <Text className="text-white text-sm font-poppins mt-1">
                    •••• •••• •••• 1234
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="text-white/70 text-xs font-poppins">Expires</Text>
                  <Text className="text-white text-sm mt-1 font-poppins">12/28</Text>
                </View>
              </View>
            </LinearGradient>
          </MotiView>

          {/* Quick Actions - Primary */}
          <View className="px-6 mt-6">
            <Text
              className="text-lg font-poppinsSemiBold mb-4"
              style={{ color: theme.textPrimary }}
            >
              Quick Actions
            </Text>
            <View className="flex-row justify-between">
              {[
                {
                  icon: "add-circle",
                  label: "Add Funds",
                  action: "add" as const,
                  color: "#10B981",
                },
                {
                  icon: "arrow-down-circle",
                  label: "Withdraw",
                  action: "withdraw" as const,
                  color: "#EF4444",
                },
                {
                  icon: "swap-horizontal",
                  label: "Transfer",
                  action: "transfer" as const,
                  color: "#3B82F6",
                },
              ].map((btn, index) => (
                <MotiView
                  key={btn.label}
                  from={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", delay: index * 100 }}
                  className="flex-1 mx-1"
                >
                  <Pressable
                    onPress={() => openSheet(btn.action)}
                    className="items-center rounded-2xl p-4"
                    style={{ backgroundColor: theme.cardBg }}
                  >
                    <View
                      className="w-14 h-14 rounded-full items-center justify-center mb-2"
                      style={{ backgroundColor: btn.color + "20" }}
                    >
                      <Ionicons name={btn.icon} size={28} color={btn.color} />
                    </View>
                    <Text
                      className="text-xs text-center font-poppins"
                      style={{ color: theme.textPrimary }}
                    >
                      {btn.label}
                    </Text>
                  </Pressable>
                </MotiView>
              ))}
            </View>
          </View>

          {/* Services - Secondary Actions */}
          <View className="px-6 mt-6">
            <Text
              className="text-lg font-poppinsSemiBold mb-4"
              style={{ color: theme.textPrimary }}
            >
              Services
            </Text>
            <View className="flex-row flex-wrap justify-between">
              {[
                {
                  icon: "call",
                  label: "Airtime",
                  action: "airtime" as const,
                  color: "#8B5CF6",
                },
                {
                  icon: "wifi",
                  label: "Data",
                  action: "data" as const,
                  color: "#F59E0B",
                },
                {
                  icon: "receipt",
                  label: "Bills",
                  action: "bills" as const,
                  color: "#EC4899",
                },
                {
                  icon: "business",
                  label: "To Bank",
                  action: "withdraw" as const,
                  color: "#06B6D4",
                },
              ].map((btn, index) => (
                <MotiView
                  key={btn.label}
                  from={{ opacity: 0, translateY: 20 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ type: "timing", delay: 300 + index * 100 }}
                  className="w-[48%] mb-3"
                >
                  <Pressable
                    onPress={() => openSheet(btn.action)}
                    className="flex-row items-center rounded-2xl p-4"
                    style={{ backgroundColor: theme.cardBg }}
                  >
                    <View
                      className="w-12 h-12 rounded-xl items-center justify-center mr-3"
                      style={{ backgroundColor: btn.color + "20" }}
                    >
                      <Ionicons name={btn.icon} size={24} color={btn.color} />
                    </View>
                    <Text
                      className="text-sm font-poppins flex-1"
                      style={{ color: theme.textPrimary }}
                    >
                      {btn.label}
                    </Text>
                  </Pressable>
                </MotiView>
              ))}
            </View>
          </View>

          {/* Recent Transactions */}
          <View className="px-6 mt-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text
                className="text-lg font-poppinsSemiBold"
                style={{ color: theme.textPrimary }}
              >
                Recent Transactions
              </Text>
              <Pressable className="flex flex-row gap-x-1 border p-2 rounded-lg border-blue-700">
                <Text
                  className="text-sm font-poppins"
                  style={{ color: BRAND_BLUE }}
                >
                  View All
                </Text>
                <MaterialIcons name="arrow-forward" size={17} color="blue" />
              </Pressable>
            </View>

            {transactionsLoading ? (
              <View className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton
                    key={i}
                    colorMode={colorScheme === "dark" ? "dark" : "light"}
                    height={80}
                    width="100%"
                    radius="round"
                  />
                ))}
              </View>
            ) : (
              <View>
                {transactions?.map((item, index) => (
                  <MotiView
                    key={item.id}
                    from={{ opacity: 0, translateX: -20 }}
                    animate={{ opacity: 1, translateX: 0 }}
                    transition={{ type: "timing", delay: index * 100 }}
                    className="rounded-2xl p-4 mb-3"
                    style={{ backgroundColor: theme.cardBg }}
                  >
                    <View className="flex-row justify-between items-center">
                      <View className="flex-row items-center flex-1">
                        <View
                          className="w-12 h-12 rounded-full items-center justify-center mr-3"
                          style={{
                            backgroundColor:
                              item.type === "income"
                                ? "#10B98120"
                                : "#EF444420",
                          }}
                        >
                          <Ionicons
                            name={
                              item.type === "income" ? "arrow-down" : "arrow-up"
                            }
                            size={20}
                            color={
                              item.type === "income" ? "#10B981" : "#EF4444"
                            }
                          />
                        </View>
                        <View className="flex-1">
                          <Text
                            className="font-poppinsSemiBold text-base"
                            style={{ color: theme.textPrimary }}
                          >
                            {item.title}
                          </Text>
                          <Text
                            className="text-xs mt-1 font-poppins"
                            style={{ color: theme.textSecondary }}
                          >
                            {item.date}
                          </Text>
                        </View>
                      </View>
                      <Text
                        className={`font-poppinsSemiBold text-lg ${
                          item.type === "income"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {item.amount > 0 ? "+" : ""}₦
                        {Math.abs(item.amount).toLocaleString()}
                      </Text>
                    </View>
                  </MotiView>
                ))}
              </View>
            )}
          </View>
        </ScrollView>

        {/* Bottom Sheet Modal */}
        <BottomSheetModal
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          enablePanDownToClose
          backgroundStyle={{ backgroundColor: theme.cardBg }}
          handleIndicatorStyle={{ backgroundColor: theme.border }}
        >
          <ActionBottomSheet
            action={activeAction}
            onClose={closeSheet}
            theme={theme}
            onSuccess={() => {
              closeSheet();
              handleRefresh();
            }}
          />
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
}

// ==================== ACTION BOTTOM SHEET ====================
interface ActionBottomSheetProps {
  action: ActionType;
  onClose: () => void;
  theme: any;
  onSuccess: () => void;
}

const ActionBottomSheet: React.FC<ActionBottomSheetProps> = ({
  action,
  onClose,
  theme,
  onSuccess,
}) => {
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [network, setNetwork] = useState("");
  const [selectedBill, setSelectedBill] = useState("");
  const [note, setNote] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const getActionConfig = () => {
    switch (action) {
      case "add":
        return {
          title: "Add Funds",
          icon: "add-circle",
          color: "#10B981",
          buttonText: "Add Funds",
        };
      case "withdraw":
        return {
          title: "Withdraw to Bank",
          icon: "arrow-down-circle",
          color: "#EF4444",
          buttonText: "Withdraw",
        };
      case "transfer":
        return {
          title: "Transfer Funds",
          icon: "swap-horizontal",
          color: "#3B82F6",
          buttonText: "Transfer",
        };
      case "airtime":
        return {
          title: "Buy Airtime",
          icon: "call",
          color: "#8B5CF6",
          buttonText: "Buy Airtime",
        };
      case "data":
        return {
          title: "Buy Data",
          icon: "wifi",
          color: "#F59E0B",
          buttonText: "Buy Data",
        };
      case "bills":
        return {
          title: "Pay Bills",
          icon: "receipt",
          color: "#EC4899",
          buttonText: "Pay Bill",
        };
      default:
        return {
          title: "",
          icon: "help-circle",
          color: "#6B7280",
          buttonText: "Submit",
        };
    }
  };

  const config = getActionConfig();

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    setIsProcessing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      let result;

      switch (action) {
        case "add":
          result = await walletService.addFunds(parseFloat(amount), "card");
          break;
        case "withdraw":
          if (!recipient) {
            Alert.alert("Error", "Please enter bank account");
            setIsProcessing(false);
            return;
          }
          result = await walletService.withdrawFunds(
            parseFloat(amount),
            recipient
          );
          break;
        case "transfer":
          if (!recipient) {
            Alert.alert("Error", "Please enter recipient");
            setIsProcessing(false);
            return;
          }
          result = await walletService.transferFunds(
            parseFloat(amount),
            recipient,
            note
          );
          break;
        case "airtime":
          if (!phoneNumber || !network) {
            Alert.alert("Error", "Please fill all fields");
            setIsProcessing(false);
            return;
          }
          result = await walletService.buyAirtime(
            parseFloat(amount),
            phoneNumber,
            network
          );
          break;
        case "data":
          if (!phoneNumber || !network) {
            Alert.alert("Error", "Please fill all fields");
            setIsProcessing(false);
            return;
          }
          result = await walletService.buyData("plan-id", phoneNumber, network);
          break;
        case "bills":
          if (!selectedBill) {
            Alert.alert("Error", "Please select a bill");
            setIsProcessing(false);
            return;
          }
          result = await walletService.payBill(
            selectedBill,
            parseFloat(amount),
            "ref"
          );
          break;
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Success", result.message, [
        {
          text: "OK",
          onPress: () => {
            queryClient.invalidateQueries({ queryKey: ["wallet-balance"] });
            queryClient.invalidateQueries({
              queryKey: ["wallet-transactions"],
            });
            onSuccess();
          },
        },
      ]);
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", "Transaction failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <BottomSheetScrollView className="flex-1 px-6 ">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center">
            <View
              className="w-12 h-12 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: config.color + "20" }}
            >
              <Ionicons name={config.icon} size={24} color={config.color} />
            </View>
            <Text
              className="text-2xl font-bold"
              style={{ color: theme.textPrimary }}
            >
              {config.title}
            </Text>
          </View>
        </View>

        {/* Amount Input */}
        <View className="mb-4">
          <Text
            className="text-sm font-poppins mb-2"
            style={{ color: theme.textPrimary }}
          >
            Amount *
          </Text>
          <View
            className="flex-row items-center border-2 rounded-2xl px-4 py-4"
            style={{ borderColor: amount ? config.color : theme.border }}
          >
            <Text
              className="text-2xl font-poppinsSemiBold mr-2"
              style={{ color: theme.textPrimary }}
            >
              ₦
            </Text>
            <TextInput
              value={amount}
              onChangeText={(text) => setAmount(text.replace(/[^0-9]/g, ""))}
              placeholder="0.00"
              placeholderTextColor={theme.textSecondary}
              keyboardType="numeric"
              className="flex-1 text-2xl font-bold"
              style={{ color: theme.textPrimary }}
            />
          </View>
        </View>

        {/* Conditional Fields */}
        {(action === "withdraw" || action === "transfer") && (
          <View className="mb-4">
            <Text
              className="text-sm font-poppins mb-2"
              style={{ color: theme.textPrimary }}
            >
              {action === "withdraw" ? "Bank Account" : "Recipient"} *
            </Text>
            <TextInput
              value={recipient}
              onChangeText={setRecipient}
              placeholder={
                action === "withdraw"
                  ? "Enter account number"
                  : "Enter recipient ID or email"
              }
              placeholderTextColor={theme.textSecondary}
              className="border-2 rounded-2xl px-4 py-4"
              style={{
                borderColor: theme.border,
                color: theme.textPrimary,
              }}
            />
          </View>
        )}

        {(action === "airtime" || action === "data") && (
          <>
            <View className="mb-4">
              <Text
                className="text-sm font-poppins mb-2"
                style={{ color: theme.textPrimary }}
              >
                Phone Number *
              </Text>
              <TextInput
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="Enter phone number"
                placeholderTextColor={theme.textSecondary}
                keyboardType="phone-pad"
                className="border-2 rounded-2xl px-4 py-4"
                style={{
                  borderColor: theme.border,
                  color: theme.textPrimary,
                }}
              />
            </View>
            <View className="mb-4">
              <Text
                className="text-sm font-poppins mb-2"
                style={{ color: theme.textPrimary }}
              >
                Network *
              </Text>
              <View className="flex-row gap-2">
                {["MTN", "GLO", "Airtel", "9Mobile"].map((net) => (
                  <Pressable
                    key={net}
                    onPress={() => {
                      setNetwork(net);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    className={`flex-1 py-3 rounded-xl border-2 ${
                      network === net ? "" : ""
                    }`}
                    style={{
                      borderColor:
                        network === net ? config.color : theme.border,
                      backgroundColor:
                        network === net ? config.color + "20" : "transparent",
                    }}
                  >
                    <Text
                      className="text-center font-poppins"
                      style={{
                        color:
                          network === net ? config.color : theme.textSecondary,
                      }}
                    >
                      {net}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </>
        )}

        {action === "bills" && (
          <View className="mb-4">
            <Text
              className="text-sm font-poppins mb-2"
              style={{ color: theme.textPrimary }}
            >
              Bill Type *
            </Text>
            <View className="gap-2">
              {[
                { id: "electricity", name: "Electricity", icon: "flash" },
                { id: "water", name: "Water", icon: "water" },
                { id: "internet", name: "Internet", icon: "wifi" },
                { id: "cable", name: "Cable TV", icon: "tv" },
              ].map((bill) => (
                <Pressable
                  key={bill.id}
                  onPress={() => {
                    setSelectedBill(bill.id);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  className={`flex-row items-center p-4 rounded-2xl border-2 ${
                    selectedBill === bill.id ? "" : ""
                  }`}
                  style={{
                    borderColor:
                      selectedBill === bill.id ? config.color : theme.border,
                    backgroundColor:
                      selectedBill === bill.id
                        ? config.color + "20"
                        : "transparent",
                  }}
                >
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                    style={{
                      backgroundColor:
                        selectedBill === bill.id
                          ? config.color + "30"
                          : theme.border,
                    }}
                  >
                    <Ionicons
                      name={bill.icon}
                      size={20}
                      color={
                        selectedBill === bill.id
                          ? config.color
                          : theme.textSecondary
                      }
                    />
                  </View>
                  <Text
                    className="text-base font-semibold"
                    style={{
                      color:
                        selectedBill === bill.id
                          ? config.color
                          : theme.textPrimary,
                    }}
                  >
                    {bill.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Note (Optional) */}
        {action === "transfer" && (
          <View className="mb-4">
            <Text
              className="text-sm font-poppins mb-2"
              style={{ color: theme.textPrimary }}
            >
              Note (Optional)
            </Text>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="Add a note..."
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={3}
              className="border-2 rounded-2xl px-4 py-4"
              style={{
                borderColor: theme.border,
                color: theme.textPrimary,
                textAlignVertical: "top",
              }}
            />
          </View>
        )}

        {/* Summary Card */}
        {amount && parseFloat(amount) > 0 && (
          <View
            className="rounded-2xl p-4 mb-6"
            style={{ backgroundColor: config.color + "10" }}
          >
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-sm" style={{ color: theme.textSecondary }}>
                Transaction Amount
              </Text>
              <Text
                className="text-lg font-poppinsSemiBold"
                style={{ color: theme.textPrimary }}
              >
                ₦{parseFloat(amount).toLocaleString()}
              </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-sm font-poppins" style={{ color: theme.textSecondary }}>
                Transaction Fee
              </Text>
              <Text
                className="text-sm font-poppins"
                style={{ color: theme.textPrimary }}
              >
                ₦{(parseFloat(amount) * 0.001).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
            </View>
          </View>
        )}

        {/* Submit Button */}
        <Pressable
          onPress={handleSubmit}
          disabled={isProcessing || !amount || parseFloat(amount) <= 0}
          className="rounded-2xl py-4 items-center mb-6"
          style={{
            backgroundColor:
              isProcessing || !amount || parseFloat(amount) <= 0
                ? theme.textSecondary + "50"
                : config.color,
            opacity: isProcessing ? 0.7 : 1,
          }}
        >
          {isProcessing ? (
            <View className="flex-row items-center">
              <ActivityIndicator color="white" size="small" />
              <Text className="text-white font-poppinsSemiBold text-lg ml-2">
                Processing...
              </Text>
            </View>
          ) : (
            <Text className="text-white font-poppinsBold text-lg">
              {config.buttonText}
            </Text>
          )}
        </Pressable>

        {/* Security Notice */}
        <View
          className="flex-row items-center p-3 rounded-xl mb-32"
          style={{ backgroundColor: "#F59E0B20" }}
        >
          <Ionicons name="shield-checkmark" size={20} color="#F59E0B" />
          <Text
            className="ml-3 flex-1 text-xs font-poppins"
            style={{ color: theme.textSecondary }}
          >
            All transactions are secured with end-to-end encryption
          </Text>
        </View>
      </BottomSheetScrollView>
    </KeyboardAvoidingView>
  );
};
