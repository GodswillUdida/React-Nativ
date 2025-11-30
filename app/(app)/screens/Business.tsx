// import {
//   View,
//   Text,
//   ScrollView,
//   Pressable,
//   useColorScheme,
//   StatusBar,
//   TextInput,
//   Image,
//   Alert,
//   Modal,
// } from "react-native";
// import React, { useState } from "react";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
// import Animated, {
//   FadeInDown,
//   FadeInUp,
//   useSharedValue,
//   useAnimatedStyle,
//   withSpring,
// } from "react-native-reanimated";
// import * as ImagePicker from "expo-image-picker";
// import * as Haptics from "expo-haptics";
// import * as DocumentPicker from "expo-document-picker";

// const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// // API Service Functions
// const ApiService = {
//   getBusinessProfile: async (userId) => {
//     // Replace with actual API call
//     // const response = await fetch(`/api/business/${userId}`);
//     // return response.json();
//     return new Promise((resolve) => {
//       setTimeout(
//         () =>
//           resolve({
//             id: "business_123",
//             businessName: "Acme Corporation",
//             businessType: "Technology",
//             registrationNumber: "REG-2020-123456",
//             taxId: "TAX-789456123",
//             email: "contact@acmecorp.com",
//             phone: "+1 (555) 987-6543",
//             website: "https://acmecorp.com",
//             address: {
//               street: "456 Business Blvd",
//               city: "San Francisco",
//               state: "CA",
//               zipCode: "94102",
//               country: "United States",
//             },
//             logo: "https://ui-avatars.com/api/?name=Acme+Corporation&size=200&background=3B82F6&color=fff",
//             description:
//               "Leading provider of innovative technology solutions for businesses worldwide.",
//             foundedYear: "2020",
//             employeeCount: "50-100",
//             industry: "Software Development",
//             verified: true,
//             documents: {
//               businessLicense: "business_license_2020.pdf",
//               taxCertificate: "tax_cert_2023.pdf",
//               insuranceCert: null,
//             },
//           }),
//         1000
//       );
//     });
//   },

//   updateBusinessProfile: async (businessId, data) => {
//     // Replace with actual API call
//     // const response = await fetch(`/api/business/${businessId}`, {
//     //   method: 'PATCH',
//     //   headers: { 'Content-Type': 'application/json' },
//     //   body: JSON.stringify(data)
//     // });
//     // return response.json();
//     return new Promise((resolve) => {
//       setTimeout(() => resolve(data), 1500);
//     });
//   },

//   uploadBusinessLogo: async (businessId, imageUri) => {
//     // Replace with actual API call
//     // const formData = new FormData();
//     // formData.append('logo', {
//     //   uri: imageUri,
//     //   type: 'image/jpeg',
//     //   name: 'logo.jpg'
//     // });
//     // const response = await fetch(`/api/business/${businessId}/logo`, {
//     //   method: 'POST',
//     //   body: formData
//     // });
//     // return response.json();
//     return new Promise((resolve) => {
//       setTimeout(() => resolve({ logoUrl: imageUri }), 1500);
//     });
//   },

//   uploadDocument: async (businessId, documentType, fileUri, fileName) => {
//     // Replace with actual API call
//     // const formData = new FormData();
//     // formData.append('document', {
//     //   uri: fileUri,
//     //   type: 'application/pdf',
//     //   name: fileName
//     // });
//     // formData.append('type', documentType);
//     // const response = await fetch(`/api/business/${businessId}/documents`, {
//     //   method: 'POST',
//     //   body: formData
//     // });
//     // return response.json();
//     return new Promise((resolve) => {
//       setTimeout(() => resolve({ documentUrl: fileUri, fileName }), 1500);
//     });
//   },
// };

