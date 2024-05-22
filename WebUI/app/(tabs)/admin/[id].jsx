import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";

import CustomButton from "../../../components/CustomButtom";
import FormField from "../../../components/FormField";

const AdminDetail = () => {
	const { id } = useLocalSearchParams();
	const [form, setForm] = useState({
		userName: "",
		password: "", // You may not want to fetch or display the password for security reasons
		roleName: "",
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const getUser = async () => {
			try {
				const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}Account/get-user/${id}`;
				const response = await axios.get(API_URL);
				if (response.status === 200) {
					const userData = response.data;
					setForm({
						userName: userData.userName,
						roleName: userData.role,
					});
				} else {
					Alert.alert("Error", "Failed to fetch user data.");
				}
			} catch (error) {
				Alert.alert("Error", "Failed to fetch user data.");
				console.error("Error:", error);
			}
		};

		getUser();
	}, [id]);

	const updateUser = async () => {
		setIsSubmitting(true);

		try {
			const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}Account/update-user/${id}`;
			const response = await axios.put(API_URL, form);

			if (response.status === 200) {
				Alert.alert("Success", "User updated successfully.");
				router.push("/(tabs)/admin");
			} else {
				Alert.alert(
					"Error",
					"Failed to update user. Please try again."
				);
			}
		} catch (error) {
			Alert.alert("Error", "Failed to update user. Please try again.");
			console.error("Error:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<SafeAreaView className="bg-soft_white h-full">
			<ScrollView>
				<View className="bg-blue">
					<Text className="text-4xl text-soft_white text-primary text-semibold my-10 font-psemibold text-center">
						Editar Usuário
					</Text>
				</View>

				<View className="w-full justify-center min-h-[60vh] px-14">
					<FormField
						title="Nome do Usuário"
						value={form.userName}
						handleChangeText={(e) =>
							setForm({ ...form, userName: e })
						}
						otherStyles="mt-8"
					/>

					<View className="mt-8 space-y-2">
						<Text className="text-xl text-semibold font-psemibold">
							Permissão
						</Text>
						<View style={styles.pickerContainer}>
							<Picker
								selectedValue={form.roleName}
								onValueChange={(itemValue) =>
									setForm({ ...form, roleName: itemValue })
								}
								style={styles.picker}
								itemStyle={styles.pickerItem}
							>
								<Picker.Item
									label="Selecione a Permissão"
									value=""
								/>
								<Picker.Item label="Admin" value="admin" />
								<Picker.Item label="User" value="user" />
							</Picker>
						</View>
					</View>

					<CustomButton
						title="Atualizar"
						handlePress={updateUser}
						containerStyles="mt-20"
						isLoading={isSubmitting}
					/>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	pickerContainer: {
		height: 64, // Adjust height to match your FormField height
		backgroundColor: "#2A316E",
		borderRadius: 16, // Adjust borderRadius to match your FormField
		borderWidth: 2,
		borderColor: "#000",
		justifyContent: "center",
		paddingHorizontal: 16, // Adjust padding to match your FormField
	},
	// picker: {
	// 	color: "#F6F7F7", // Set text color
	// },
	pickerItem: {
		fontSize: 18, // Adjust fontSize to match your FormField
		fontWeight: "bold", // Set fontWeight to match your FormField
		textAlign: "center", // Center the text
	},
});

export default AdminDetail;
