import React, { useState, useCallback } from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import CustomButton from "../../../components/CustomButton";
import FormField from "../../../components/FormField";
import Header from "../../../components/Header";
import ConfirmationModal from "../../../components/ConfirmationModal";
import AlertModal from "../../../components/AlertModal";

const NewItem = ({ onItemCreated }) => {
	const [form, setForm] = useState({
		name: "",
		code: "",
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [alertVisible, setAlertVisible] = useState(false);
	const [alertMessage, setAlertMessage] = useState("");
	const router = useRouter();

	const resetForm = () => {
		setForm({
			name: "",
			code: "",
		});
	};

	useFocusEffect(
		useCallback(() => {
			resetForm();
		}, [])
	);

	const submit = async () => {
		if (!form.name || !form.code) {
			showAlert("Preencha todos os campos.");
			return;
		}

		setIsSubmitting(true);
		try {
			const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}Itens/create-item`;
			const response = await axios.post(API_URL, form);

			if (response.status === 200) {
				showAlert("Item criado com sucesso.");
				if (onItemCreated && typeof onItemCreated === "function") {
					onItemCreated();
				}
				router.push("items");
			} else {
				showAlert("Erro inesperado. Tente novamente");
			}
		} catch (error) {
			showAlert("Você não tem permissão para registrar um item.");
			router.push("items");
		} finally {
			setIsSubmitting(false);
		}
	};

	const showAlert = (message) => {
		setAlertMessage(message);
		setAlertVisible(true);
	};

	const closeAlert = () => {
		setAlertVisible(false);
	};

	const openModal = () => {
		setModalVisible(true);
	};

	const closeModal = () => {
		setModalVisible(false);
	};

	const confirmSubmit = () => {
		closeModal();
		submit();
	};

	const cancel = () => {
		router.push("items");
	};

	return (
		<SafeAreaView className="bg-soft_white h-full">
			<ScrollView>
				<View>
					<Header title={"Novo Item"} />
				</View>

				<View className="w-full justify-center mt-28 md:mt-16 px-14">
					<FormField
						title="Nome"
						value={form.name}
						handleChangeText={(e) => setForm({ ...form, name: e })}
						otherStyles="mt-10"
					/>

					<FormField
						title="Código"
						value={form.code}
						handleChangeText={(e) => setForm({ ...form, code: e })}
						otherStyles="mt-8"
					/>

					<View className="flex flex-row justify-between mt-20">
						<CustomButton
							title="Cancelar"
							handlePress={cancel}
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
			</ScrollView>

			<ConfirmationModal
				visible={modalVisible}
				message="Confirmar a criação do item?"
				onConfirm={confirmSubmit}
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

export default NewItem;