// // Edit Business Modal
// const EditBusinessModal = ({
//   visible,
//   onClose,
//   businessData,
//   onSave,
//   theme,
// }) => {
//   const [formData, setFormData] = useState({
//     businessName: businessData.businessName,
//     businessType: businessData.businessType,
//     registrationNumber: businessData.registrationNumber,
//     taxId: businessData.taxId,
//     email: businessData.email,
//     phone: businessData.phone,
//     website: businessData.website,
//     description: businessData.description,
//     foundedYear: businessData.foundedYear,
//     employeeCount: businessData.employeeCount,
//     industry: businessData.industry,
//     street: businessData.address.street,
//     city: businessData.address.city,
//     state: businessData.address.state,
//     zipCode: businessData.address.zipCode,
//     country: businessData.address.country,
//   });
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSave = async () => {
//     // Validation
//     if (!formData.businessName || !formData.email) {
//       Alert.alert("Validation Error", "Business name and email are required");
//       return;
//     }

//     if (!formData.email.includes("@")) {
//       Alert.alert("Validation Error", "Please enter a valid email");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       await onSave(formData);
//       Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
//       Alert.alert("Success", "Business profile updated successfully");
//       onClose();
//     } catch (error) {
//       Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
//       Alert.alert(
//         "Error",
//         error.message || "Failed to update business profile"
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Modal
//       visible={visible}
//       animationType="slide"
//       presentationStyle="pageSheet"
//       onRequestClose={onClose}
//     >
//       <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
//         {/* Header */}
//         <View
//           className="flex-row items-center justify-between p-6 border-b"
//           style={{ borderColor: theme.border }}
//         >
//           <Pressable onPress={onClose}>
//             <Ionicons name="close" size={24} color={theme.textPrimary} />
//           </Pressable>
//           <Text
//             style={{ color: theme.textPrimary }}
//             className="text-lg font-semibold"
//           >
//             Edit Business Profile
//           </Text>
//           <View className="w-6" />
//         </View>

//         <ScrollView
//           className="flex-1 px-6 py-4"
//           showsVerticalScrollIndicator={false}
//         >
//           {/* Basic Information */}
//           <Text
//             style={{ color: theme.textPrimary }}
//             className="text-base font-semibold mb-4"
//           >
//             Basic Information
//           </Text>

//           <View className="mb-4">
//             <Text
//               style={{ color: theme.textSecondary }}
//               className="text-sm font-medium mb-2"
//             >
//               Business Name *
//             </Text>
//             <TextInput
//               value={formData.businessName}
//               onChangeText={(text) =>
//                 setFormData({ ...formData, businessName: text })
//               }
//               className="border rounded-xl p-4"
//               style={{
//                 borderColor: theme.border,
//                 backgroundColor: theme.cardBg,
//                 color: theme.textPrimary,
//               }}
//               placeholder="Enter business name"
//               placeholderTextColor={theme.textSecondary}
//             />
//           </View>

//           <View className="mb-4">
//             <Text
//               style={{ color: theme.textSecondary }}
//               className="text-sm font-medium mb-2"
//             >
//               Business Type
//             </Text>
//             <TextInput
//               value={formData.businessType}
//               onChangeText={(text) =>
//                 setFormData({ ...formData, businessType: text })
//               }
//               className="border rounded-xl p-4"
//               style={{
//                 borderColor: theme.border,
//                 backgroundColor: theme.cardBg,
//                 color: theme.textPrimary,
//               }}
//               placeholder="e.g., LLC, Corporation, Partnership"
//               placeholderTextColor={theme.textSecondary}
//             />
//           </View>

//           <View className="mb-4">
//             <Text
//               style={{ color: theme.textSecondary }}
//               className="text-sm font-medium mb-2"
//             >
//               Industry
//             </Text>
//             <TextInput
//               value={formData.industry}
//               onChangeText={(text) =>
//                 setFormData({ ...formData, industry: text })
//               }
//               className="border rounded-xl p-4"
//               style={{
//                 borderColor: theme.border,
//                 backgroundColor: theme.cardBg,
//                 color: theme.textPrimary,
//               }}
//               placeholder="e.g., Software, Retail, Healthcare"
//               placeholderTextColor={theme.textSecondary}
//             />
//           </View>

//           <View className="mb-4">
//             <Text
//               style={{ color: theme.textSecondary }}
//               className="text-sm font-medium mb-2"
//             >
//               Description
//             </Text>
//             <TextInput
//               value={formData.description}
//               onChangeText={(text) =>
//                 setFormData({ ...formData, description: text })
//               }
//               className="border rounded-xl p-4"
//               style={{
//                 borderColor: theme.border,
//                 backgroundColor: theme.cardBg,
//                 color: theme.textPrimary,
//                 textAlignVertical: "top",
//               }}
//               placeholder="Describe your business"
//               placeholderTextColor={theme.textSecondary}
//               multiline
//               numberOfLines={4}
//             />
//           </View>

//           {/* Registration Details */}
//           <Text
//             style={{ color: theme.textPrimary }}
//             className="text-base font-semibold mb-4 mt-4"
//           >
//             Registration Details
//           </Text>

//           <View className="mb-4">
//             <Text
//               style={{ color: theme.textSecondary }}
//               className="text-sm font-medium mb-2"
//             >
//               Registration Number
//             </Text>
//             <TextInput
//               value={formData.registrationNumber}
//               onChangeText={(text) =>
//                 setFormData({ ...formData, registrationNumber: text })
//               }
//               className="border rounded-xl p-4"
//               style={{
//                 borderColor: theme.border,
//                 backgroundColor: theme.cardBg,
//                 color: theme.textPrimary,
//               }}
//               placeholder="Enter registration number"
//               placeholderTextColor={theme.textSecondary}
//             />
//           </View>

//           <View className="mb-4">
//             <Text
//               style={{ color: theme.textSecondary }}
//               className="text-sm font-medium mb-2"
//             >
//               Tax ID / EIN
//             </Text>
//             <TextInput
//               value={formData.taxId}
//               onChangeText={(text) => setFormData({ ...formData, taxId: text })}
//               className="border rounded-xl p-4"
//               style={{
//                 borderColor: theme.border,
//                 backgroundColor: theme.cardBg,
//                 color: theme.textPrimary,
//               }}
//               placeholder="Enter tax ID"
//               placeholderTextColor={theme.textSecondary}
//             />
//           </View>

//           <View className="flex-row mb-4">
//             <View className="flex-1 mr-2">
//               <Text
//                 style={{ color: theme.textSecondary }}
//                 className="text-sm font-medium mb-2"
//               >
//                 Founded Year
//               </Text>
//               <TextInput
//                 value={formData.foundedYear}
//                 onChangeText={(text) =>
//                   setFormData({ ...formData, foundedYear: text })
//                 }
//                 className="border rounded-xl p-4"
//                 style={{
//                   borderColor: theme.border,
//                   backgroundColor: theme.cardBg,
//                   color: theme.textPrimary,
//                 }}
//                 placeholder="2020"
//                 placeholderTextColor={theme.textSecondary}
//                 keyboardType="number-pad"
//               />
//             </View>

//             <View className="flex-1 ml-2">
//               <Text
//                 style={{ color: theme.textSecondary }}
//                 className="text-sm font-medium mb-2"
//               >
//                 Employee Count
//               </Text>
//               <TextInput
//                 value={formData.employeeCount}
//                 onChangeText={(text) =>
//                   setFormData({ ...formData, employeeCount: text })
//                 }
//                 className="border rounded-xl p-4"
//                 style={{
//                   borderColor: theme.border,
//                   backgroundColor: theme.cardBg,
//                   color: theme.textPrimary,
//                 }}
//                 placeholder="1-10"
//                 placeholderTextColor={theme.textSecondary}
//               />
//             </View>
//           </View>

//           {/* Contact Information */}
//           <Text
//             style={{ color: theme.textPrimary }}
//             className="text-base font-semibold mb-4 mt-4"
//           >
//             Contact Information
//           </Text>

//           <View className="mb-4">
//             <Text
//               style={{ color: theme.textSecondary }}
//               className="text-sm font-medium mb-2"
//             >
//               Business Email *
//             </Text>
//             <TextInput
//               value={formData.email}
//               onChangeText={(text) => setFormData({ ...formData, email: text })}
//               className="border rounded-xl p-4"
//               style={{
//                 borderColor: theme.border,
//                 backgroundColor: theme.cardBg,
//                 color: theme.textPrimary,
//               }}
//               placeholder="contact@business.com"
//               placeholderTextColor={theme.textSecondary}
//               keyboardType="email-address"
//               autoCapitalize="none"
//             />
//           </View>

//           <View className="mb-4">
//             <Text
//               style={{ color: theme.textSecondary }}
//               className="text-sm font-medium mb-2"
//             >
//               Business Phone
//             </Text>
//             <TextInput
//               value={formData.phone}
//               onChangeText={(text) => setFormData({ ...formData, phone: text })}
//               className="border rounded-xl p-4"
//               style={{
//                 borderColor: theme.border,
//                 backgroundColor: theme.cardBg,
//                 color: theme.textPrimary,
//               }}
//               placeholder="+1 (555) 000-0000"
//               placeholderTextColor={theme.textSecondary}
//               keyboardType="phone-pad"
//             />
//           </View>

//           <View className="mb-4">
//             <Text
//               style={{ color: theme.textSecondary }}
//               className="text-sm font-medium mb-2"
//             >
//               Website
//             </Text>
//             <TextInput
//               value={formData.website}
//               onChangeText={(text) =>
//                 setFormData({ ...formData, website: text })
//               }
//               className="border rounded-xl p-4"
//               style={{
//                 borderColor: theme.border,
//                 backgroundColor: theme.cardBg,
//                 color: theme.textPrimary,
//               }}
//               placeholder="https://yourbusiness.com"
//               placeholderTextColor={theme.textSecondary}
//               keyboardType="url"
//               autoCapitalize="none"
//             />
//           </View>

//           {/* Business Address */}
//           <Text
//             style={{ color: theme.textPrimary }}
//             className="text-base font-semibold mb-4 mt-4"
//           >
//             Business Address
//           </Text>

//           <View className="mb-4">
//             <Text
//               style={{ color: theme.textSecondary }}
//               className="text-sm font-medium mb-2"
//             >
//               Street Address
//             </Text>
//             <TextInput
//               value={formData.street}
//               onChangeText={(text) =>
//                 setFormData({ ...formData, street: text })
//               }
//               className="border rounded-xl p-4"
//               style={{
//                 borderColor: theme.border,
//                 backgroundColor: theme.cardBg,
//                 color: theme.textPrimary,
//               }}
//               placeholder="123 Business St"
//               placeholderTextColor={theme.textSecondary}
//             />
//           </View>

//           <View className="flex-row mb-4">
//             <View className="flex-1 mr-2">
//               <Text
//                 style={{ color: theme.textSecondary }}
//                 className="text-sm font-medium mb-2"
//               >
//                 City
//               </Text>
//               <TextInput
//                 value={formData.city}
//                 onChangeText={(text) =>
//                   setFormData({ ...formData, city: text })
//                 }
//                 className="border rounded-xl p-4"
//                 style={{
//                   borderColor: theme.border,
//                   backgroundColor: theme.cardBg,
//                   color: theme.textPrimary,
//                 }}
//                 placeholder="City"
//                 placeholderTextColor={theme.textSecondary}
//               />
//             </View>

//             <View className="flex-1 ml-2">
//               <Text
//                 style={{ color: theme.textSecondary }}
//                 className="text-sm font-medium mb-2"
//               >
//                 State
//               </Text>
//               <TextInput
//                 value={formData.state}
//                 onChangeText={(text) =>
//                   setFormData({ ...formData, state: text })
//                 }
//                 className="border rounded-xl p-4"
//                 style={{
//                   borderColor: theme.border,
//                   backgroundColor: theme.cardBg,
//                   color: theme.textPrimary,
//                 }}
//                 placeholder="State"
//                 placeholderTextColor={theme.textSecondary}
//               />
//             </View>
//           </View>

//           <View className="flex-row mb-4">
//             <View className="flex-1 mr-2">
//               <Text
//                 style={{ color: theme.textSecondary }}
//                 className="text-sm font-medium mb-2"
//               >
//                 Zip Code
//               </Text>
//               <TextInput
//                 value={formData.zipCode}
//                 onChangeText={(text) =>
//                   setFormData({ ...formData, zipCode: text })
//                 }
//                 className="border rounded-xl p-4"
//                 style={{
//                   borderColor: theme.border,
//                   backgroundColor: theme.cardBg,
//                   color: theme.textPrimary,
//                 }}
//                 placeholder="12345"
//                 placeholderTextColor={theme.textSecondary}
//                 keyboardType="number-pad"
//               />
//             </View>

//             <View className="flex-1 ml-2">
//               <Text
//                 style={{ color: theme.textSecondary }}
//                 className="text-sm font-medium mb-2"
//               >
//                 Country
//               </Text>
//               <TextInput
//                 value={formData.country}
//                 onChangeText={(text) =>
//                   setFormData({ ...formData, country: text })
//                 }
//                 className="border rounded-xl p-4"
//                 style={{
//                   borderColor: theme.border,
//                   backgroundColor: theme.cardBg,
//                   color: theme.textPrimary,
//                 }}
//                 placeholder="Country"
//                 placeholderTextColor={theme.textSecondary}
//               />
//             </View>
//           </View>
//         </ScrollView>

//         {/* Save Button */}
//         <View className="p-6 border-t" style={{ borderColor: theme.border }}>
//           <Pressable
//             onPress={handleSave}
//             disabled={isLoading}
//             className="rounded-xl p-4 items-center"
//             style={{
//               backgroundColor: isLoading ? theme.textSecondary : "#3B82F6",
//               opacity: isLoading ? 0.7 : 1,
//             }}
//           >
//             {isLoading ? (
//               <View className="flex-row items-center">
//                 <View className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
//                 <Text className="text-white font-semibold">Saving...</Text>
//               </View>
//             ) : (
//               <Text className="text-white text-base font-semibold">
//                 Save Changes
//               </Text>
//             )}
//           </Pressable>
//         </View>
//       </SafeAreaView>
//     </Modal>
//   );
// };

// const Business = () => {
//   const colorScheme = useColorScheme();
//   const isDark = colorScheme === "dark";

//   const [businessData, setBusinessData] = useState({
//     id: "business_123",
//     businessName: "Acme Corporation",
//     businessType: "Technology",
//     registrationNumber: "REG-2020-123456",
//     taxId: "TAX-789456123",
//     email: "contact@acmecorp.com",
//     phone: "+1 (555) 987-6543",
//     website: "https://acmecorp.com",
//     address: {
//       street: "456 Business Blvd",
//       city: "San Francisco",
//       state: "CA",
//       zipCode: "94102",
//       country: "United States",
//     },
//     logo: "https://ui-avatars.com/api/?name=Acme+Corporation&size=200&background=3B82F6&color=fff",
//     description:
//       "Leading provider of innovative technology solutions for businesses worldwide.",
//     foundedYear: "2020",
//     employeeCount: "50-100",
//     industry: "Software Development",
//     verified: true,
//     documents: {
//       businessLicense: "business_license_2020.pdf",
//       taxCertificate: "tax_cert_2023.pdf",
//       insuranceCert: null,
//     },
//   });

//   const [isLoading, setIsLoading] = useState(false);
//   const [editModalVisible, setEditModalVisible] = useState(false);
//   const logoScale = useSharedValue(1);

//   const theme = {
//     background: isDark ? "#0F172A" : "#F8FAFC",
//     cardBg: isDark ? "#1E293B" : "#FFFFFF",
//     textPrimary: isDark ? "#F8FAFC" : "#0F172A",
//     textSecondary: isDark ? "#94A3B8" : "#64748B",
//     border: isDark ? "#334155" : "#E2E8F0",
//   };

//   const animatedLogoStyle = useAnimatedStyle(() => ({
//     transform: [{ scale: logoScale.value }],
//   }));

//   const handleLogoPress = async () => {
//     logoScale.value = withSpring(0.95, {}, () => {
//       logoScale.value = withSpring(1);
//     });

//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== "granted") {
//       Alert.alert(
//         "Permission Required",
//         "Please grant photo library access to change your logo"
//       );
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [1, 1],
//       quality: 0.8,
//     });

//     if (!result.canceled) {
//       setIsLoading(true);
//       try {
//         const response = await ApiService.uploadBusinessLogo(
//           businessData.id,
//           result.assets[0].uri
//         );
//         setBusinessData({ ...businessData, logo: response.logoUrl });
//         Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
//         Alert.alert("Success", "Business logo updated!");
//       } catch (error) {
//         Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
//         Alert.alert("Error", "Failed to upload logo");
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   };

