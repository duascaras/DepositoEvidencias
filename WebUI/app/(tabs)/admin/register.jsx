import React, { useEffect, useState, useCallback } from "react";
import { View, ScrollView, Text, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import { SelectList } from "react-native-dropdown-select-list";
import axios from "axios";

import FormField from "../../../components/FormField";
import CustomButton from "../../../components/CustomButton";
import Header from "../../../components/Header";
import AlertModal from "../../../components/AlertModal"; // Import AlertModal

const Register = ({ onItemCreated = () => {} }) => {
	const [form, setForm] = useState({
		userName: "",
		password: "",
		roleName: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [selectedPermission, setSelectedPermission] = useState("");
	const [permissionData, setPermissionData] = useState([]);
	const [modalVisible, setModalVisible] = useState(false);
	const [modalMessage, setModalMessage] = useState("");
	const router = useRouter();

	const createUser = async () => {
		if (!form.userName || !form.password) {
			setModalMessage("Por favor, preencha todos os campos.");
			setModalVisible(true);
			return;
		}

		if (!selectedPermission) {
			setModalMessage("Por favor, preencha a permissão.");
			setModalVisible(true);
			return;
		}

		setIsSubmitting(true);
		try {
			const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}Account/register`;

			const updatedForm = {
				...form,
				roleName: selectedPermission,
			};

			const response = await axios.post(API_URL, updatedForm);

			if (response.status === 200) {
				setModalMessage("Usuário criado com sucesso.");
				setModalVisible(true);
				onItemCreated();
				router.push("/(tabs)/admin");
			} else {
				setModalMessage("Erro. Por favor, tente novamente.");
				setModalVisible(true);
			}
		} catch (error) {
			setModalMessage(error.response.data);
			setModalVisible(true);
		} finally {
			setIsSubmitting(false);
		}
	};

	const cancel = () => {
		router.push("/(tabs)/admin");
	};

	useFocusEffect(
		useCallback(() => {
			const loadRoles = () => {
				const allRoles = [
					{ key: "1", value: "Admin" },
					{ key: "2", value: "ItemCreator" },
					{ key: "3", value: "ItemAnalyzer" },
				];

				setPermissionData(allRoles);
			};
			loadRoles();
		}, [])
	);

	return (
		<SafeAreaView className="bg-soft_white h-full">
			<ScrollView>
				<Header title={"Novo Usuário"} />

				<View style={styles.containerColumn}>
					<View style={styles.table}>
						<Text className="text-xl font-bold font-psemibold">
							Criar novo usuário
						</Text>
						<View className="space-y=2">
							<FormField
								title="Nome do Usuário"
								value={form.userName}
								handleChangeText={(e) =>
									setForm({ ...form, userName: e })
								}
								otherStyles="mt-8"
							/>
						</View>

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
							<SelectList
								setSelected={setSelectedPermission}
								data={permissionData}
								save="value"
								boxStyles={styles.selectListBox}
								inputStyles={styles.selectListInput}
								dropdownStyles={styles.selectListDropdown}
								dropdownItemStyles={
									styles.selectListDropdownItem
								}
								dropdownTextStyles={
									styles.selectListDropdownText
								}
							/>
						</View>

						<View className="flex flex-row justify-between mt-20">
							<CustomButton
								title="Cancelar"
								handlePress={cancel}
								containerStyles="flex-1 mr-2"
							/>

							<CustomButton
								title="Confirmar"
								handlePress={createUser}
								containerStyles="flex-1 ml-2 bg-red-500"
								isLoading={isSubmitting}
							/>
						</View>
					</View>
				</View>
			</ScrollView>
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

export default Register;
