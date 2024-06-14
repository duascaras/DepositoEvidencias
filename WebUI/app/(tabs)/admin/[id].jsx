import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { SelectList } from "react-native-dropdown-select-list";

import CustomButton from "../../../components/CustomButton";
import FormField from "../../../components/FormField";
import Header from "../../../components/Header";
import AlertModal from "../../../components/AlertModal";
import ConfirmationModal from "../../../components/ConfirmationModal"; // Importando o ConfirmationModal

const UserDetail = () => {
	const { id } = useLocalSearchParams();
	const [form, setForm] = useState({
		username: "",
		roles: "",
		newPassword: "",
		confirmedPassword: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [selectedPermission, setSelectedPermission] = useState("");
	const [permissionData, setPermissionData] = useState([]);
	const [modalVisible, setModalVisible] = useState(false);
	const [modalMessage, setModalMessage] = useState("");
	const [showConfirmationModal, setShowConfirmationModal] = useState(false); // Estado para controlar a visibilidade do ConfirmationModal
	const router = useRouter();

	useEffect(() => {
		const getUser = async () => {
			try {
				const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}Account/get-user/${id}`;
				const response = await axios.get(API_URL);
				if (response.status === 200) {
					const userData = response.data;
					const roles = userData.roles;
					setForm((prevForm) => ({
						...prevForm,
						username: userData.userName,
						roles: roles,
					}));
					setSelectedPermission(roles);

					const allRoles = [
						{ key: "1", value: "Admin" },
						{ key: "2", value: "ItemCreator" },
						{ key: "3", value: "ItemAnalyzer" },
					];

					const updatedRoles = allRoles.map((role) => {
						if (roles.includes(role.value)) {
							return { ...role, disabled: true };
						}
						return role;
					});

					setPermissionData(updatedRoles);
				} else {
					setModalMessage("Erro ao buscar dados do usuário.");
					setModalVisible(true);
				}
			} catch (error) {
				setModalMessage(
					error.response?.data || "Erro ao buscar dados do usuário."
				);
				setModalVisible(true);
			}
		};
		getUser();
	}, [id]);

	const handleInactivateUser = () => {
		setShowConfirmationModal(true);
	};

	const confirmInactivateUser = async () => {
		try {
			const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}Account/desativar-ativar-usuario?username=${form.username}`;
			const response = await axios.put(API_URL, {
				username: form.username,
			});
			if (response.status === 200) {
				setModalMessage("Usuário (in)ativado com sucesso.");
				setModalVisible(true);
				router.push("/(tabs)/admin");
			} else {
				setModalMessage(
					"Erro. Falha ao tentar inativar usuário, tente novamente."
				);
				setModalVisible(true);
			}
		} catch (error) {
			setModalMessage(
				"Erro. Falha ao tentar inativar usuário, tente novamente."
			);
			setModalVisible(true);
		} finally {
			setShowConfirmationModal(false);
		}
	};

	const updateUser = async () => {
		setIsSubmitting(true);

		try {
			const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}Account/edit-user/`;
			const response = await axios.put(API_URL, {
				...form,
				roleName: selectedPermission,
			});

			if (response.status === 200) {
				setModalMessage("Usuário atualizado com sucesso.");
				setModalVisible(true);
				router.push("/(tabs)/admin");
			} else {
				setModalMessage(
					"Erro. Falha ao tentar atualizar usuário, tente novamente."
				);
				setModalVisible(true);
			}
		} catch (error) {
			setModalMessage(
				"Erro. Falha ao tentar atualizar usuário, tente novamente."
			);
			setModalVisible(true);
		} finally {
			setIsSubmitting(false);
		}
	};

	const updatePassword = async () => {
		setIsSubmitting(true);

		try {
			const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}Account/edit-password-admin`;
			const response = await axios.put(API_URL, {
				username: form.username,
				newPassword: form.newPassword,
				confirmedPassword: form.confirmedPassword,
			});

			if (response.status === 200) {
				setModalMessage("Senha alterada com sucesso.");
				setModalVisible(true);
				setForm((prevForm) => ({
					...prevForm,
					newPassword: "",
					confirmedPassword: "",
				}));
				router.push("/(tabs)/admin");
			} else {
				setModalMessage(
					"Erro. Falha ao tentar atualizar senha, tente novamente."
				);
				setModalVisible(true);
			}
		} catch (error) {
			setModalMessage(
				"Erro. Falha ao tentar atualizar senha, tente novamente."
			);
			setModalVisible(true);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<SafeAreaView className="bg-soft_white h-full">
			<ScrollView>
				<Header title={"Editar Usuário"} />

				<View style={styles.containerColumn}>
					<View style={[styles.table, styles.marginTop]}>
						<Text className="text-xl font-bold font-psemibold">
							Editar Função do Usuário
						</Text>

						<FormField
							title="Nome do Usuário"
							value={form.username}
							handleChangeText={() => {}}
							otherStyles="mt-4"
							editable={false}
						/>

						<View className="mt-8 space-y-2">
							<Text className="text-xl text-semibold font-psemibold">
								Permissão
							</Text>
							<SelectList
								setSelected={setSelectedPermission}
								data={permissionData}
								save="value"
								defaultOption={{
									key: selectedPermission,
									value: selectedPermission,
								}}
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

						<CustomButton
							title="Atualizar Função"
							handlePress={updateUser}
							containerStyles="mt-10"
							isLoading={isSubmitting}
						/>
					</View>

					<View style={styles.table}>
						<Text className="text-xl font-bold font-psemibold">
							Editar Senha do Usuário
						</Text>
						<FormField
							title="Nome do Usuário"
							value={form.username}
							handleChangeText={() => {}}
							otherStyles="mt-4"
							editable={false}
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
							title="Atualizar Senha"
							handlePress={updatePassword}
							containerStyles="mt-10"
							isLoading={isSubmitting}
						/>
					</View>

					<CustomButton
						title="Ativar/Inativar Usuário"
						handlePress={handleInactivateUser} // Ao clicar, exibirá o modal de confirmação
						containerStyles={"self-center bottom-0 p-4 w-96 mb-10"}
					/>
				</View>
			</ScrollView>
			<AlertModal
				visible={modalVisible}
				message={modalMessage}
				onClose={() => setModalVisible(false)}
			/>
			<ConfirmationModal
				visible={showConfirmationModal}
				message="Tem certeza que deseja (in)ativar este usuário?"
				onConfirm={confirmInactivateUser}
				onCancel={() => setShowConfirmationModal(false)}
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	containerColumn: {
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 20,
	},
	table: {
		padding: 10,
		marginVertical: 10,
		backgroundColor: "#f0f0f0",
		borderRadius: 10,
		padding: 20,
		width: "100%",
		maxWidth: 500,
	},
	marginTop: {
		marginTop: 20,
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

export default UserDetail;