//   const handleUpdateBusiness = async (formData) => {
//     const updatedData = await ApiService.updateBusinessProfile(
//       businessData.id,
//       {
//         businessName: formData.businessName,
//         businessType: formData.businessType,
//         registrationNumber: formData.registrationNumber,
//         taxId: formData.taxId,
//         email: formData.email,
//         phone: formData.phone,
//         website: formData.website,
//         description: formData.description,
//         foundedYear: formData.foundedYear,
//         employeeCount: formData.employeeCount,
//         industry: formData.industry,
//         address: {
//           street: formData.street,
//           city: formData.city,
//           state: formData.state,
//           zipCode: formData.zipCode,
//           country: formData.country,
//         },
//       }
//     );

//     setBusinessData({
//       ...businessData,
//       ...updatedData,
//     });
//   };

//   const handleDocumentUpload = async (documentType) => {
//     try {
//       const result = await DocumentPicker.getDocumentAsync({
//         type: "application/pdf",
//         copyToCacheDirectory: true,
//       });

//       if (result.type === "success" || !result.canceled) {
//         setIsLoading(true);
//         try {
//           const file = result.assets ? result.assets[0] : result;
//           const response = await ApiService.uploadDocument(
//             businessData.id,
//             documentType,
//             file.uri,
//             file.name
//           );

