import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import FormField from "../../../components/FormField";
import CustomButton from "../../../components/CustomButton";
import { SelectList } from "react-native-dropdown-select-list";
import Header from "../../../components/Header";
import ConfirmationModal from "../../../components/ConfirmationModal";
import AlertModal from "../../../components/AlertModal";

const formatDateToBrazilian = (dateString) => {
	const date = new Date(dateString);
	const day = date.getDate().toString().padStart(2, "0");
	const month = (date.getMonth() + 1).toString().padStart(2, "0");
	const year = date.getFullYear();
	const hours = date.getHours().toString().padStart(2, "0");
	const minutes = date.getMinutes().toString().padStart(2, "0");
	const seconds = date.getSeconds().toString().padStart(2, "0");

	return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

const ItemDetails = () => {
	const { id } = useLocalSearchParams();
	const [form, setForm] = useState({
		userId: "",
		createDate: "",
		changeDate: "",
		changeUserId: "",
		name: "",
		code: "",
		isActive: true,
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [alertVisible, setAlertVisible] = useState(false);
	const [alertMessage, setAlertMessage] = useState("");
	const router = useRouter();

	const statusOptions = [
		{ key: "true", value: "Ativo" },
		{ key: "false", value: "Inativo" },
	];

	useEffect(() => {
		const getItem = async () => {
			try {
				const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}Itens/exibir-item/${id}`;
				const response = await axios.get(API_URL);
				if (response.status === 200) {
					const itemData = response.data;
					setForm({
						createDate: formatDateToBrazilian(itemData.createDate),
						changeDate: formatDateToBrazilian(itemData.changeDate),
						changeUserId: itemData.changeUserId,
						userId: itemData.userId,
						name: itemData.name,
						code: itemData.code,
						isActive: itemData.isActive,
					});
				} else {
					showAlert("Erro inesperado. Tente novamente");
				}
			} catch (error) {
				showAlert(error.response.data);
			}
		};

		getItem();
	}, [id]);

	const updateItem = async () => {
		if (!form.name || !form.code) {
			showAlert("Por favor, preencha todos os campos.");
			return;
		}

		setIsSubmitting(true);
		try {
			const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}Itens/edit/${id}`;
			const response = await axios.put(API_URL, {
				name: form.name,
				code: form.code,
				isActive: form.isActive,
			});

			if (response.status === 200) {
				showAlert("Item atualizado com sucesso.");
				router.push("/(tabs)/items");
			} else {
				showAlert("Erro inesperado. Tente novamente");
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

	const confirmUpdateItem = () => {
		closeModal();
		updateItem();
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
				<Header title={"Editar Itens"} />

				<View className="w-full mt-14 sm:mt-6 justify-center px-4">
					<View style={styles.row}>
						<View style={styles.formFieldContainer}>
							<FormField
								title="Criado por:"
								value={form.userId}
								disabled={true}
							/>
						</View>

						<View style={styles.formFieldContainer}>
							<FormField
								title="Data de cadastro:"
								value={form.createDate}
								disabled={true}
							/>
						</View>
					</View>

					<View style={styles.row}>
						<View style={styles.formFieldContainer}>
							<FormField
								title="Última atualização:"
								value={form.changeDate}
								disabled={true}
								otherStyles={"mt-2"}
							/>
						</View>

						<View style={styles.formFieldContainer}>
							<FormField
								title="Atualizado por:"
								value={form.changeUserId}
								disabled={true}
								otherStyles={"mt-2"}
							/>
						</View>
					</View>

					<FormField
						title="Nome"
						value={form.name}
						handleChangeText={(e) => setForm({ ...form, name: e })}
						otherStyles="mt-2"
					/>

					<FormField
						title="Código"
						value={form.code}
						handleChangeText={(e) => setForm({ ...form, code: e })}
						otherStyles="mt-2"
					/>

					<Text className="text-xl text-semibold font-psemibold mt-2">
						Status
					</Text>
					<SelectList
						setSelected={(val) =>
							setForm({ ...form, isActive: val === "true" })
						}
						data={statusOptions}
						save="key"
						defaultOption={{
							key: String(form.isActive),
							value: form.isActive ? "Ativo" : "Inativo",
						}}
						boxStyles={styles.selectListBox}
						inputStyles={styles.selectListInput}
						dropdownStyles={styles.selectListDropdown}
						dropdownItemStyles={styles.selectListDropdownItem}
						dropdownTextStyles={styles.selectListDropdownText}
					/>

					<View className="flex flex-row justify-between mt-10">
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
			</ScrollView>

			<ConfirmationModal
				visible={modalVisible}
				message="Confirmar esta ação?"
				onConfirm={confirmUpdateItem}
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
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	formFieldContainer: {
		width: "48%",
	},
	selectListBox: {
		height: 55,
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

export default ItemDetails;
