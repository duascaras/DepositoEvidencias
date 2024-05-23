import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";

import FormField from "../../../components/FormField";
import CustomButtom from "../../../components/CustomButtom";

const AnalysisDetails = () => {
	const { id } = useLocalSearchParams();
	const [form, setForm] = useState({
		laudo: "",
		analysisType: "",
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const getAnalysis = async () => {
			try {
				const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}Analyses/Analysis-Datail${id}`;
				const response = await axios.get(API_URL);
				if (response.status === 200) {
					const analysisData = response.data;
					setForm({
						laudo: analysisData.laudo,
						analysisType: analysisData.analysisType,
					});
				} else {
					alert("Error 1");
				}
			} catch (error) {
				alert("Error 2");
			}
		};

		getAnalysis();
	}, [id]);

	const submit = async () => {
		setIsSubmitting(true);

		try {
			const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}Account/update-user/${id}`;
			const response = await axios.put(API_URL, form);

			if (response.status === 200) {
				alert("Success", "User updated successfully.");
				router.push("/(tabs)/admin");
			} else {
				alert("Error", "Failed to update user. Please try again.");
			}
		} catch (error) {
			alert("Error", "Failed to update user. Please try again.");
			console.error("Error:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const cancel = () => {
		router.push("analysis");
	};

	return (
		<SafeAreaView className="bg-soft_white h-full">
			<ScrollView>
				<View className="bg-blue">
					<Text className="text-4xl text-soft_white text-primary text-semibold my-10 font-psemibold text-center">
						Editar Análises
					</Text>
				</View>

				<View className="w-full justify-center min-h-[60vh] px-14">
					<FormField
						title="Laudo"
						value={form.laudo}
						handleChangeText={(e) => setForm({ ...form, laudo: e })}
						otherStyles="mt-8"
					/>

					<FormField
						title="Análises Feitas"
						value={form.analysisType}
						handleChangeText={(e) =>
							setForm({ ...form, analysisDone: e })
						}
						otherStyles="mt-8"
					/>

					<View className="flex flex-row justify-between mt-20">
						<CustomButtom
							title="Confirmar"
							handlePress={submit}
							containerStyles="flex-1 mr-2"
							isLoading={isSubmitting}
						/>
						<CustomButtom
							title="Cancelar"
							handlePress={cancel}
							containerStyles="flex-1 ml-2 bg-red-500"
						/>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	pickerContainer: {
		height: 64, // Adjust height to match your FormField height
		backgroundColor: "#2A316E",
		borderRadius: 16, // Adjust borderRadius to match your FormField
		borderWidth: 2,
		borderColor: "#000",
		justifyContent: "center",
		paddingHorizontal: 16, // Adjust padding to match your FormField
	},
	// picker: {
	// 	color: "#F6F7F7", // Set text color
	// },
	pickerItem: {
		fontSize: 18, // Adjust fontSize to match your FormField
		fontWeight: "bold", // Set fontWeight to match your FormField
		textAlign: "center", // Center the text
	},
});

export default AnalysisDetails;
