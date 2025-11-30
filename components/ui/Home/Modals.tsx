import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { useRef, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Share,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import ViewShot from "react-native-view-shot";

const mockProducts = [
  { id: "1", name: "Rice (50kg)", price: 45000, stock: 20 },
  { id: "2", name: "Beans (50kg)", price: 52000, stock: 15 },
  { id: "3", name: "Garri (50kg)", price: 25000, stock: 30 },
  { id: "4", name: "Palm Oil (25L)", price: 38000, stock: 10 },
  { id: "5", name: "Groundnut Oil (25L)", price: 42000, stock: 8 },
];

export const NotificationModal = ({ visible, onClose, theme }: any) => {
  const notifications = [
    {
      id: "1",
      title: "Low Stock Alert",
      message: "Palm Oil is running low. Only 10 units left.",
      time: "2 hours ago",
      type: "warning",
      icon: "alert-circle",
    },
    {
      id: "2",
      title: "Payment Received",
      message: "₦10,000 received from Ada",
      time: "5 hours ago",
      type: "success",
      icon: "checkmark-circle",
    },
    {
      id: "3",
      title: "Daily Report",
      message: "Your daily sales report is ready",
      time: "1 day ago",
      type: "info",
      icon: "document-text",
    },
  ];

  const getIconColor = (type: string) => {
    switch (type) {
      case "warning":
        return "#F59E0B";
      case "success":
        return "#10B981";
      case "info":
        return "#3B82F6";
      default:
        return "#6B7280";
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.white }}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200">
          <Text
            className="text-2xl font-poppinsBold"
            style={{ color: theme.textPrimary }}
          >
            Notifications
          </Text>
          <Pressable onPress={onClose} className="p-2">
            <Ionicons name="close" size={24} color={theme.textPrimary} />
          </Pressable>
        </View>

        {/* Notifications List */}
        <ScrollView className="flex-1 px-6">
          {notifications.map((notif, index) => (
            <MotiView
              key={notif.id}
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 300, delay: index * 100 }}
              className="flex-row items-start bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 mb-3 mt-3"
            >
              <View
                className="w-12 h-12 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: getIconColor(notif.type) + "20" }}
              >
                <Ionicons
                  name={notif.icon}
                  size={24}
                  color={getIconColor(notif.type)}
                />
              </View>
              <View className="flex-1">
                <Text
                  className="font-poppinsSemiBold text-base mb-1"
                  style={{ color: theme.textPrimary }}
                >
                  {notif.title}
                </Text>
                <Text
                  className="text-sm mb-2 font-poppins"
                  style={{ color: theme.textSecondary }}
                >
                  {notif.message}
                </Text>
                <Text
                  className="text-xs font-poppins"
                  style={{ color: theme.textSecondary }}
                >
                  {notif.time}
                </Text>
              </View>
            </MotiView>
          ))}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