//           setBusinessData({
//             ...businessData,
//             documents: {
//               ...businessData.documents,
//               [documentType]: response.fileName,
//             },
//           });

//           Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
//           Alert.alert("Success", "Document uploaded successfully!");
//         } catch (error) {
//           Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
//           Alert.alert("Error", "Failed to upload document");
//         } finally {
//           setIsLoading(false);
//         }
//       }
//     } catch (error) {
//       console.log("Document picker error:", error);
//     }
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
//       <StatusBar
//         barStyle={isDark ? "light-content" : "dark-content"}
//         backgroundColor={theme.background}
//       />

//       <ScrollView showsVerticalScrollIndicator={false}>
//         {/* Header */}
//         <Animated.View
//           entering={FadeInDown.duration(400)}
//           className="px-6 py-4 flex-row items-center justify-between"
//         >
//           <Text
//             style={{ color: theme.textPrimary }}
//             className="text-2xl font-bold"
//           >
//             Business Profile
//           </Text>
//           <Pressable
//             onPress={() => setEditModalVisible(true)}
//             className="w-10 h-10 rounded-full items-center justify-center"
//             style={{ backgroundColor: theme.cardBg }}
//           >
//             <Ionicons name="create-outline" size={20} color="#3B82F6" />
//           </Pressable>
//         </Animated.View>

