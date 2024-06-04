import React, { useEffect, useState, useCallback } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import CustomButton from "../../components/CustomButton";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";

const Home = () => {
	const [pendingCount, setPendingCount] = useState(0);
	const router = useRouter();

	const fetchPendingCount = useCallback(async () => {
		const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}Analyses/Analysis-pending-confirmed`;

		try {
			const response = await axios.get(API_URL);
			setPendingCount(response.data.total);
		} catch (error) {
			alert("Erro ao buscar análises pendentes: " + error);
		}
	}, []);

	useEffect(() => {
		fetchPendingCount();
	}, [fetchPendingCount]);

	const goToItems = async () => {
		router.push("/items");
	};

	const goToAnalysis = async () => {
		router.push("/analysis");
	};

	const goToAdmin = async () => {
		router.push("/admin");
	};

	const goToPending = async () => {
		router.push("/pending");
	};

	return (
		<SafeAreaView className="bg-soft_white h-full">
			<Header title={"Página Inicial"} />

			<View className="w-full justify-center min-h-[60vh] px-14">
				<CustomButton
					title="Itens"
					handlePress={goToItems}
					containerStyles="mt-20"
				/>

				<CustomButton
					title="Análises"
					handlePress={goToAnalysis}
					containerStyles="mt-20"
				/>

				<CustomButton
					title="Administrador"
					handlePress={goToAdmin}
					containerStyles="mt-20"
				/>

				<View className="relative mt-20">
					<CustomButton
						title="Pendentes"
						handlePress={goToPending}
						containerStyles=""
					/>
					{pendingCount > 0 && (
						<View className="absolute top-0 right-0 bg-red-500 rounded-full h-6 w-6 flex items-center justify-center">
							<Text className="text-soft_white mr-2 text-sm sm:text-xl mt-2 font-bold">
								{pendingCount}
							</Text>
						</View>
					)}
				</View>
			</View>
		</SafeAreaView>
	);
};

export default Home;
