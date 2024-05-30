import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import axios from "axios";

import CustomButton from "../../../components/CustomButtom";
import FormField from "../../../components/FormField";

const InactivateUser = () => {
	const [form, setForm] = useState({
		username: "",
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();

	const updateUser = async () => {
		setIsSubmitting(true);

		try {
			const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}Account/desativar-ativar-usuario?username=${form.username}`;
			const response = await axios.put(API_URL, form);

			if (response.status === 200) {
				alert("User updated successfully.");
				router.push("/(tabs)/admin");
			} else {
				alert("Failed to update user. Please try again.");
			}
		} catch (error) {
			alert("Failed to update user. Please try again.");
			console.error(error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<SafeAreaView className="bg-soft_white h-full">
			<ScrollView>
				<View className="bg-blue">
					<Text className="text-4xl text-soft_white text-primary text-semibold my-10 font-psemibold text-center">
						Inativar Usuário
					</Text>
				</View>

				<View className="w-full justify-center min-h-[60vh] px-14">
					<FormField
						title="Nome do Usuário"
						value={form.username}
						handleChangeText={(e) =>
							setForm({ ...form, username: e })
						}
						otherStyles="mt-8"
					/>

					<CustomButton
						title="Confirmar"
						handlePress={updateUser}
						containerStyles="mt-20"
						isLoading={isSubmitting}
					/>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default InactivateUser;
