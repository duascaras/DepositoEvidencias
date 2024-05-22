import { View, ScrollView, Text, Alert, StyleSheet } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";

import CustomButton from "../../../components/CustomButtom";
import FormField from "../../../components/FormField";

const SignUp = ({ onItemCreated = () => {} }) => {
	const [form, setForm] = useState({
		userName: "",
		password: "",
		roleName: "",
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [selectedPermission, setSelectedPermission] = useState("");
	const router = useRouter();

	const addUser = async () => {
		setIsSubmitting(true);

		try {
			const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}Account/register`;

			const updatedForm = {
				...form,
				roleName: selectedPermission,
			};

			const response = await axios.post(API_URL, updatedForm);

			if (response.status === 200) {
				alert("Success", "User created successfully");
				onItemCreated(); // Trigger the callback
				router.push("/(tabs)/admin");
			} else {
				alert("Error", "Something went wrong. Please try again.");
			}
		} catch (error) {
			alert("Error: ", error);
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
						Criar Usuário
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

					<FormField
						title="Senha"
						value={form.password}
						handleChangeText={(e) =>
							setForm({ ...form, password: e })
						}
						otherStyles="mt-8"
					/>

					<View className="mt-8 space-y-2">
						<Text className="text-xl text-semibold font-psemibold">
							Permissão
						</Text>
						<View style={styles.pickerContainer}>
							<Picker
								selectedValue={selectedPermission}
								onValueChange={(itemValue) =>
									setSelectedPermission(itemValue)
								}
								style={styles.picker}
								itemStyle={styles.pickerItem}
							>
								<Picker.Item
									label="Selecione a Permissão"
									value=""
									color="#000000"
								/>
								<Picker.Item
									label="Admin"
									value="admin"
									color="#000000"
								/>
								<Picker.Item
									label="User"
									value="user"
									color="#000000"
								/>
							</Picker>
						</View>
					</View>

					<CustomButton
						title="Criar"
						handlePress={addUser}
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
		fontSize: 25, // Adjust fontSize to match your FormField
		fontWeight: "bold", // Set fontWeight to match your FormField
		textAlign: "center", // Center the text
	},
});

export default SignUp;
