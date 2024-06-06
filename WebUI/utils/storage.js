// utils/storage.js
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const setItem = async (key, value) => {
	if (Platform.OS === "web") {
		await AsyncStorage.setItem(key, value);
	} else {
		await SecureStore.setItemAsync(key, value);
	}
};

export const getItem = async (key) => {
	if (Platform.OS === "web") {
		return await AsyncStorage.getItem(key);
	} else {
		return await SecureStore.getItemAsync(key);
	}
};

export const deleteItem = async (key) => {
	if (Platform.OS === "web") {
		await AsyncStorage.removeItem(key);
	} else {
		await SecureStore.deleteItemAsync(key);
	}
};
