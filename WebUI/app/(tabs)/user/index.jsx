import React, { useState, useCallback } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import FormField from "../../../components/FormField";
import CustomButton from "../../../components/CustomButton";
import Header from "../../../components/Header";
import { useRouter } from "expo-router";
import ConfirmationModal from "../../../components/ConfirmationModal";
import AlertModal from "../../../components/AlertModal";
import { useFocusEffect } from "@react-navigation/native";

const ChangePassword = () => {
	const [form, setForm] = useState({
		currentPassword: "",
		newPassword: "",
		confirmedPassword: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [alertVisible, setAlertVisible] = useState(false);
	const [alertMessage, setAlertMessage] = useState("");
	const router = useRouter();

	const resetForm = () => {
		setForm({
			currentPassword: "",
			newPassword: "",
			confirmedPassword: "",
		});
	};

	useFocusEffect(
		useCallback(() => {
			resetForm();
		}, [])
	);

	const handleChangePassword = async () => {
		if (
			!form.currentPassword ||
			!form.newPassword ||
			!form.confirmedPassword
		) {
			showAlert("Por favor, preencha todos os campos.");
			return;
		}

		if (form.newPassword !== form.confirmedPassword) {
			showAlert("As senhas novas não coincidem.");
			return;
		}

		setIsSubmitting(true);
		try {
			const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}Account/edit-password-user`;

			const response = await axios.put(API_URL, form);

			if (response.status === 200) {
				showAlert("Senha alterada com sucesso.");
				router.push("/home");
			} else {
				showAlert(
					"Erro ao alterar a senha. Por favor, tente novamente."
				);
			}
		} catch (error) {
			showAlert(error.response.data);
		} finally {
			setIsSubmitting(false);
		}
	};

	const openModal = () => {
		setModalVisible(true);
	};

	const closeModal = () => {
		setModalVisible(false);
	};

	const confirmChangePassword = () => {
		closeModal();
		handleChangePassword();
	};

	const showAlert = (message) => {
		setAlertMessage(message);
		setAlertVisible(true);
	};

	const closeAlert = () => {
		setAlertVisible(false);
	};

	return (
		<SafeAreaView className="bg-soft_white h-full">
			<ScrollView>
				<Header title={"Alterar Senha"} />
				<View style={styles.containerColumn}>
					<View style={styles.table}>
						<View className="space-y-2 mt-10 sm:mt-1">
							<FormField
								title="Senha Atual"
								value={form.currentPassword}
								handleChangeText={(e) =>
									setForm({ ...form, currentPassword: e })
								}
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
						</View>

						<View className="flex flex-row justify-between mt-20">
							<CustomButton
								title="Cancelar"
								handlePress={() => router.back()}
								containerStyles="flex-1 mr-2"
							/>
							<CustomButton
								title="Confirmar"
								handlePress={openModal}
								containerStyles="flex-1 ml-2 bg-red-500"
								isLoading={isSubmitting}
							/>
						</View>
					</View>
				</View>
			</ScrollView>

			<ConfirmationModal
				visible={modalVisible}
				message="Confirmar esta ação?"
				onConfirm={confirmChangePassword}
				onCancel={closeModal}
			/>

			<AlertModal
				visible={alertVisible}
				message={alertMessage}
				onClose={closeAlert}
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	containerColumn: {
		paddingHorizontal: 20,
	},
	table: {
		marginVertical: 10,
		padding: 20,
	},
});

export default ChangePassword;
