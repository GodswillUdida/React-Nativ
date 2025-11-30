import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useState, useMemo } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
  ScrollView,
  Alert,
  useColorScheme,
  ActivityIndicator,
} from "react-native";
import Animated, {
  FadeInDown,
} from "react-native-reanimated";
import { MotiView } from "moti";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";

// ==================== API SERVICE ====================
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "https://api.yourapp.com";

const inventoryService = {
  // Fetch all inventory items
  getInventoryItems: async () => {
    // const response = await fetch(`${API_BASE_URL}/inventory`, {
    //   headers: { Authorization: `Bearer ${token}` },
    // });
    // return response.json();

    await new Promise((resolve) => setTimeout(resolve, 1000));
    return [
      {
        id: "1",
        name: "Rice Bag 50kg",
        quantity: 20,
        price: 45000,
        category: "Food",
        sku: "RICE-001",
      },
      {
        id: "2",
        name: "Coca Cola Crate",
        quantity: 8,
        price: 2500,
        category: "Drinks",
        sku: "COKE-001",
      },
      {
        id: "3",
        name: "Wireless Earphones",
        quantity: 3,
        price: 15000,
        category: "Electronics",
        sku: "ELEC-001",
      },
      {
        id: "4",
        name: "Beans 50kg",
        quantity: 15,
        price: 52000,
        category: "Food",
        sku: "BEAN-001",
      },
      {
        id: "5",
        name: "Groundnut Oil 25L",
        quantity: 12,
        price: 42000,
        category: "Food",
        sku: "OIL-001",
      },
      {
        id: "6",
        name: "Pepsi Crate",
        quantity: 5,
        price: 2400,
        category: "Drinks",
        sku: "PEPS-001",
      },
    ];
  },

  // Add new inventory item
  addInventoryItem: async (item: Omit<InventoryItem, "id">) => {
    // const response = await fetch(`${API_BASE_URL}/inventory`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    //   body: JSON.stringify(item),
    // });
    // return response.json();

    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { ...item, id: Date.now().toString() };
  },

  // Update inventory item
  updateInventoryItem: async (id: string, item: Partial<InventoryItem>) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { id, ...item };
  },

  // Delete inventory item
  deleteInventoryItem: async (id: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { success: true, id };
  },

  // Update quantity (add/subtract)
  updateQuantity: async (id: string, quantity: number) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true, id, quantity };
  },
};

// ==================== TYPES ====================
type InventoryItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  category: string;
  sku?: string;
};

// ==================== UTILITY FUNCTIONS ====================
const getStockStatus = (quantity: number) => {
  if (quantity <= 5) {
    return {
      status: "critical",
      color: "white",
      bgColor: "red",
      icon: "alert-circle",
      label: "Critical",
    };
  } else if (quantity <= 10) {
    return {
      status: "low",
      color: "black",
      bgColor: "yellow",
      icon: "warning",
      label: "Low Stock",
    };
  } else {
    return {
      status: "good",
      color: "white",
      bgColor: "blue",
      icon: "checkmark-circle",
      label: "In Stock",
    };
  }
};

const categories = ["All", "Food", "Drinks", "Electronics"];

