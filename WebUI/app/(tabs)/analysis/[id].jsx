import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";

import FormField from "../../../components/FormField";
import CustomButton from "../../../components/CustomButton";
import Header from "../../../components/Header";

const AnalysisDetails = ({ onAnalysisUpdated }) => {
	const { id } = useLocalSearchParams();
	const [form, setForm] = useState({
		laudo: "",
		analysisType: "",
		itemName: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
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
					alert("Error fetching analysis data");
				}
			} catch (error) {
				alert(error);
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
		setIsSubmitting(true);

		const requestBody = {
			laudo: form.laudo,
			analysisType: form.analysisType,
		};

		try {
			const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}Analyses/Edit-Analysis/${id}`;
			const response = await axios.put(API_URL, requestBody);

			if (response.status === 200) {
				alert("Analysis updated successfully.");
				if (onAnalysisUpdated) onAnalysisUpdated();
				router.push("/analysis");
			} else {
				alert("Error updating analysis");
			}
		} catch (error) {
			alert(error.message);
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
				alert("Analysis sent successfully.");
				router.push("/analysis");
			} else {
				alert("Error sending analysis");
			}
		} catch (error) {
			alert(error.message);
		} finally {
			setIsSubmitting(false);
		}
	};

	const cancel = () => {
		router.push("/analysis");
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
							Item: {form.itemName} {/* Display the item name */}
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

						<View style={styles.buttonContainer}>
							<CustomButton
								title="Salvar"
								handlePress={saveAnalysis}
								containerStyles="flex-1 mr-2"
								isLoading={isSubmitting}
							/>
							<CustomButton
								title="Cancelar"
								handlePress={cancel}
								containerStyles="flex-1 ml-2 bg-red-500"
							/>
						</View>
					</View>
				</View>
				<CustomButton
					title="Enviar Análise"
					handlePress={sendAnalysis}
					containerStyles={"self-center bottom-0 p-4 w-96 mb-6"}
				/>
			</ScrollView>
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
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 20,
	},
});

export default AnalysisDetails;
