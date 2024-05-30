import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import CustomButton from "../../../components/CustomButtom";
import FormField from "../../../components/FormField";
import Header from "../../../components/Header";
import { useAuth } from "../../../context/AuthContext"; // Import the useAuth hook

const EditPassword = () => {
	const [form, setForm] = useState({
		userName: "",
		newPassword: "",
		confirmedPassword: "",
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();
	const { authState } = useAuth(); // Get authState from AuthContext

	const updateUser = async () => {
		setIsSubmitting(true);

		try {
			// Determine the API endpoint based on the user's role
			let API_URL;
			console.log(authState);
			if (authState.user.role === "Admin") {
				API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}/api/Account/edit-password-admin`;
			} else {
				API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}/api/Account/edit-password-user`;
			}

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
			<Header title={"Editar Senhas"} />

			<View className="w-full justify-center min-h-[60vh] px-14">
				<FormField
					title="Nome do Usuário"
					value={form.userName}
					handleChangeText={(e) => setForm({ ...form, userName: e })}
					otherStyles="mt-8"
				/>

				<FormField
					title="Nova Senha"
					value={form.newPassword}
					handleChangeText={(e) =>
						setForm({ ...form, newPassword: e })
					}
					otherStyles="mt-8"
				/>

				<FormField
					title="Confirme a nova senha"
					value={form.confirmedPassword}
					handleChangeText={(e) =>
						setForm({ ...form, confirmedPassword: e })
					}
					otherStyles="mt-8"
				/>

				<CustomButton
					title="Atualizar"
					handlePress={updateUser}
					containerStyles="mt-10"
					isLoading={isSubmitting}
				/>
			</View>
		</SafeAreaView>
	);
};

export default EditPassword;
