import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";

import FormField from "../../../components/FormField";
import CustomButton from "../../../components/CustomButton"; // Fix typo from CustomButton to CustomButton

const AnalysisDetails = ({ onAnalysisUpdated }) => {
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
				const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}Analyses/Analysis-detail/${id}`;
				const response = await axios.get(API_URL);
				if (response.status === 200) {
					const analysisData = response.data;
					setForm({
						laudo: analysisData.laudo,
						analysisType: analysisData.analysisType,
					});
				} else {
					alert("Error", "Failed to fetch analysis data.");
				}
			} catch (error) {
				alert("Error", "Failed to fetch analysis data.");
				console.error("Error:", error);
			}
		};

		getAnalysis();
	}, [id]);

	const submit = async () => {
		setIsSubmitting(true);

		try {
			const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}Analyses/Edit-Analysis/${id}`;
			const response = await axios.put(API_URL, form);

			if (response.status === 200) {
				alert("Success", "Analysis updated successfully.");
				if (onAnalysisUpdated) onAnalysisUpdated(); // Notify parent about the update
				router.push("/analysis");
			} else {
				alert("Error", "Failed to update analysis. Please try again.");
			}
		} catch (error) {
			alert("Error", "Failed to update analysis. Please try again.");
			console.error("Error:", error);
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
							setForm({ ...form, analysisType: e })
						}
						otherStyles="mt-8"
					/>

					<View className="flex flex-row justify-between mt-20">
						<CustomButton
							title="Confirmar"
							handlePress={submit}
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
			</ScrollView>
		</SafeAreaView>
	);
};

export default AnalysisDetails;
