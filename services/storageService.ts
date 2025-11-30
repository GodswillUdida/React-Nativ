// storageService.ts
import * as SecureStore from "expo-secure-store";

const isAvailable = async () => {
  try {
    return await SecureStore.isAvailableAsync();
  } catch (err) {
    console.error("SecureStore not available:", err);
    return false;
  }
};

export async function saveItem(key: string, value: string): Promise<void> {
  if (!(await isAvailable())) {
    console.warn("SecureStore unavailable, skipping save:", key);
    return;
  }
  try {
    await SecureStore.setItemAsync(key, value, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY, // iOS secure setting
    });
  } catch (err) {
    console.error(`Failed to save ${key} to storage:`, err);
    throw err;
  }
}

export async function getItem(key: string): Promise<string | null> {
  if (!(await isAvailable())) return null;
  try {
    return await SecureStore.getItemAsync(key);
  } catch (err) {
    console.error(`Failed to get ${key} from storage:`, err);
    return null;
  }
}

export async function deleteItem(key: string): Promise<void> {
  if (!(await isAvailable())) return;
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (err) {
    console.error(`Failed to delete ${key} from storage:`, err);
    throw err;
  }
}

// Convenience wrappers
export async function saveUser(user: object) {
  return saveItem("user", JSON.stringify(user));
}

export async function getUser<T = any>(): Promise<T | null> {
  const raw = await getItem("user");
  return raw ? (JSON.parse(raw) as T) : null;
}

export async function clearAuth() {
  await deleteItem("token");
  await deleteItem("user");
  await deleteItem("biometricsEnabled");
};