//         {/* Business Header Card */}
//         <Animated.View
//           entering={FadeInUp.duration(400).delay(100)}
//           className="mx-6 mb-6"
//         >
//           <View
//             className="rounded-3xl p-6 items-center"
//             style={{ backgroundColor: theme.cardBg }}
//           >
//             {/* Logo */}
//             <AnimatedPressable
//               onPress={handleLogoPress}
//               style={animatedLogoStyle}
//               disabled={isLoading}
//             >
//               <View className="relative">
//                 <Image
//                   source={{ uri: businessData.logo }}
//                   className="w-28 h-28 rounded-2xl"
//                   style={{ backgroundColor: theme.border }}
//                 />
//                 {isLoading && (
//                   <View className="absolute inset-0 rounded-2xl bg-black/50 items-center justify-center">
//                     <View className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                   </View>
//                 )}
//                 <View className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-blue-500 items-center justify-center border-4 border-white dark:border-gray-800">
//                   <Ionicons name="camera" size={16} color="white" />
//                 </View>
//                 {businessData.verified && (
//                   <View className="absolute top-0 right-0 w-8 h-8 rounded-full bg-green-500 items-center justify-center border-2 border-white dark:border-gray-800">
//                     <Ionicons name="checkmark-circle" size={20} color="white" />
//                   </View>
//                 )}
//               </View>
//             </AnimatedPressable>

//             {/* Business Name */}
//             <Text
//               style={{ color: theme.textPrimary }}
//               className="text-2xl font-bold mt-4 text-center"
//             >
//               {businessData.businessName}
//             </Text>

//             {/* Industry */}
//             <View className="flex-row items-center mt-2">
//               <MaterialCommunityIcons
//                 name="office-building"
//                 size={16}
//                 color={theme.textSecondary}
//               />
//               <Text
//                 style={{ color: theme.textSecondary }}
//                 className="text-sm ml-2"
//               >
//                 {businessData.industry}
//               </Text>
//             </View>

//             {/* Description */}
//             {businessData.description && (
//               <Text
//                 style={{ color: theme.textSecondary }}
//                 className="text-center mt-3 px-4"
//               >
//                 {businessData.description}
//               </Text>
//             )}

//             {/* Stats */}
//             <View
//               className="flex-row justify-around w-full mt-6 pt-6 border-t"
//               style={{ borderColor: theme.border }}
//             >
//               <View className="items-center">
//                 <Text
//                   style={{ color: theme.textPrimary }}
//                   className="text-xl font-bold"
//                 >
//                   {businessData.foundedYear}
//                 </Text>
//                 <Text
//                   style={{ color: theme.textSecondary }}
//                   className="text-sm mt-1"
//                 >
//                   Founded
//                 </Text>
//               </View>
//               <View className="items-center">
//                 <Text
//                   style={{ color: theme.textPrimary }}
//                   className="text-xl font-bold"
//                 >
//                   {businessData.employeeCount}
//                 </Text>
//                 <Text
//                   style={{ color: theme.textSecondary }}
//                   className="text-sm mt-1"
//                 >
//                   Employees
//                 </Text>
//               </View>
//               <View className="items-center">
//                 <View className="flex-row items-center">
//                   <Ionicons
//                     name={
//                       businessData.verified
//                         ? "shield-checkmark"
//                         : "shield-outline"
//                     }
//                     size={20}
//                     color={
//                       businessData.verified ? "#10B981" : theme.textSecondary
//                     }
//                   />
//                 </View>
//                 <Text
//                   style={{ color: theme.textSecondary }}
//                   className="text-sm mt-1"
//                 >
//                   {businessData.verified ? "Verified" : "Unverified"}
//                 </Text>
//               </View>
//             </View>
//           </View>
//         </Animated.View>