// Record Sale Modal Component
export const RecordSaleModal = ({
  visible,
  onClose,
  theme,
  onSaleRecorded,
}: any) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const resetForm = () => {
    setSelectedProduct(null);
    setQuantity(1);
    setCustomerName("");
    setPaymentMethod("cash");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleRecordSale = () => {
    if (!selectedProduct) {
      Alert.alert("Error", "Please select a product");
      return;
    }

    if (!customerName.trim()) {
      Alert.alert("Error", "Please enter customer name");
      return;
    }

    const total = selectedProduct.price * quantity;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      "Sale Recorded",
      `${quantity}x ${selectedProduct.name} sold for ₦${total.toLocaleString()}`,
      [{ text: "OK", onPress: handleClose }]
    );

    onSaleRecorded?.();
  };

  const incrementQuantity = () => {
    if (selectedProduct && quantity < selectedProduct.stock) {
      setQuantity(quantity + 1);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const total = selectedProduct ? selectedProduct.price * quantity : 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.white }}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200">
          <View className="flex-row items-center">
            <View
              className="w-10 h-10 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: theme.primaryBlue + "20" }}
            >
              <Ionicons name="add-circle" size={24} color={theme.primaryBlue} />
            </View>
            <Text
              className="text-xl font-poppinsBold"
              style={{ color: theme.textPrimary }}
            >
              Record Sale
            </Text>
          </View>
          <Pressable onPress={handleClose} className="p-2">
            <Ionicons name="close" size={24} color={theme.textPrimary} />
          </Pressable>
        </View>

        <ScrollView className="flex-1 px-6 py-6">
          {/* Customer Name */}
          <View className="mb-6">
            <Text
              className="text-sm font-poppinsSemiBold mb-2"
              style={{ color: theme.textPrimary }}
            >
              Customer Name
            </Text>
            <TextInput
              value={customerName}
              onChangeText={setCustomerName}
              placeholder="Enter customer name"
              placeholderTextColor={theme.textSecondary}
              className="border-2 border-gray-200 rounded-2xl px-4 py-4 font-poppins"
              style={{ color: theme.textPrimary }}
            />
          </View>

          {/* Product Selection */}
          <View className="mb-6">
            <Text
              className="text-sm font-poppinsSemiBold mb-2"
              style={{ color: theme.textPrimary }}
            >
              Select Product
            </Text>
            <Pressable
              onPress={() => setShowProductDropdown(!showProductDropdown)}
              className="border-2 border-gray-200 rounded-2xl px-4 py-4 flex-row items-center justify-between"
            >
              <Text
                className="font-poppins"
                style={{
                  color: selectedProduct
                    ? theme.textPrimary
                    : theme.textSecondary,
                }}
              >
                {selectedProduct ? selectedProduct.name : "Choose a product"}
              </Text>
              <Ionicons
                name={showProductDropdown ? "chevron-up" : "chevron-down"}
                size={20}
                color={theme.textSecondary}
              />
            </Pressable>

            {showProductDropdown && (
              <View className="mt-2 border-2 border-gray-200 rounded-2xl overflow-hidden">
                {mockProducts.map((product) => (
                  <Pressable
                    key={product.id}
                    onPress={() => {
                      setSelectedProduct(product);
                      setShowProductDropdown(false);
                      setQuantity(1);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    className="px-4 py-4 border-b border-gray-100 active:bg-gray-50"
                  >
                    <View className="flex-row justify-between items-center">
                      <View>
                        <Text
                          className="font-poppinsSemiBold"
                          style={{ color: theme.textPrimary }}
                        >
                          {product.name}
                        </Text>
                        <Text
                          className="text-xs"
                          style={{ color: theme.textSecondary }}
                        >
                          Stock: {product.stock} units
                        </Text>
                      </View>
                      <Text
                        className="font-poppinsBold"
                        style={{ color: theme.primaryBlue }}
                      >
                        ₦{product.price.toLocaleString()}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          {/* Quantity Selector */}
          {selectedProduct && (
            <View className="mb-6">
              <Text
                className="text-sm font-poppinsSemiBold mb-2"
                style={{ color: theme.textPrimary }}
              >
                Quantity
              </Text>
              <View className="flex-row items-center justify-between bg-gray-100 rounded-2xl p-2">
                <Pressable
                  onPress={decrementQuantity}
                  className="w-12 h-12 rounded-xl items-center justify-center bg-white"
                  style={{ opacity: quantity === 1 ? 0.5 : 1 }}
                  disabled={quantity === 1}
                >
                  <Ionicons name="remove" size={24} color={theme.primaryBlue} />
                </Pressable>
                <Text
                  className="text-2xl font-poppinsBold"
                  style={{ color: theme.textPrimary }}
                >
                  {quantity}
                </Text>
                <Pressable
                  onPress={incrementQuantity}
                  className="w-12 h-12 rounded-xl items-center justify-center bg-white"
                  style={{
                    opacity: quantity >= selectedProduct.stock ? 0.5 : 1,
                  }}
                  disabled={quantity >= selectedProduct.stock}
                >
                  <Ionicons name="add" size={24} color={theme.primaryBlue} />
                </Pressable>
              </View>
              {selectedProduct && (
                <Text
                  className="text-xs mt-2 text-center"
                  style={{ color: theme.textSecondary }}
                >
                  Available: {selectedProduct.stock} units
                </Text>
              )}
            </View>
          )}

          {/* Payment Method */}
          <View className="mb-6">
            <Text
              className="text-sm font-poppinsSemiBold mb-2"
              style={{ color: theme.textPrimary }}
            >
              Payment Method
            </Text>
            <View className="flex-row gap-3">
              {["cash", "transfer", "card"].map((method) => (
                <Pressable
                  key={method}
                  onPress={() => {
                    setPaymentMethod(method);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  className={`flex-1 py-3 rounded-xl border-2 ${
                    paymentMethod === method
                      ? "border-blue-500"
                      : "border-gray-200"
                  }`}
                  style={{
                    backgroundColor:
                      paymentMethod === method
                        ? theme.primaryBlue + "10"
                        : "transparent",
                  }}
                >
                  <Text
                    className="text-center font-poppinsSemiBold capitalize"
                    style={{
                      color:
                        paymentMethod === method
                          ? theme.primaryBlue
                          : theme.textSecondary,
                    }}
                  >
                    {method}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Total */}
          {selectedProduct && (
            <View className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6">
              <View className="flex-row justify-between items-center mb-2">
                <Text
                  className="text-sm font-poppins"
                  style={{ color: theme.textSecondary }}
                >
                  Unit Price
                </Text>
                <Text
                  className="text-sm font-poppinsSemiBold"
                  style={{ color: theme.textPrimary }}
                >
                  ₦{selectedProduct.price.toLocaleString()}
                </Text>
              </View>
              <View className="flex-row justify-between items-center mb-2">
                <Text
                  className="text-sm font-poppins"
                  style={{ color: theme.textSecondary }}
                >
                  Quantity
                </Text>
                <Text
                  className="text-sm font-poppinsSemiBold"
                  style={{ color: theme.textPrimary }}
                >
                  {quantity}
                </Text>
              </View>
              <View className="border-t border-gray-200 dark:border-gray-700 my-3" />
              <View className="flex-row justify-between items-center">
                <Text
                  className="text-lg font-poppinsBold"
                  style={{ color: theme.textPrimary }}
                >
                  Total Amount
                </Text>
                <Text
                  className="text-2xl font-poppinsBold"
                  style={{ color: theme.primaryBlue }}
                >
                  ₦{total.toLocaleString()}
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Footer Button */}
        <View className="px-6 py-4 border-t border-gray-200">
          <Pressable
            onPress={handleRecordSale}
            className="rounded-2xl py-4 items-center"
            style={{
              backgroundColor:
                selectedProduct && customerName.trim()
                  ? theme.primaryBlue
                  : theme.textSecondary,
              opacity: selectedProduct && customerName.trim() ? 1 : 0.5,
            }}
            disabled={!selectedProduct || !customerName.trim()}
          >
            <Text className="text-white text-lg font-poppinsBold">
              Record Sale
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

// Add Expense Modal Component
export const AddExpenseModal = ({
  visible,
  onClose,
  theme,
  onExpenseAdded,
}: any) => {
  const [expenseType, setExpenseType] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  const expenseTypes = [
    { id: "1", name: "Supplies", icon: "cart" },
    { id: "2", name: "Utilities", icon: "flash" },
    { id: "3", name: "Salary", icon: "people" },
    { id: "4", name: "Rent", icon: "home" },
    { id: "5", name: "Transport", icon: "car" },
    { id: "6", name: "Other", icon: "ellipsis-horizontal" },
  ];

  const resetForm = () => {
    setExpenseType("");
    setAmount("");
    setDescription("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleAddExpense = () => {
    if (!expenseType || !amount) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    const numAmount = parseFloat(amount.replace(/,/g, ""));
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      "Expense Added",
      `₦${numAmount.toLocaleString()} expense recorded for ${expenseType}`,
      [{ text: "OK", onPress: handleClose }]
    );

    onExpenseAdded?.();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.white }}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200">
          <View className="flex-row items-center">
            <View
              className="w-10 h-10 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: theme.negative + "20" }}
            >
              <Ionicons name="remove-circle" size={24} color={theme.negative} />
            </View>
            <Text
              className="text-xl font-poppinsBold"
              style={{ color: theme.textPrimary }}
            >
              Add Expense
            </Text>
          </View>
          <Pressable onPress={handleClose} className="p-2">
            <Ionicons name="close" size={24} color={theme.textPrimary} />
          </Pressable>
        </View>

        <ScrollView className="flex-1 px-6 py-6">
          {/* Expense Type */}
          <View className="mb-6">
            <Text
              className="text-sm font-poppinsSemiBold mb-2"
              style={{ color: theme.textPrimary }}
            >
              Expense Type *
            </Text>
            <Pressable
              onPress={() => setShowTypeDropdown(!showTypeDropdown)}
              className="border-2 border-gray-200 rounded-2xl px-4 py-4 flex-row items-center justify-between"
            >
              <Text
                className="font-poppins"
                style={{
                  color: expenseType ? theme.textPrimary : theme.textSecondary,
                }}
              >
                {expenseType || "Select expense type"}
              </Text>
              <Ionicons
                name={showTypeDropdown ? "chevron-up" : "chevron-down"}
                size={20}
                color={theme.textSecondary}
              />
            </Pressable>

            {showTypeDropdown && (
              <View className="mt-2 border-2 border-gray-200 rounded-2xl overflow-hidden">
                {expenseTypes.map((type) => (
                  <Pressable
                    key={type.id}
                    onPress={() => {
                      setExpenseType(type.name);
                      setShowTypeDropdown(false);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    className="px-4 py-4 border-b border-gray-100 flex-row items-center active:bg-gray-50"
                  >
                    <Ionicons
                      name={type.icon}
                      size={20}
                      color={theme.textSecondary}
                      style={{ marginRight: 12 }}
                    />
                    <Text
                      className="font-poppinsSemiBold"
                      style={{ color: theme.textPrimary }}
                    >
                      {type.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          {/* Amount */}
          <View className="mb-6">
            <Text
              className="text-sm font-poppinsSemiBold mb-2"
              style={{ color: theme.textPrimary }}
            >
              Amount *
            </Text>
            <View className="border-2 border-gray-200 rounded-2xl px-4 py-4 flex-row items-center">
              <Text
                className="text-xl font-poppinsBold mr-2"
                style={{ color: theme.textPrimary }}
              >
                ₦
              </Text>
              <TextInput
                value={amount}
                onChangeText={(text) => {
                  const cleaned = text.replace(/[^0-9]/g, "");
                  setAmount(cleaned);
                }}
                placeholder="0.00"
                placeholderTextColor={theme.textSecondary}
                keyboardType="numeric"
                className="flex-1 text-xl font-poppinsBold"
                style={{ color: theme.textPrimary }}
              />
            </View>
          </View>

          {/* Description */}
          <View className="mb-6">
            <Text
              className="text-sm font-poppinsSemiBold mb-2"
              style={{ color: theme.textPrimary }}
            >
              Description (Optional)
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Add a note..."
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={4}
              className="border-2 border-gray-200 rounded-2xl px-4 py-4 font-poppins"
              style={{
                color: theme.textPrimary,
                textAlignVertical: "top",
              }}
            />
          </View>
        </ScrollView>

        {/* Footer Button */}
        <View className="px-6 py-4 border-t border-gray-200">
          <Pressable
            onPress={handleAddExpense}
            className="rounded-2xl py-4 items-center"
            style={{
              backgroundColor:
                expenseType && amount ? theme.negative : theme.textSecondary,
              opacity: expenseType && amount ? 1 : 0.5,
            }}
            disabled={!expenseType || !amount}
          >
            <Text className="text-white text-lg font-poppinsBold">
              Add Expense
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

// Manage Stock Modal Component
export const ManageStockModal = ({
  visible,
  onClose,
  theme,
  onStockUpdated,
}: any) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [action, setAction] = useState("add"); // 'add' or 'remove'
  const [quantity, setQuantity] = useState("");
  const [showProductDropdown, setShowProductDropdown] = useState(false);

  const resetForm = () => {
    setSelectedProduct(null);
    setAction("add");
    setQuantity("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleUpdateStock = () => {
    if (!selectedProduct || !quantity) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const numQuantity = parseInt(quantity);
    if (isNaN(numQuantity) || numQuantity <= 0) {
      Alert.alert("Error", "Please enter a valid quantity");
      return;
    }

    if (action === "remove" && numQuantity > selectedProduct.stock) {
      Alert.alert("Error", "Cannot remove more than available stock");
      return;
    }

    const newStock =
      action === "add"
        ? selectedProduct.stock + numQuantity
        : selectedProduct.stock - numQuantity;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      "Stock Updated",
      `${selectedProduct.name} stock ${action === "add" ? "increased" : "decreased"} by ${numQuantity} units. New stock: ${newStock} units`,
      [{ text: "OK", onPress: handleClose }]
    );

    onStockUpdated?.();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.white }}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200">
          <View className="flex-row items-center">
            <View
              className="w-10 h-10 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: theme.primaryBlue + "20" }}
            >
              <Ionicons
                name="pencil-outline"
                size={24}
                color={theme.primaryBlue}
              />
            </View>
            <Text
              className="text-xl font-poppinsBold"
              style={{ color: theme.textPrimary }}
            >
              Manage Stock
            </Text>
          </View>
          <Pressable onPress={handleClose} className="p-2">
            <Ionicons name="close" size={24} color={theme.textPrimary} />
          </Pressable>
        </View>

        <ScrollView className="flex-1 px-6 py-6">
          {/* Product Selection */}
          <View className="mb-6">
            <Text
              className="text-sm font-poppinsSemiBold mb-2"
              style={{ color: theme.textPrimary }}
            >
              Select Product
            </Text>
            <Pressable
              onPress={() => setShowProductDropdown(!showProductDropdown)}
              className="border-2 border-gray-200 rounded-2xl px-4 py-4 flex-row items-center justify-between"
            >
              <Text
                className="font-poppins"
                style={{
                  color: selectedProduct
                    ? theme.textPrimary
                    : theme.textSecondary,
                }}
              >
                {selectedProduct ? selectedProduct.name : "Choose a product"}
              </Text>
              <Ionicons
                name={showProductDropdown ? "chevron-up" : "chevron-down"}
                size={20}
                color={theme.textSecondary}
              />
            </Pressable>

            {showProductDropdown && (
              <View className="mt-2 border-2 border-gray-200 rounded-2xl overflow-hidden">
                {mockProducts.map((product) => (
                  <Pressable
                    key={product.id}
                    onPress={() => {
                      setSelectedProduct(product);
                      setShowProductDropdown(false);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    className="px-4 py-4 border-b border-gray-100 active:bg-gray-50"
                  >
                    <View className="flex-row justify-between items-center">
                      <View>
                        <Text
                          className="font-poppinsSemiBold"
                          style={{ color: theme.textPrimary }}
                        >
                          {product.name}
                        </Text>
                        <Text
                          className="text-xs"
                          style={{ color: theme.textSecondary }}
                        >
                          Current Stock: {product.stock} units
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          {/* Action Type */}
          <View className="mb-6">
            <Text
              className="text-sm font-poppinsSemiBold mb-2"
              style={{ color: theme.textPrimary }}
            >
              Action
            </Text>
            <View className="flex-row gap-3">
              <Pressable
                onPress={() => {
                  setAction("add");
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                className={`flex-1 py-4 rounded-xl border-2 flex-row items-center justify-center ${
                  action === "add" ? "border-green-500" : "border-gray-200"
                }`}
                style={{
                  backgroundColor:
                    action === "add" ? "#10B98120" : "transparent",
                }}
              >
                <Ionicons
                  name="add-circle"
                  size={20}
                  color={action === "add" ? "#10B981" : theme.textSecondary}
                  style={{ marginRight: 8 }}
                />
                <Text
                  className="font-poppinsSemiBold"
                  style={{
                    color: action === "add" ? "#10B981" : theme.textSecondary,
                  }}
                >
                  Add Stock
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setAction("remove");
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                className={`flex-1 py-4 rounded-xl border-2 flex-row items-center justify-center ${
                  action === "remove" ? "border-red-500" : "border-gray-200"
                }`}
                style={{
                  backgroundColor:
                    action === "remove" ? "#EF444420" : "transparent",
                }}
              >
                <Ionicons
                  name="remove-circle"
                  size={20}
                  color={action === "remove" ? "#EF4444" : theme.textSecondary}
                  style={{ marginRight: 8 }}
                />
                <Text
                  className="font-poppinsSemiBold"
                  style={{
                    color:
                      action === "remove" ? "#EF4444" : theme.textSecondary,
                  }}
                >
                  Remove Stock
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Quantity */}
          <View className="mb-6">
            <Text
              className="text-sm font-poppinsSemiBold mb-2"
              style={{ color: theme.textPrimary }}
            >
              Quantity
            </Text>
            <TextInput
              value={quantity}
              onChangeText={setQuantity}
              placeholder="Enter quantity"
              placeholderTextColor={theme.textSecondary}
              keyboardType="numeric"
              className="border-2 border-gray-200 rounded-2xl px-4 py-4 text-xl font-poppinsBold"
              style={{ color: theme.textPrimary }}
            />
          </View>

          {/* Current Stock Info */}
          {selectedProduct && (
            <View className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6">
              <View className="flex-row justify-between items-center mb-4">
                <Text
                  className="text-sm font-poppins"
                  style={{ color: theme.textSecondary }}
                >
                  Current Stock
                </Text>
                <Text
                  className="text-lg font-poppinsBold"
                  style={{ color: theme.textPrimary }}
                >
                  {selectedProduct.stock} units
                </Text>
              </View>
              {quantity && (
                <>
                  <View className="border-t border-gray-200 dark:border-gray-700 my-3" />
                  <View className="flex-row justify-between items-center">
                    <Text
                      className="text-sm font-poppins"
                      style={{ color: theme.textSecondary }}
                    >
                      New Stock
                    </Text>
                    <Text
                      className="text-lg font-poppinsBold"
                      style={{
                        color:
                          action === "add"
                            ? "#10B981"
                            : action === "remove" &&
                                parseInt(quantity) > selectedProduct.stock
                              ? "#EF4444"
                              : theme.primaryBlue,
                      }}
                    >
                      {action === "add"
                        ? selectedProduct.stock + parseInt(quantity || 0)
                        : selectedProduct.stock - parseInt(quantity || 0)}{" "}
                      units
                    </Text>
                  </View>
                </>
              )}
            </View>
          )}
        </ScrollView>

        {/* Footer Button */}
        <View className="px-6 py-4 border-t border-gray-200">
          <Pressable
            onPress={handleUpdateStock}
            className="rounded-2xl py-4 items-center"
            style={{
              backgroundColor:
                selectedProduct && quantity
                  ? action === "add"
                    ? "#10B981"
                    : "#EF4444"
                  : theme.textSecondary,
              opacity: selectedProduct && quantity ? 1 : 0.5,
            }}
            disabled={!selectedProduct || !quantity}
          >
            <Text className="text-white text-lg font-poppinsBold">
              Update Stock
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

// Send Receipt Modal Component
export const SendReceiptModal = ({ visible, onClose, theme }: any) => {
  const viewShotRef = useRef(null);
  const [receiptData] = useState({
    storeName: "Godswill Store",
    address: "123 Market Street, Ikeja, Lagos",
    phone: "+234 801 234 5678",
    receiptNo: `RCP${Date.now().toString().slice(-8)}`,
    date: new Date().toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    time: new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    items: [
      { name: "Rice (50kg)", qty: 2, price: 45000, total: 90000 },
      { name: "Beans (50kg)", qty: 1, price: 52000, total: 52000 },
    ],
    paymentMethod: "Cash",
    customerName: "Ada Johnson",
  });

  const subtotal = receiptData.items.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.075; // 7.5% VAT
  const total = subtotal + tax;

  const captureReceipt = async () => {
    try {
      const uri = await viewShotRef.current.capture();
      return uri;
    } catch (error) {
      console.error("Error capturing receipt:", error);
      Alert.alert("Error", "Failed to generate receipt image");
      return null;
    }
  };

  const handleShare = async () => {
    // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const uri = await captureReceipt();
      if (!uri) return;

    const result = await Share.share({
      message:
        "Receipt",
    });

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  };

  return (
    //   <SafeAreaProvider>
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.white }}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200">
          <View className="flex-row items-center">
            <View
              className="w-10 h-10 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: theme.primaryBlue + "20" }}
            >
              <Ionicons
                name="receipt-outline"
                size={24}
                color={theme.primaryBlue}
              />
            </View>
            <Text
              className="text-xl font-poppinsBold"
              style={{ color: theme.textPrimary }}
            >
              Send Receipt
            </Text>
          </View>
          <Pressable onPress={onClose} className="p-2">
            <Ionicons name="close" size={24} color={theme.textPrimary} />
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1 px-6 py-12"
        >
          <ViewShot ref={viewShotRef} options={{ format: "png", quality: 0.9 }}>
            <View className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-6 mb-6">
              {/* Store Header */}
              <View className="items-center mb-6 pb-4 border-b border-gray-200">
                <Text className="text-2xl font-poppinsBold text-gray-900">
                  {receiptData.storeName}
                </Text>
                <Text className="text-xs text-gray-600 mt-1">
                  {receiptData.address}
                </Text>
                <Text className="text-xs text-gray-600">
                  Tel: {receiptData.phone}
                </Text>
              </View>

              {/* Receipt Info */}
              <View className="mb-4">
                <View className="flex-row justify-between mb-2">
                  <Text className="text-xs text-gray-600">Receipt No:</Text>
                  <Text className="text-xs font-poppinsSemiBold text-gray-900">
                    {receiptData.receiptNo}
                  </Text>
                </View>
                <View className="flex-row justify-between mb-2">
                  <Text className="text-xs text-gray-600">Date:</Text>
                  <Text className="text-xs text-gray-900">
                    {receiptData.date} {receiptData.time}
                  </Text>
                </View>
                <View className="flex-row justify-between mb-2">
                  <Text className="text-xs text-gray-600">Customer:</Text>
                  <Text className="text-xs font-poppinsSemiBold text-gray-900">
                    {receiptData.customerName}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-xs text-gray-600">Payment:</Text>
                  <Text className="text-xs text-gray-900">
                    {receiptData.paymentMethod}
                  </Text>
                </View>
              </View>

              {/* Items */}
              <View className="border-t border-b border-gray-200 py-3 mb-4">
                <View className="flex-row justify-between mb-2">
                  <Text className="text-xs font-poppinsSemiBold text-gray-900 flex-1">
                    Item
                  </Text>
                  <Text className="text-xs font-poppinsSemiBold text-gray-900 w-12 text-center">
                    Qty
                  </Text>
                  <Text className="text-xs font-poppinsSemiBold text-gray-900 w-20 text-right">
                    Price
                  </Text>
                  <Text className="text-xs font-poppinsSemiBold text-gray-900 w-24 text-right">
                    Total
                  </Text>
                </View>
                {receiptData.items.map((item, index) => (
                  <View key={index} className="flex-row justify-between mb-2">
                    <Text className="text-xs text-gray-700 flex-1">
                      {item.name}
                    </Text>
                    <Text className="text-xs text-gray-700 w-12 text-center">
                      {item.qty}
                    </Text>
                    <Text className="text-xs text-gray-700 w-20 text-right">
                      ₦{item.price.toLocaleString()}
                    </Text>
                    <Text className="text-xs text-gray-700 w-24 text-right">
                      ₦{item.total.toLocaleString()}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Totals */}
              <View className="mb-4">
                <View className="flex-row justify-between mb-2">
                  <Text className="text-sm text-gray-600">Subtotal:</Text>
                  <Text className="text-sm text-gray-900">
                    ₦{subtotal.toLocaleString()}
                  </Text>
                </View>
                <View className="flex-row justify-between mb-2">
                  <Text className="text-sm text-gray-600">VAT (7.5%):</Text>
                  <Text className="text-sm text-gray-900">
                    ₦{tax.toLocaleString()}
                  </Text>
                </View>
                <View className="flex-row justify-between pt-2 border-t border-gray-300">
                  <Text className="text-lg font-poppinsBold text-gray-900">
                    Total:
                  </Text>
                  <Text className="text-lg font-poppinsBold text-gray-900">
                    ₦{total.toLocaleString()}
                  </Text>
                </View>
              </View>

              {/* Footer */}
              <View className="items-center pt-4 border-t border-gray-200">
                <Text className="text-xs text-gray-600 mb-1">
                  Thank you for your patronage!
                </Text>
                <Text className="text-xs text-gray-500">
                  Powered by BizTrack Pro
                </Text>
              </View>
            </View>
          </ViewShot>

          {/* Share Options */}
          <View>
            <Text
              className="text-sm font-poppinsSemiBold mb-3"
              style={{ color: theme.textPrimary }}
            >
              Share Receipt
            </Text>

            {/* <Button onPress={handleShare} title="Share"  /> */}
            <Pressable
              onPress={() => handleShare()}
              className="flex-row items-center bg-green-50 dark:bg-green-900/20 rounded-2xl p-4 mb-20"
            >
              <View className="w-12 h-12 rounded-full items-center justify-center mr-4 flex flex-row">
                <Ionicons name="logo-whatsapp" size={13} color="green" />
                <Ionicons name="logo-facebook" size={12} color="blue" />
                <Ionicons name="logo-instagram" size={12} color="red" />
                <Ionicons name="logo-tiktok" size={12} color="black" />
              </View>
              <View className="flex-1">
                <Text
                  className="font-poppinsSemiBold text-base"
                  style={{ color: theme.textPrimary }}
                >
                  Share Receipt
                  {/* via WhatsApp */}
                </Text>
                <Text
                  className="text-xs"
                  style={{ color: theme.textSecondary }}
                >
                  {`Send Receipt from ${receiptData.storeName} to customer`} .
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.textSecondary}
              />
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
    //   </SafeAreaProvider>
  );
};
