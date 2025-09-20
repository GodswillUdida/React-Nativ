import {
  Button,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const Settings = () => {
  // const [email, setEmail] = useState("");

  // const validateEmail = (email: string) => {
  //   return schema.safeParse({ email, password: "dummyPassword" }).success;
  // };

  // const handleEmailChange = (text: string) => {
  //   setEmail(text);
  //   if (!validateEmail(text)) {
  //     console.log("Invalid email format");
  //   }
  // };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: any) => {
    console.log("Form Data:", data);
  };

  return (
    <SafeAreaView className="flex-1 bg-green-300 px-6">
      <View className="flex-1 justify-center p-6 bg-white space-y-4">
        {/* <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        > */}
          <Text className="mb-2 text-gray-700">Email</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Enter email"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            )}
          />
          {errors.email && (
            <Text className="text-red-500 mb-2">{errors.email.message}</Text>
          )}
          <Text className="mb-2 text-gray-700">Password</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <TextInput
                className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
                placeholder="Enter password"
                secureTextEntry
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.password && (
            <Text className="text-red-500 mb-2">{errors.password.message}</Text>
          )}

          <Button
            title="Login"
            onPress={() =>
              handleSubmit(onSubmit)().then(() => alert("Successful"))
            }
          />
        {/* </KeyboardAvoidingView> */}
      </View>
    </SafeAreaView>
  );
};

export default Settings;
