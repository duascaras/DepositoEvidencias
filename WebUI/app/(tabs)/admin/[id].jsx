import { useLocalSearchParams } from "expo-router";
import { View, ScrollView, Text, Alert, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import CustomButtom from "../../../components/CustomButtom";
import FormField from "../../../components/FormField";

const UserDetails = (onItemCreated) => {
	const [form, setForm] = useState({
		userName: "",
		roleName: "",
	});

	const [isSubmitting, setisSubmitting] = useState(false);
	const [selectedPermission, setSelectedPermission] = useState("");

	const { id } = useLocalSearchParams();

	useEffect(() => {
		getUser(id);
	}, []);

	const getUser = async (id) => {
		setisSubmitting(true);
		console.log(id);

		const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}Account/get-user/${id}`;

		const updatedForm = {
			...form,
			roleName: selectedPermission,
		};
		const response = await axios.get(API_URL, updatedForm);
		console.log(response);
	};

	const addUser = async () => {
		setisSubmitting(true);

		try {
			const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}Account/edit-user`;

			const updatedForm = {
				...form,
				roleName: selectedPermission,
			};
			const response = await axios.put(API_URL, updatedForm);

			if (response.status === 200) {
				alert("Success", "User updated successfully");
				onItemCreated();
				router.push("admin");
			} else {
				alert("Error", "Something went wrong. Please try again.");
			}
		} catch (error) {
			alert("Error", "Failed to create item. Please try again.");
			console.error("Error:", error);
		} finally {
			setisSubmitting(false);
		}
	};

	return (
		<SafeAreaView className="bg-soft_white h-full">
			<ScrollView>
				<View className="bg-blue">
					<Text className="text-4xl text-soft_white text-primary text-semibold my-10 font-psemibold text-center ">
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

					<CustomButtom
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
		fontSize: 18, // Adjust fontSize to match your FormField
		fontWeight: "bold", // Set fontWeight to match your FormField
		textAlign: "center", // Center the text
	},
});

export default UserDetails;
