import React, { useCallback, useEffect, useState } from "react";
import {
	View,
	Text,
	FlatList,
	TouchableOpacity,
	ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import Header from "../../../components/Header";

const Pending = () => {
	const [analyses, setAnalyses] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const fetchPendingAnalyses = useCallback(async () => {
		const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}Analyses/Analysis-pending-confirmed`;

		try {
			setIsLoading(true);
			const response = await axios.get(API_URL);
			setAnalyses(response.data.data);
		} catch (error) {
			alert(error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const confirmAnalysis = async (analysisId) => {
		const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}Analyses/Confirm-Analysis/${analysisId}`;

		try {
			await axios.put(API_URL);
			alert("Análise confirmada com sucesso!");
			fetchPendingAnalyses();
		} catch (error) {
			alert("Erro ao confirmar a análise: " + error);
		}
	};

	useEffect(() => {
		fetchPendingAnalyses();
	}, [fetchPendingAnalyses]);

	const renderItem = ({ item }) => (
		<View className="flex-row mt-2 items-center p-4 bg-white rounded-xl border-2 border-gray-300 shadow-sm mx-4">
			<View className="flex-1">
				<Text className="text-lg text-black font-pregular">
					{item.itemId}
				</Text>
				<Text className="text-gray-500">
					Written by: {item.writtenUserId}
				</Text>
			</View>
			<TouchableOpacity
				onPress={() => confirmAnalysis(item.id)}
				className="bg-green-500 p-2 rounded"
			>
				<Text className="text-white">Confirmar</Text>
			</TouchableOpacity>
		</View>
	);

	return (
		<SafeAreaView className="bg-soft_white h-full">
			<Header title={"Confirmar Análises"} />
			<View className="p-4">
				{isLoading ? (
					<ActivityIndicator
						size="large"
						color="#0000ff"
						className="flex-1 justify-center items-center"
					/>
				) : (
					<FlatList
						data={analyses}
						keyExtractor={(item) => item.id.toString()}
						renderItem={renderItem}
						ListEmptyComponent={
							<Text className="text-center mt-4">
								Nenhuma análise pendente
							</Text>
						}
					/>
				)}
			</View>
		</SafeAreaView>
	);
};

export default Pending;