//         {/* Business Information */}
//         <Animated.View
//           entering={FadeInUp.duration(400).delay(200)}
//           className="mb-6"
//         >
//           <Text
//             style={{ color: theme.textPrimary }}
//             className="text-lg font-semibold px-6 mb-3"
//           >
//             Business Information
//           </Text>

//           <View
//             className="mx-6 rounded-2xl overflow-hidden"
//             style={{ backgroundColor: theme.cardBg }}
//           >
//             <View
//               className="flex-row items-center p-4 border-b"
//               style={{ borderColor: theme.border }}
//             >
//               <View
//                 className="w-10 h-10 rounded-full items-center justify-center mr-4"
//                 style={{ backgroundColor: `${theme.textSecondary}15` }}
//               >
//                 <MaterialCommunityIcons
//                   name="domain"
//                   size={20}
//                   color={theme.textPrimary}
//                 />
//               </View>
//               <View className="flex-1">
//                 <Text
//                   style={{ color: theme.textPrimary }}
//                   className="text-base font-medium"
//                 >
//                   Business Type
//                 </Text>
//                 <Text
//                   style={{ color: theme.textSecondary }}
//                   className="text-sm mt-1"
//                 >
//                   {businessData.businessType}
//                 </Text>
//               </View>
//             </View>

//             <View
//               className="flex-row items-center p-4 border-b"
//               style={{ borderColor: theme.border }}
//             >
//               <View
//                 className="w-10 h-10 rounded-full items-center justify-center mr-4"
//                 style={{ backgroundColor: `${theme.textSecondary}15` }}
//               >
//                 <MaterialCommunityIcons
//                   name="file-document"
//                   size={20}
//                   color={theme.textPrimary}
//                 />
//               </View>
//               <View className="flex-1">
//                 <Text
//                   style={{ color: theme.textPrimary }}
//                   className="text-base font-medium"
//                 >
//                   Registration Number
//                 </Text>
//                 <Text
//                   style={{ color: theme.textSecondary }}
//                   className="text-sm mt-1"
//                 >
//                   {businessData.registrationNumber}
//                 </Text>
//               </View>
//             </View>

//             <View
//               className="flex-row items-center p-4"
//               style={{ borderColor: theme.border }}
//             >
//               <View
//                 className="w-10 h-10 rounded-full items-center justify-center mr-4"
//                 style={{ backgroundColor: `${theme.textSecondary}15` }}
//               >
//                 <MaterialCommunityIcons
//                   name="receipt"
//                   size={20}
//                   color={theme.textPrimary}
//                 />
//               </View>
//               <View className="flex-1">
//                 <Text
//                   style={{ color: theme.textPrimary }}
//                   className="text-base font-medium"
//                 >
//                   Tax ID / EIN
//                 </Text>
//                 <Text
//                   style={{ color: theme.textSecondary }}
//                   className="text-sm mt-1"
//                 >
//                   {businessData.taxId}
//                 </Text>
//               </View>
//             </View>
//           </View>
//         </Animated.View>

//         {/* Contact Information */}
//         <Animated.View
//           entering={FadeInUp.duration(400).delay(250)}
//           className="mb-6"
//         >
//           <Text
//             style={{ color: theme.textPrimary }}
//             className="text-lg font-semibold px-6 mb-3"
//           >
//             Contact Information
//           </Text>

//           <View
//             className="mx-6 rounded-2xl overflow-hidden"
//             style={{ backgroundColor: theme.cardBg }}
//           >
//             <Pressable
//               onPress={() => setEditModalVisible(true)}
//               className="flex-row items-center p-4 border-b"
//               style={{ borderColor: theme.border }}
//             >
//               <View
//                 className="w-10 h-10 rounded-full items-center justify-center mr-4"
//                 style={{ backgroundColor: `${theme.textSecondary}15` }}
//               >
//                 <Ionicons
//                   name="mail-outline"
//                   size={20}
//                   color={theme.textPrimary}
//                 />
//               </View>
//               <View className="flex-1">
//                 <Text
//                   style={{ color: theme.textPrimary }}
//                   className="text-base font-medium"
//                 >
//                   Email
//                 </Text>
//                 <Text
//                   style={{ color: theme.textSecondary }}
//                   className="text-sm mt-1"
//                 >
//                   {businessData.email}
//                 </Text>
//               </View>
//               <Ionicons
//                 name="chevron-forward"
//                 size={20}
//                 color={theme.textSecondary}
//               />
//             </Pressable>

//             <Pressable
//               onPress={() => setEditModalVisible(true)}
//               className="flex-row items-center p-4 border-b"
//               style={{ borderColor: theme.border }}
//             >
//               <View
//                 className="w-10 h-10 rounded-full items-center justify-center mr-4"
//                 style={{ backgroundColor: `${theme.textSecondary}15` }}
//               >
//                 <Ionicons
//                   name="call-outline"
//                   size={20}
//                   color={theme.textPrimary}
//                 />
//               </View>
//               <View className="flex-1">
//                 <Text
//                   style={{ color: theme.textPrimary }}
//                   className="text-base font-medium"
//                 >
//                   Phone
//                 </Text>
//                 <Text
//                   style={{ color: theme.textSecondary }}
//                   className="text-sm mt-1"
//                 >
//                   {businessData.phone}
//                 </Text>
//               </View>
//               <Ionicons
//                 name="chevron-forward"
//                 size={20}
//                 color={theme.textSecondary}
//               />
//             </Pressable>

