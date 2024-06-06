import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	ActivityIndicator,
	StyleSheet,
	ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import Header from "../../../components/Header";
import CustomButton from "../../../components/CustomButton";

const PendingDetails = () => {
	const { id } = useLocalSearchParams();
	const [details, setDetails] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const getDetails = async () => {
			setIsLoading(true);
			try {
				const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}Analyses/Analysis-detail/${id}`;
				const response = await axios.get(API_URL);
				if (response.status === 200) {
					setDetails(response.data);
				} else {
					alert("Erro inesperado. Tente novamente");
				}
			} catch (error) {
				alert(error.response?.data || "Erro ao buscar detalhes");
			} finally {
				setIsLoading(false);
			}
		};

		getDetails();
	}, [id]);

	const confirmAnalysis = async () => {
		setIsSubmitting(true);
		try {
			const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}Analyses/Confirm-Analysis/${id}`;
			const response = await axios.put(API_URL);
			if (response.status === 200) {
				alert("Análise confirmada com sucesso!");
				router.push("/(tabs)/pending");
			} else {
				alert("Erro inesperado. Tente novamente");
			}
		} catch (error) {
			alert(error.response?.data || "Erro ao confirmar análise");
		} finally {
			setIsSubmitting(false);
		}
	};

	const cancel = () => {
		router.push("/(tabs)/pending");
	};

	const detailsData = [
		{ label: "Liberação para análise", value: details.authorizedUser },
		{ label: "Análise feita por", value: details.writtenUserId },
		{ label: "Item analisado", value: details.itemId },
		{ label: "Laudo", value: details.laudo },
		{ label: "Análises Realizadas", value: details.analysisType },
		{ label: "Inicio da Análise", value: "04/06/2024 - 18:44:45" },
		{ label: "Devolução da Análise", value: "06/06/2024 - 16:47:23" },
	];

	return (
		<SafeAreaView className="bg-soft_white h-full">
			<ScrollView>
				<Header title={"Pendente"} />

				<View style={styles.containerColumn}>
					{isLoading ? (
						<ActivityIndicator size="large" color="#0000ff" />
					) : (
						<ScrollView>
							{detailsData.map((item, index) => (
								<View
									key={index}
									style={styles.detailItemContainer}
								>
									<Text style={styles.detailLabel}>
										{item.label}:
									</Text>
									<Text style={styles.detailValue}>
										{item.value}
									</Text>
								</View>
							))}
						</ScrollView>
					)}
					<View className="flex flex-row justify-between mt-4">
						<CustomButton
							title="Confirmar"
							handlePress={confirmAnalysis}
							isLoading={isSubmitting}
						/>
						<CustomButton title="Cancelar" handlePress={cancel} />
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	containerColumn: {
		flexDirection: "column",
		justifyContent: "space-between",
		paddingHorizontal: 10,
	},
	table: {
		marginVertical: 10,
		backgroundColor: "#f0f0f0",
		borderRadius: 10,
		padding: 20,
	},
	container: {
		flex: 1,
	},
	detailItemContainer: {
		marginTop: 5,
		backgroundColor: "#fff",
		borderRadius: 8,
		padding: 15,
		marginVertical: 5,
	},
	detailLabel: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#333",
	},
	detailValue: {
		fontSize: 18,
		color: "#666",
		marginTop: 4,
	},
});

export default PendingDetails;
