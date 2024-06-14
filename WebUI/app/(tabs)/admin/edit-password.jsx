import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import CustomButton from "../../../components/CustomButton";
import FormField from "../../../components/FormField";
import Header from "../../../components/Header";
import { useAuth } from "../../../context/AuthContext"; // Import the useAuth hook
import AlertModal from "../../../components/AlertModal"; // Import AlertModal

const EditPassword = () => {
	const [form, setForm] = useState({
		userName: "",
		newPassword: "",
		confirmedPassword: "",
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [modalMessage, setModalMessage] = useState("");
	const router = useRouter();
	const { authState } = useAuth(); // Get authState from AuthContext
	const { id } = useLocalSearchParams(); // Get user ID from URL parameters

	useEffect(() => {
		const getUser = async () => {
			try {
				const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}Account/get-user/${id}`;
				const response = await axios.get(API_URL);
				if (response.status === 200) {
					const userData = response.data;
					setForm((prevForm) => ({
						...prevForm,
						userName: userData.userName,
					}));
				} else {
					setModalMessage("Error");
					setModalVisible(true);
				}
			} catch (error) {
				setModalMessage(error.response.data);
				setModalVisible(true);
			}
		};
		getUser();
	}, [id]);

	const updateUser = async () => {
		setIsSubmitting(true);

		try {
			// Determine the API endpoint based on the user's role
			let API_URL;
			if (authState.user.role === "Admin") {
				API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}/api/Account/edit-password-admin`;
			} else {
				API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}/api/Account/edit-password-user`;
			}

			const response = await axios.put(API_URL, form);

			if (response.status === 200) {
				setModalMessage("User updated successfully.");
				setModalVisible(true);
				router.push("/(tabs)/admin");
			} else {
				setModalMessage("Failed to update user. Please try again.");
				setModalVisible(true);
			}
		} catch (error) {
			setModalMessage("Failed to update user. Please try again.");
			setModalVisible(true);
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
					editable={false}
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
					title="Confirmar Nova Senha"
					value={form.confirmedPassword}
					handleChangeText={(e) =>
						setForm({ ...form, confirmedPassword: e })
					}
					otherStyles="mt-8"
				/>

				<View className="flex flex-row justify-between mt-20">
					<CustomButton
						title="Cancelar"
						handlePress={() => router.push("/(tabs)/admin")}
						containerStyles="flex-1 mr-2"
					/>

					<CustomButton
						title="Confirmar"
						handlePress={updateUser}
						containerStyles="flex-1 ml-2 bg-red-500"
						isLoading={isSubmitting}
					/>
				</View>
			</View>
			<AlertModal
				visible={modalVisible}
				message={modalMessage}
				onClose={() => setModalVisible(false)}
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	containerColumn: {
		flexDirection: "column",
		justifyContent: "space-between",
		paddingHorizontal: 20,
	},
	table: {
		padding: 10,
		marginVertical: 10,
		backgroundColor: "#f0f0f0",
		borderRadius: 10,
		padding: 20,
	},
	selectListBox: {
		height: 60,
		borderWidth: 2,
		borderColor: "black",
		paddingLeft: 16,
		paddingRight: 16,
		borderRadius: 14,
		padding: 8,
	},
	selectListInput: {
		color: "#000000",
		marginTop: 6.5,
	},
	selectListDropdown: {
		borderColor: "black",
	},
	selectListDropdownItem: {
		padding: 8,
	},
	selectListDropdownText: {
		color: "#000000",
	},
});

export default EditPassword;