// ==================== MAIN COMPONENT ====================
export default function InventoryScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [newItem, setNewItem] = useState({
    id: "",
    name: "",
    quantity: "",
    price: "",
    category: "Food",
    sku: "",
  });
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const queryClient = useQueryClient();

  const theme = {
    background: colorScheme === "dark" ? "#0F172A" : "#F8FAFC",
    cardBg: colorScheme === "dark" ? "#1E293B" : "#FFFFFF",
    textPrimary: colorScheme === "dark" ? "#F8FAFC" : "#0F172A",
    textSecondary: colorScheme === "dark" ? "#94A3B8" : "#64748B",
    border: colorScheme === "dark" ? "#334155" : "#E2E8F0",
    primaryBlue: "#2563EB",
  };

  // ==================== QUERIES ====================
  const {
    data: items = [],
    isLoading,
    refetch,
  } = useQuery<InventoryItem[]>({
    queryKey: ["inventory-items"],
    queryFn: inventoryService.getInventoryItems,
    staleTime: 30000,
  });

  const addItemMutation = useMutation({
    mutationFn: inventoryService.addInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Success", "Item added successfully");
    },
    onError: () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", "Failed to add item");
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: ({ id, item }: { id: string; item: Partial<InventoryItem> }) =>
      inventoryService.updateInventoryItem(id, item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Success", "Item updated successfully");
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: inventoryService.deleteInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      inventoryService.updateQuantity(id, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    },
  });

  // ==================== COMPUTED VALUES ====================
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [items, search, selectedCategory]);

  const totalProducts = items.length;
  const totalValue = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  const criticalStockItems = items.filter((item) => item.quantity <= 5).length;
  const lowStockItems = items.filter(
    (item) => item.quantity > 5 && item.quantity <= 10
  ).length;

  // ==================== HANDLERS ====================
  const resetForm = () => {
    setNewItem({
      id: "",
      name: "",
      quantity: "",
      price: "",
      category: "Food",
      sku: "",
    });
  };

  const addOrUpdateItem = () => {
    if (!newItem.name || !newItem.quantity || !newItem.price) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    const itemData = {
      name: newItem.name,
      quantity: parseInt(newItem.quantity),
      price: parseFloat(newItem.price),
      category: newItem.category,
      sku: newItem.sku || `SKU-${Date.now()}`,
    };

    if (newItem.id) {
      updateItemMutation.mutate({ id: newItem.id, item: itemData });
    } else {
      addItemMutation.mutate(itemData);
    }

    resetForm();
    setModalVisible(false);
  };

  const deleteItem = (id: string, name: string) => {
    Alert.alert("Delete Item", `Are you sure you want to delete "${name}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteItemMutation.mutate(id),
      },
    ]);
  };

  const updateQuantity = (
    id: string,
    currentQuantity: number,
    change: number
  ) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 0) {
      Alert.alert("Error", "Quantity cannot be negative");
      return;
    }
    updateQuantityMutation.mutate({ id, quantity: newQuantity });
  };

  const openEditModal = (item: InventoryItem) => {
    setNewItem({
      id: item.id,
      name: item.name,
      quantity: item.quantity.toString(),
      price: item.price.toString(),
      category: item.category,
      sku: item.sku || "",
    });
    setModalVisible(true);
  };

  // ==================== RENDER ====================
  return (
    <View
      className="flex-1"
      style={{ backgroundColor: theme.background, paddingTop: insets.top }}
    >
      {/* Enhanced Header */}
      <Animated.View
        entering={FadeInDown.duration(400)}
        className="px-6 py-4 border-b-[2px] border-blue-800 rounded-bl-2xl rounded-br-2xl"
      >
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="text-sm font-poppins" style={{ color: theme.textSecondary }}>
              Inventory Management
            </Text>
            <Text
              className="text-3xl font-poppinsSemiBold mt-1"
              style={{ color: theme.textPrimary }}
            >
              Stock Control
            </Text>
          </View>
          <Pressable
            onPress={() => {
              resetForm();
              setModalVisible(true);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }}
            className="rounded-full p-3 shadow-lg"
            style={{ backgroundColor: theme.primaryBlue }}
          >
            <Ionicons name="add" size={28} color="white" />
          </Pressable>
        </View>

        {/* Summary Cards */}
        <View className="flex-row gap-3 mb-4">
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "timing", duration: 400 }}
            className="flex-1 rounded-2xl p-4"
            style={{ backgroundColor: theme.cardBg }}
          >
            <View className="flex-row items-center justify-between mb-2 ">
              <Text
                className="text-xs font-poppins"
                style={{ color: theme.textSecondary }}
              >
                Total Products
              </Text>
              <MaterialCommunityIcons
                name="package-variant"
                size={20}
                color={theme.primaryBlue}
              />
            </View>
            <Text
              className="text-2xl font-poppinsBold"
              style={{ color: theme.textPrimary }}
            >
              {totalProducts}
            </Text>
          </MotiView>

          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "timing", duration: 400, delay: 100 }}
            className="flex-1 rounded-2xl p-4"
            style={{ backgroundColor: theme.cardBg }}
          >
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-xs font-poppins" style={{ color: theme.textSecondary }}>
                Total Value
              </Text>
              <MaterialCommunityIcons
                name="cash-multiple"
                size={20}
                color="#10B981"
              />
            </View>
            <Text className="text-2xl font-poppinsSemiBold text-green-600">
              ₦{totalValue.toLocaleString()}.
            </Text>
          </MotiView>
        </View>

        {/* Stock Alerts */}
        {(criticalStockItems > 0 || lowStockItems > 0) && (
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 400, delay: 200 }}
            className="rounded-2xl p-4 mb-4"
            style={{ backgroundColor: "#FEE2E2" }}
          >
            <View className="flex-row items-center">
              <Ionicons name="alert-circle" size={20} color="#EF4444" />
              <Text className="ml-2 font-poppinsSemiBold text-red-600 flex-1">
                {criticalStockItems > 0 && `${criticalStockItems} critical`}
                {criticalStockItems > 0 && lowStockItems > 0 && ", "}
                {lowStockItems > 0 && `${lowStockItems} low stock`}
                {/* {lowStockItems} */}
              </Text>
            </View>
          </MotiView>
        )}

        {/* Search Bar */}
        {/* <View
          className="flex-row items-center rounded-2xl px-4 py-3 mb-3"
          style={{ backgroundColor: theme.cardBg }}
        >
          <Ionicons name="search" size={20} color={theme.textSecondary} />
          <TextInput
            placeholder="Search inventory..."
            value={search}
            onChangeText={setSearch}
            className="flex-1 ml-3"
            style={{ color: theme.textPrimary }}
            placeholderTextColor={theme.textSecondary}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")}>
              <Ionicons
                name="close-circle"
                size={20}
                color={theme.textSecondary}
              />
            </Pressable>
          )}
        </View> */}

        {/* Category Filter */}
        {/* <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-4"
        >
          {categories.map((cat) => (
            <Pressable
              key={cat}
              onPress={() => {
                setSelectedCategory(cat);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              className={`px-6 py-3 rounded-full mr-2`}
              style={{
                backgroundColor:
                  selectedCategory === cat ? theme.primaryBlue : theme.cardBg,
              }}
            >
              <Text
                className="font-semibold"
                style={{
                  color:
                    selectedCategory === cat ? "white" : theme.textSecondary,
                }}
              >
                {cat}
              </Text>
            </Pressable>
          ))}
        </ScrollView> */}
      </Animated.View>

      {/* Inventory List */}
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={theme.primaryBlue} />
          <Text className="mt-4" style={{ color: theme.textSecondary }}>
            Loading inventory...
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
          renderItem={({ item, index }) => (
            <InventoryCard
              item={item}
              index={index}
              theme={theme}
              onEdit={openEditModal}
              onDelete={deleteItem}
              onUpdateQuantity={updateQuantity}
            />
          )}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center py-20">
              <MaterialCommunityIcons
                name="package-variant-closed"
                size={80}
                color={theme.textSecondary}
              />
              <Text
                className="text-lg mt-4"
                style={{ color: theme.textSecondary }}
              >
                No items found
              </Text>
              <Text
                className="text-sm mt-2"
                style={{ color: theme.textSecondary }}
              >
                Add your first inventory item
              </Text>
            </View>
          }
        />
      )}

      {/* Add/Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1 justify-center items-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <View
            className="w-11/12 rounded-3xl p-6"
            style={{ backgroundColor: theme.cardBg }}
          >
            <View className="flex-row justify-between items-center mb-6">
              <Text
                className="text-2xl font-bold"
                style={{ color: theme.textPrimary }}
              >
                {newItem.id ? "Edit Item" : "Add New Item"}
              </Text>
              <Pressable
                onPress={() => {
                  setModalVisible(false);
                  resetForm();
                }}
                className="p-2"
              >
                <Ionicons name="close" size={24} color={theme.textSecondary} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="mb-4">
                <Text
                  className="text-sm font-semibold mb-2"
                  style={{ color: theme.textPrimary }}
                >
                  Item Name *
                </Text>
                <TextInput
                  placeholder="e.g., Rice Bag 50kg"
                  value={newItem.name}
                  onChangeText={(t) => setNewItem({ ...newItem, name: t })}
                  className="border-2 rounded-2xl px-4 py-3"
                  style={{
                    borderColor: theme.border,
                    color: theme.textPrimary,
                  }}
                  placeholderTextColor={theme.textSecondary}
                />
              </View>

              <View className="flex-row gap-3 mb-4">
                <View className="flex-1">
                  <Text
                    className="text-sm font-semibold mb-2"
                    style={{ color: theme.textPrimary }}
                  >
                    Quantity *
                  </Text>
                  <TextInput
                    placeholder="0"
                    keyboardType="numeric"
                    value={newItem.quantity}
                    onChangeText={(t) =>
                      setNewItem({ ...newItem, quantity: t })
                    }
                    className="border-2 rounded-2xl px-4 py-3"
                    style={{
                      borderColor: theme.border,
                      color: theme.textPrimary,
                    }}
                    placeholderTextColor={theme.textSecondary}
                  />
                </View>

                <View className="flex-1">
                  <Text
                    className="text-sm font-semibold mb-2"
                    style={{ color: theme.textPrimary }}
                  >
                    Price *
                  </Text>
                  <TextInput
                    placeholder="0.00"
                    keyboardType="numeric"
                    value={newItem.price}
                    onChangeText={(t) => setNewItem({ ...newItem, price: t })}
                    className="border-2 rounded-2xl px-4 py-3"
                    style={{
                      borderColor: theme.border,
                      color: theme.textPrimary,
                    }}
                    placeholderTextColor={theme.textSecondary}
                  />
                </View>
              </View>

              <View className="mb-4">
                <Text
                  className="text-sm font-semibold mb-2"
                  style={{ color: theme.textPrimary }}
                >
                  Category *
                </Text>
                <View className="flex-row gap-2">
                  {categories
                    .filter((c) => c !== "All")
                    .map((cat) => (
                      <Pressable
                        key={cat}
                        onPress={() =>
                          setNewItem({ ...newItem, category: cat })
                        }
                        className={`flex-1 py-3 rounded-xl border-2`}
                        style={{
                          borderColor:
                            newItem.category === cat
                              ? theme.primaryBlue
                              : theme.border,
                          backgroundColor:
                            newItem.category === cat
                              ? theme.primaryBlue + "20"
                              : "transparent",
                        }}
                      >
                        <Text
                          className="text-center font-semibold"
                          style={{
                            color:
                              newItem.category === cat
                                ? theme.primaryBlue
                                : theme.textSecondary,
                          }}
                        >
                          {cat}
                        </Text>
                      </Pressable>
                    ))}
                </View>
              </View>

              {/* <View className="mb-6">
                <Text
                  className="text-sm font-semibold mb-2"
                  style={{ color: theme.textPrimary }}
                >
                  SKU (Optional)
                </Text>
                <TextInput
                  placeholder="Auto-generated if empty"
                  value={newItem.sku}
                  onChangeText={(t) => setNewItem({ ...newItem, sku: t })}
                  className="border-2 rounded-2xl px-4 py-3"
                  style={{
                    borderColor: theme.border,
                    color: theme.textPrimary,
                  }}
                  placeholderTextColor={theme.textSecondary}
                />
              </View> */}

              <View className="flex-row gap-3">
                <Pressable
                  onPress={() => {
                    setModalVisible(false);
                    resetForm();
                  }}
                  className="flex-1 py-4 rounded-2xl border-2"
                  style={{ borderColor: theme.border }}
                >
                  <Text
                    className="text-center font-bold"
                    style={{ color: theme.textSecondary }}
                  >
                    Cancel
                  </Text>
                </Pressable>
                <Pressable
                  onPress={addOrUpdateItem}
                  disabled={
                    addItemMutation.isPending || updateItemMutation.isPending
                  }
                  className="flex-1 py-4 rounded-2xl"
                  style={{
                    backgroundColor: theme.primaryBlue,
                    opacity:
                      addItemMutation.isPending || updateItemMutation.isPending
                        ? 0.7
                        : 1,
                  }}
                >
                  {addItemMutation.isPending || updateItemMutation.isPending ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white text-center font-bold">
                      {newItem.id ? "Update Item" : "Add Item"}
                    </Text>
                  )}
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

// ==================== INVENTORY CARD COMPONENT ====================
interface InventoryCardProps {
  item: InventoryItem;
  index: number;
  theme: any;
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: string, name: string) => void;
  onUpdateQuantity: (
    id: string,
    currentQuantity: number,
    change: number
  ) => void;
}

const InventoryCard: React.FC<InventoryCardProps> = ({
  item,
  index,
  theme,
  onEdit,
  onDelete,
  onUpdateQuantity,
}) => {
  const stockStatus = getStockStatus(item.quantity);
  const totalValue = item.quantity * item.price;

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50).springify()}
      className="rounded-2xl p-4 mb-3 shadow-sm"
      style={{ backgroundColor: theme.cardBg }}
    >
      {/* Stock Status Badge */}
      <View
        className="absolute w-4 h-4 top-4 right-4 px-2 py-1.5 rounded-full flex-row items-center"
        style={{ backgroundColor: stockStatus.bgColor }}
      >
        {/* <Ionicons name={stockStatus.icon} size={14} color={stockStatus.color} /> */}
        <Text
          className="text-xs font-bold ml-1"
          style={{ color: stockStatus.color }}
        >
          {/* {stockStatus.label} */}
        </Text>
      </View>

      {/* Item Info */}
      <View className="mb-4 pr-24">
        <Text
          className="text-lg font-bold mb-1"
          style={{ color: theme.textPrimary }}
        >
          {item.name}
        </Text>
        <Text className="text-xs" style={{ color: theme.textSecondary }}>
          ₦{item.price.toLocaleString()} each
        </Text>
        <View className="flex-row items-center mt-2">
          <View
            className="px-2 py-1 rounded-lg"
            style={{ backgroundColor: theme.primaryBlue + "20" }}
          >
            <Text
              className="text-xs font-semibold"
              style={{ color: theme.primaryBlue }}
            >
              {item.category}
            </Text>
          </View>
        </View>
      </View>

      {/* Quantity Controls */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-1">
          <Text className="text-xs mb-1" style={{ color: theme.textSecondary }}>
            Quantity
          </Text>
          <View className="flex-row items-center">
            <Pressable
              onPress={() => {
                onUpdateQuantity(item.id, item.quantity, -1);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              className="w-10 h-10 rounded-xl items-center justify-center"
              style={{ backgroundColor: "#EF444420" }}
              disabled={item.quantity === 0}
            >
              <Ionicons name="remove" size={20} color="#EF4444" />
            </Pressable>

            <View
              className="mx-3 px-4 py-2 rounded-xl min-w-[60px] items-center"
              style={{ backgroundColor: stockStatus.bgColor }}
            >
              <Text
                className="text-xl font-bold"
                style={{ color: stockStatus.color }}
              >
                {item.quantity}
              </Text>
            </View>

            <Pressable
              onPress={() => {
                onUpdateQuantity(item.id, item.quantity, 1);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              className="w-10 h-10 rounded-xl items-center justify-center"
              style={{ backgroundColor: "#10B98120" }}
            >
              <Ionicons name="add" size={20} color="#10B981" />
            </Pressable>
          </View>
        </View>

        <View className="items-end">
          <Text className="text-xs mb-1" style={{ color: theme.textSecondary }}>
            Total Price
          </Text>
          <Text
            className="text-base font-bold"
            style={{ color: theme.textPrimary }}
          >
            ₦{totalValue.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="flex-row gap-2">
        <Pressable
          onPress={() => {
            onEdit(item);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }}
          className="flex-1 flex-row items-center justify-center py-3 rounded-xl"
          style={{ backgroundColor: theme.primaryBlue + "20" }}
        >
          <Ionicons name="pencil" size={18} color={theme.primaryBlue} />
          <Text className="ml-2 font-bold" style={{ color: theme.primaryBlue }}>
            Edit
          </Text>
        </Pressable>

        <Pressable
          onPress={() => {
            onDelete(item.id, item.name);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }}
          className="flex-1 flex-row items-center justify-center py-3 rounded-xl"
          style={{ backgroundColor: "#EF444420" }}
        >
          <Ionicons name="trash" size={18} color="#EF4444" />
          <Text className="ml-2 font-bold text-red-500">Delete</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
};
