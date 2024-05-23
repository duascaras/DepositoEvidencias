import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";

import FormField from "../../../components/FormField";
import CustomButtom from "../../../components/CustomButtom";

const ItemDetails = () => {
	const { id } = useLocalSearchParams();
	const [form, setForm] = useState({
		name: "",
		code: "",
		isActive: true || false,
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const getItems = async () => {
			try {
				const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}Itens/exibir-item/${id}`;
				const response = await axios.get(API_URL);
				if (response.status === 200) {
					const itemData = response.data;
					setForm({
						name: itemData.name,
						code: itemData.code,
						isActive: itemData.isActive,
					});
				} else {
					alert("Error", "Failed to fetch user data.");
				}
			} catch (error) {
				alert("Error", "Failed to fetch user data.");
				console.error("Error:", error);
			}
		};

		getItems();
	}, [id]);

	const updateItem = async () => {
		setIsSubmitting(true);

		try {
			const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}Itens/edit/${id}`;

			console.log(form.isActive);
			if (form.isActive === "false") {
				form.isActive = false;
			} else {
				form.isActive = true;
			}

			const response = await axios.put(API_URL, form);

			if (response.status === 200) {
				alert("Success", "User updated successfully.");
				router.push("/(tabs)/items");
			} else {
				alert("Error", "Failed to update user. Please try again.");
			}
		} catch (error) {
			alert("Error", "Failed to update user. Please try again.");
			console.error("Error:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const cancel = () => {
		router.push("items");
	};

	return (
		<SafeAreaView className="bg-soft_white h-full">
			<ScrollView>
				<View className="bg-blue">
					<Text className="text-4xl text-soft_white text-primary text-semibold my-10 font-psemibold text-center">
						Editar Itens
					</Text>
				</View>

				<View className="w-full justify-center min-h-[60vh] px-14">
					<FormField
						title="Nome"
						value={form.name}
						handleChangeText={(e) => setForm({ ...form, name: e })}
						otherStyles="mt-8"
					/>

					<FormField
						title="Código"
						value={form.code}
						handleChangeText={(e) => setForm({ ...form, code: e })}
						otherStyles="mt-8"
					/>

					<FormField
						title="Status"
						value={form.isActive}
						handleChangeText={(e) =>
							setForm({ ...form, isActive: e })
						}
						otherStyles="mt-8"
					/>

					<View className="flex flex-row justify-between mt-20">
						<CustomButtom
							title="Confirmar"
							handlePress={updateItem}
							containerStyles="flex-1 mr-2"
							isLoading={isSubmitting}
						/>
						<CustomButtom
							title="Cancelar"
							handlePress={cancel}
							containerStyles="flex-1 ml-2 bg-red-500"
						/>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default ItemDetails;
