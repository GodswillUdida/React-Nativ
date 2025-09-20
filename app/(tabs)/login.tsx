import { useAuth } from "@/providers/AuthProviders";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

const signupSchema = z
  .object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const { logout } = useAuth();

  const onSubmit = (data: SignupFormData) => {
    console.log("✅ Form Submitted:", data);
  };

  return (
    <SafeAreaView className="flex-1 justify-center bg-white px-6">
      <View className="p-5 rounded-xl shadow space-y-4">
        {/* Full Name */}
        <Controller
          control={control}
          name="fullName"
          render={({ field: { onChange, value } }) => (
            <TextInput
              className="border border-gray-600 rounded-xl p-4 text-base mb-3"
              placeholder="Full Name"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.fullName && (
          <Text className="text-red-500">{errors.fullName.message}</Text>
        )}

        {/* Email */}
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <TextInput
              className="border border-gray-600 rounded-xl p-4 text-base mb-3"
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.email && (
          <Text className="text-red-500">{errors.email.message}</Text>
        )}

        {/* Password */}
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <TextInput
              className="border border-gray-600 rounded-xl p-4 text-base mb-3"
              placeholder="Password"
              secureTextEntry
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.password && (
          <Text className="text-red-500">{errors.password.message}</Text>
        )}

        {/* Confirm Password */}
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, value } }) => (
            <TextInput
              className="border border-gray-600 rounded-xl p-4 text-base mb-3"
              placeholder="Confirm Password"
              secureTextEntry
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.confirmPassword && (
          <Text className="text-red-500">{errors.confirmPassword.message}</Text>
        )}

        {/* Submit button */}
        <Pressable
          className="bg-blue-600 rounded-xl p-4 items-center"
          onPress={handleSubmit(onSubmit)}
        >
          <Text className="text-white text-lg font-semibold">Sign Up</Text>
        </Pressable>

        <Pressable
          className="bg-red-600 rounded-xl p-4 items-center mt-3"
          onPress={() => logout()}
          // onPress={() => {log
        >
          <Text className="text-white text-lg font-semibold">Log Out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