//             <Pressable
//               onPress={() => setEditModalVisible(true)}
//               className="flex-row items-center p-4"
//             >
//               <View
//                 className="w-10 h-10 rounded-full items-center justify-center mr-4"
//                 style={{ backgroundColor: `${theme.textSecondary}15` }}
//               >
//                 <Ionicons
//                   name="globe-outline"
//                   size={20}
//                   color={theme.textPrimary}
//                 />
//               </View>
//               <View className="flex-1">
//                 <Text
//                   style={{ color: theme.textPrimary }}
//                   className="text-base font-medium"
//                 >
//                   Website
//                 </Text>
//                 <Text
//                   style={{ color: theme.textSecondary }}
//                   className="text-sm mt-1"
//                 >
//                   {businessData.website}
//                 </Text>
//               </View>
//               <Ionicons
//                 name="chevron-forward"
//                 size={20}
//                 color={theme.textSecondary}
//               />
//             </Pressable>
//           </View>
//         </Animated.View>

//         {/* Business Address */}
//         <Animated.View
//           entering={FadeInUp.duration(400).delay(300)}
//           className="mb-6"
//         >
//           <Text
//             style={{ color: theme.textPrimary }}
//             className="text-lg font-semibold px-6 mb-3"
//           >
//             Business Address
//           </Text>

//           <View
//             className="mx-6 rounded-2xl overflow-hidden"
//             style={{ backgroundColor: theme.cardBg }}
//           >
//             <Pressable
//               onPress={() => setEditModalVisible(true)}
//               className="flex-row items-center p-4 border-b"
//               style={{ borderColor: theme.border }}
//             >
//               <View
//                 className="w-10 h-10 rounded-full items-center justify-center mr-4"
//                 style={{ backgroundColor: `${theme.textSecondary}15` }}
//               >
//                 <Ionicons
//                   name="location-outline"
//                   size={20}
//                   color={theme.textPrimary}
//                 />
//               </View>
//               <View className="flex-1">
//                 <Text
//                   style={{ color: theme.textPrimary }}
//                   className="text-base font-medium"
//                 >
//                   Street Address
//                 </Text>
//                 <Text
//                   style={{ color: theme.textSecondary }}
//                   className="text-sm mt-1"
//                 >
//                   {businessData.address.street}
//                 </Text>
//               </View>
//               <Ionicons
//                 name="chevron-forward"
//                 size={20}
//                 color={theme.textSecondary}
//               />
//             </Pressable>

//             <Pressable
//               onPress={() => setEditModalVisible(true)}
//               className="flex-row items-center p-4"
//             >
//               <View
//                 className="w-10 h-10 rounded-full items-center justify-center mr-4"
//                 style={{ backgroundColor: `${theme.textSecondary}15` }}
//               >
//                 <Ionicons
//                   name="business-outline"
//                   size={20}
//                   color={theme.textPrimary}
//                 />
//               </View>
//               <View className="flex-1">
//                 <Text
//                   style={{ color: theme.textPrimary }}
//                   className="text-base font-medium"
//                 >
//                   City, State, Zip
//                 </Text>
//                 <Text
//                   style={{ color: theme.textSecondary }}
//                   className="text-sm mt-1"
//                 >
//                   {businessData.address.city}, {businessData.address.state}{" "}
//                   {businessData.address.zipCode}
//                 </Text>
//               </View>
//               <Ionicons
//                 name="chevron-forward"
//                 size={20}
//                 color={theme.textSecondary}
//               />
//             </Pressable>
//           </View>
//         </Animated.View>

//         {/* Business Documents */}
//         <Animated.View
//           entering={FadeInUp.duration(400).delay(350)}
//           className="mb-6"
//         >
//           <Text
//             style={{ color: theme.textPrimary }}
//             className="text-lg font-semibold px-6 mb-3"
//           >
//             Business Documents
//           </Text>

//           <View
//             className="mx-6 rounded-2xl overflow-hidden"
//             style={{ backgroundColor: theme.cardBg }}
//           >
//             {/* Business License */}
//             <Pressable
//               onPress={() => handleDocumentUpload("businessLicense")}
//               className="flex-row items-center p-4 border-b"
//               style={{ borderColor: theme.border }}
//             >
//               <View
//                 className="w-10 h-10 rounded-full items-center justify-center mr-4"
//                 style={{
//                   backgroundColor: businessData.documents.businessLicense
//                     ? "#10B98115"
//                     : `${theme.textSecondary}15`,
//                 }}
//               >
//                 <MaterialCommunityIcons
//                   name="certificate"
//                   size={20}
//                   color={
//                     businessData.documents.businessLicense
//                       ? "#10B981"
//                       : theme.textPrimary
//                   }
//                 />
//               </View>
//               <View className="flex-1">
//                 <Text
//                   style={{ color: theme.textPrimary }}
//                   className="text-base font-medium"
//                 >
//                   Business License
//                 </Text>
//                 <Text
//                   style={{ color: theme.textSecondary }}
//                   className="text-sm mt-1"
//                 >
//                   {businessData.documents.businessLicense || "Not uploaded"}
//                 </Text>
//               </View>
//               <Ionicons
//                 name={
//                   businessData.documents.businessLicense
//                     ? "checkmark-circle"
//                     : "cloud-upload-outline"
//                 }
//                 size={20}
//                 color={
//                   businessData.documents.businessLicense
//                     ? "#10B981"
//                     : theme.textSecondary
//                 }
//               />
//             </Pressable>

