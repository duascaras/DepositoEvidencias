import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import FormField from "../../../components/FormField";
import CustomButton from "../../../components/CustomButton";
import Header from "../../../components/Header";
import ConfirmationModal from "../../../components/ConfirmationModal";
import AlertModal from "../../../components/AlertModal";

const AnalysisDetails = () => {
	const { id } = useLocalSearchParams();
	const [form, setForm] = useState({
		laudo: "",
		analysisType: "",
		itemName: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [modalVisibleSave, setModalVisibleSave] = useState(false);
	const [modalVisibleSend, setModalVisibleSend] = useState(false);
	const [alertVisible, setAlertVisible] = useState(false);
	const [alertMessage, setAlertMessage] = useState("");
	const router = useRouter();

	useEffect(() => {
		const getAnalysis = async () => {
			try {
				const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}Analyses/Analysis-detail/${id}`;
				const response = await axios.get(API_URL);
				if (response.status === 200) {
					const analysisData = response.data;
					setForm({
						laudo: analysisData.laudo || "",
						analysisType: analysisData.analysisType || "",
						itemName: analysisData.itemId || "",
					});
				} else {
					showAlert("Erro ao buscar os dados da análise");
				}
			} catch (error) {
				showAlert(error.message);
			}
		};

		setForm({
			laudo: "",
			analysisType: "",
			itemName: "",
		});

		getAnalysis();
	}, [id]);

	const saveAnalysis = async () => {
		if (!form.laudo || !form.analysisType) {
			showAlert("Por favor, preencha todos os campos.");
			return;
		}

		setIsSubmitting(true);

		const requestBody = {
			laudo: form.laudo,
			analysisType: form.analysisType,
		};

		try {
			const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}Analyses/Edit-Analysis/${id}`;
			const response = await axios.put(API_URL, requestBody);

			if (response.status === 200) {
				showAlert("Análise atualizada com sucesso.");
				router.push("/analysis");
			} else {
				showAlert("Erro ao atualizar a análise");
			}
		} catch (error) {
			showAlert(error.response.data);
		} finally {
			setIsSubmitting(false);
		}
	};

	const sendAnalysis = async () => {
		setIsSubmitting(true);

		try {
			const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}Analyses/Send-Analysis/${id}`;
			const response = await axios.put(API_URL);

			if (response.status === 200) {
				showAlert("Análise enviada com sucesso.");
				router.push("/analysis");
			} else {
				showAlert("Erro ao enviar a análise");
			}
		} catch (error) {
			console.log(error);
			showAlert(error.message.response);
		} finally {
			setIsSubmitting(false);
		}
	};

	const openModalSave = () => {
		setModalVisibleSave(true);
	};

	const openModalSend = () => {
		setModalVisibleSend(true);
	};

	const closeModalSave = () => {
		setModalVisibleSave(false);
	};

	const closeModalSend = () => {
		setModalVisibleSend(false);
	};

	const confirmSaveAnalysis = () => {
		closeModalSave();
		saveAnalysis();
	};

	const confirmSendAnalysis = () => {
		closeModalSend();
		sendAnalysis();
	};

	const cancel = () => {
		router.push("/analysis");
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
				<Header title={"Editar Análises"} />

				<View style={styles.containerColumn}>
					<View style={styles.table}>
						<Text className="text-xl font-bold font-psemibold">
							Informe as Análises realizadas:
						</Text>
						<Text className="text-lg mt-4">
							Item: {form.itemName}
						</Text>

						<FormField
							title="Laudo"
							value={form.laudo}
							handleChangeText={(e) =>
								setForm({ ...form, laudo: e })
							}
							otherStyles="mt-4"
						/>

						<FormField
							title="Análises Feitas"
							value={form.analysisType}
							handleChangeText={(e) =>
								setForm({ ...form, analysisType: e })
							}
							otherStyles="mt-8"
						/>

						<View className="flex flex-row justify-between mt-10">
							<CustomButton
								title="Cancelar"
								handlePress={cancel}
								containerStyles="flex-1 mr-2"
							/>
							<CustomButton
								title="Salvar"
								handlePress={openModalSave}
								containerStyles="flex-1 ml-2 bg-red-500"
								isLoading={isSubmitting}
							/>
						</View>
					</View>
				</View>
				<CustomButton
					title="Finalizar Análise"
					handlePress={openModalSend}
					containerStyles="mt-6 self-center bottom-0 p-4 w-96 mb-6"
				/>
			</ScrollView>

			<ConfirmationModal
				visible={modalVisibleSave}
				message="Confirmar salvar análise?"
				onConfirm={confirmSaveAnalysis}
				onCancel={closeModalSave}
			/>

			<ConfirmationModal
				visible={modalVisibleSend}
				message="Confirmar enviar análise?"
				onConfirm={confirmSendAnalysis}
				onCancel={closeModalSend}
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
		marginTop: 70,
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
});

export default AnalysisDetails;
