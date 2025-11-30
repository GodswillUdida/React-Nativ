// import { useMemo } from "react";



// export const sections = useMemo(
//   () => [
//     {
//       title: "Account",
//       items: [
//         {
//           icon: "account-circle-outline",
//           label: "Profile",
//           type: "link",
//           accessory: "Edit",
//           action: () => navigation.navigate("ProfileScreen"),
//         },
//         {
//           icon: "briefcase-outline",
//           label: "Business",
//           type: "link",
//           accessory: "Switch",
//           action: () => navigation.navigate("BusinessSwitchScreen"),
//         },
//         {
//           icon: "email-outline",
//           label: "Email",
//           type: "link",
//           accessory: "user@biz.com",
//           action: () => console.log("Change Email"),
//         },
//         {
//           icon: "lock-outline",
//           label: "Change Password",
//           type: "link",
//           action: () => navigation.navigate("ChangePasswordScreen"),
//         },
//       ],
//     },
//     {
//       title: "Notifications",
//       items: [
//         {
//           icon: "bell-outline",
//           label: "Push Notifications",
//           type: "toggle",
//           toggleValue: notifications,
//           onToggleChange: setNotifications,
//         },
//         {
//           icon: "email-outline",
//           label: "Email Alerts",
//           type: "toggle",
//           toggleValue: true,
//           onToggleChange: () => console.log("Email alerts toggled"),
//         },
//       ],
//     },
//     {
//       title: "Preferences",
//       items: [
//         {
//           icon: "theme-light-dark",
//           label: "Dark Mode",
//           type: "toggle",
//           toggleValue: darkMode,
//           onToggleChange: (v) => {
//             setDarkMode(v);
//             console.log("Dark mode:", v);
//             // Integrate with theme context/provider if available
//           },
//         },
//         {
//           icon: "translate",
//           label: "Language",
//           type: "link",
//           accessory: "English",
//           action: () => navigation.navigate("LanguageScreen"),
//         },
//         {
//           icon: "currency-ngn",
//           label: "Currency",
//           type: "link",
//           accessory: "₦",
//           action: () => navigation.navigate("CurrencyScreen"),
//         },
//       ],
//     },
//     {
//       title: "Security",
//       items: [
//         {
//           icon: "fingerprint",
//           label: "Biometrics",
//           type: "toggle",
//           toggleValue: biometrics,
//           onToggleChange: setBiometrics,
//         },
//         {
//           icon: "shield-lock-outline",
//           label: "Two-Factor Auth",
//           type: "link",
//           action: () => navigation.navigate("TwoFAScreen"),
//         },
//         {
//           icon: "cellphone-lock",
//           label: "Device Management",
//           type: "link",
//           action: () => navigation.navigate("DeviceManagementScreen"),
//         },
//       ],
//     },
//     {
//       title: "Support",
//       items: [
//         {
//           icon: "help-circle-outline",
//           label: "Help Center",
//           type: "link",
//           action: () => openLink("https://yourapp.com/help"),
//         },
//         {
//           icon: "chat-outline",
//           label: "Contact Support",
//           type: "link",
//           action: () => openLink("mailto:support@yourapp.com"),
//         },
//         {
//           icon: "star-outline",
//           label: "Rate App",
//           type: "link",
//           action: () =>
//             openLink(
//               "https://play.google.com/store/apps/details?id=com.yourapp"
//             ),
//         },
//       ],
//     },
//     {
//       title: "App",
//       items: [
//         {
//           icon: "information-outline",
//           label: "Version",
//           type: "link",
//           accessory: "1.0.0",
//         },
//         {
//           icon: "logout",
//           label: "Logout",
//           type: "button",
//           action: handleLogout,
//         },
//       ],
//     },
//   ],
//   [notifications, darkMode, biometrics, handleLogout]
// );
