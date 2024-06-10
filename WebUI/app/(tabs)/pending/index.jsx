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
import { useRouter } from "expo-router";
import ConfirmationModal from "../../../components/ConfirmationModal";
import AlertModal from "../../../components/AlertModal";

const Pending = () => {
	const [analyses, setAnalyses] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [alertVisible, setAlertVisible] = useState(false);
	const [alertMessage, setAlertMessage] = useState("");
	const [confirmationVisible, setConfirmationVisible] = useState(false);
	const [selectedAnalysisId, setSelectedAnalysisId] = useState(null);
	const router = useRouter();

	const showAlert = (message) => {
		setAlertMessage(message);
		setAlertVisible(true);
	};

	const closeAlert = () => {
		setAlertVisible(false);
	};

	const fetchPendingAnalyses = useCallback(async () => {
		const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}Analyses/Analysis-pending-confirmed`;

		try {
			setIsLoading(true);
			const response = await axios.get(API_URL);
			setAnalyses(response.data.data);
		} catch (error) {
			showAlert("Você não possui as permissões necessárias.");
		} finally {
			setIsLoading(false);
		}
	}, []);

	const confirmAnalysis = async () => {
		const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}Analyses/Confirm-Analysis/${selectedAnalysisId}`;

		try {
			await axios.put(API_URL);
			showAlert("Análise confirmada com sucesso!");
			fetchPendingAnalyses();
		} catch (error) {
			showAlert(error.message);
		} finally {
			setConfirmationVisible(false);
		}
	};

	useEffect(() => {
		fetchPendingAnalyses();
	}, [fetchPendingAnalyses]);

	const renderItem = ({ item }) => (
		<TouchableOpacity
			onPress={() => router.push(`/pending/${item.id}`)}
			className="flex-row mt-2 items-center p-4 bg-white rounded-xl border-2 border-gray-300 shadow-sm mx-4"
		>
			<View className="flex-1">
				<Text className="text-lg text-black font-pregular">
					{item.itemId}
				</Text>
				<Text className="text-gray-500">
					Written by: {item.writtenUserId}
				</Text>
			</View>
			<TouchableOpacity
				onPress={() => {
					setSelectedAnalysisId(item.id);
					setConfirmationVisible(true);
				}}
				className="bg-green-500 p-2 rounded"
			>
				<Text className="text-white">Confirmar</Text>
			</TouchableOpacity>
		</TouchableOpacity>
	);

	return (
		<SafeAreaView className="bg-soft_white h-full">
			<Header title={"Pendentes"} />
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
								Nenhuma análise pendente e/ou falta de acesso.
							</Text>
						}
					/>
				)}
			</View>
			<ConfirmationModal
				visible={confirmationVisible}
				onConfirm={confirmAnalysis}
				onCancel={() => setConfirmationVisible(false)}
				message="Tem certeza de que deseja confirmar a devolução desse item?"
			/>
			<AlertModal
				visible={alertVisible}
				message={alertMessage}
				onClose={closeAlert}
			/>
		</SafeAreaView>
	);
};

export default Pending;