//             {/* Tax Certificate */}
//             <Pressable
//               onPress={() => handleDocumentUpload("taxCertificate")}
//               className="flex-row items-center p-4 border-b"
//               style={{ borderColor: theme.border }}
//             >
//               <View
//                 className="w-10 h-10 rounded-full items-center justify-center mr-4"
//                 style={{
//                   backgroundColor: businessData.documents.taxCertificate
//                     ? "#10B98115"
//                     : `${theme.textSecondary}15`,
//                 }}
//               >
//                 <MaterialCommunityIcons
//                   name="file-certificate"
//                   size={20}
//                   color={
//                     businessData.documents.taxCertificate
//                       ? "#10B981"
//                       : theme.textPrimary
//                   }
//                 />
//               </View>
//               <View className="flex-1">
//                 <Text
//                   style={{ color: theme.textPrimary }}
//                   className="text-base font-medium"
//                 >
//                   Tax Certificate
//                 </Text>
//                 <Text
//                   style={{ color: theme.textSecondary }}
//                   className="text-sm mt-1"
//                 >
//                   {businessData.documents.taxCertificate || "Not uploaded"}
//                 </Text>
//               </View>
//               <Ionicons
//                 name={
//                   businessData.documents.taxCertificate
//                     ? "checkmark-circle"
//                     : "cloud-upload-outline"
//                 }
//                 size={20}
//                 color={
//                   businessData.documents.taxCertificate
//                     ? "#10B981"
//                     : theme.textSecondary
//                 }
//               />
//             </Pressable>

//             {/* Insurance Certificate */}
//             <Pressable
//               onPress={() => handleDocumentUpload("insuranceCert")}
//               className="flex-row items-center p-4"
//             >
//               <View
//                 className="w-10 h-10 rounded-full items-center justify-center mr-4"
//                 style={{
//                   backgroundColor: businessData.documents.insuranceCert
//                     ? "#10B98115"
//                     : `${theme.textSecondary}15`,
//                 }}
//               >
//                 <MaterialCommunityIcons
//                   name="shield-check"
//                   size={20}
//                   color={
//                     businessData.documents.insuranceCert
//                       ? "#10B981"
//                       : theme.textPrimary
//                   }
//                 />
//               </View>
//               <View className="flex-1">
//                 <Text
//                   style={{ color: theme.textPrimary }}
//                   className="text-base font-medium"
//                 >
//                   Insurance Certificate
//                 </Text>
//                 <Text
//                   style={{ color: theme.textSecondary }}
//                   className="text-sm mt-1"
//                 >
//                   {businessData.documents.insuranceCert || "Not uploaded"}
//                 </Text>
//               </View>
//               <Ionicons
//                 name={
//                   businessData.documents.insuranceCert
//                     ? "checkmark-circle"
//                     : "cloud-upload-outline"
//                 }
//                 size={20}
//                 color={
//                   businessData.documents.insuranceCert
//                     ? "#10B981"
//                     : theme.textSecondary
//                 }
//               />
//             </Pressable>
//           </View>

//           {/* Upload Notice */}
//           <View
//             className="mx-6 mt-4 flex-row items-start p-4 rounded-2xl"
//             style={{ backgroundColor: isDark ? "#1E40AF20" : "#DBEAFE" }}
//           >
//             <Ionicons name="information-circle" size={20} color="#3B82F6" />
//             <Text
//               style={{ color: theme.textSecondary }}
//               className="ml-3 flex-1 text-xs"
//             >
//               Upload PDF documents only. Maximum file size: 10MB per document.
//             </Text>
//           </View>
//         </Animated.View>

//         {/* Verification Status */}
//         {!businessData.verified && (
//           <Animated.View
//             entering={FadeInUp.duration(400).delay(400)}
//             className="mb-6"
//           >
//             <View
//               className="mx-6 rounded-2xl p-6"
//               style={{ backgroundColor: "#FEF3C7" }}
//             >
//               <View className="flex-row items-center mb-3">
//                 <Ionicons name="alert-circle" size={24} color="#F59E0B" />
//                 <Text
//                   className="text-lg font-semibold ml-3"
//                   style={{ color: "#92400E" }}
//                 >
//                   Verification Pending
//                 </Text>
//               </View>
//               <Text style={{ color: "#92400E" }} className="text-sm mb-4">
//                 Your business profile is under review. Please ensure all
//                 required documents are uploaded.
//               </Text>
//               <Pressable
//                 className="bg-yellow-600 rounded-xl p-3 items-center"
//                 onPress={() =>
//                   Alert.alert(
//                     "Verification",
//                     "Our team will review your documents within 2-3 business days."
//                   )
//                 }
//               >
//                 <Text className="text-white font-semibold">
//                   Request Verification
//                 </Text>
//               </Pressable>
//             </View>
//           </Animated.View>
//         )}
//       </ScrollView>

//       {/* Edit Business Modal */}
//       <EditBusinessModal
//         visible={editModalVisible}
//         onClose={() => setEditModalVisible(false)}
//         businessData={businessData}
//         onSave={handleUpdateBusiness}
//         theme={theme}
//       />
//     </SafeAreaView>
//   );
// };

// export default Business;
