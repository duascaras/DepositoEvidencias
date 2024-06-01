import React, { useCallback, useEffect, useState } from "react";
import {
	View,
	Text,
	FlatList,
	TouchableOpacity,
	Image,
	Button,
	ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import Header from "../../../components/Header";
import CustomButton from "../../../components/CustomButton";
import { useFocusEffect, useRouter } from "expo-router";
import SearchInput from "../../../components/SearchInput";
import { icons } from "../../../constants";

const Analysis = () => {
	const [analyses, setAnalyses] = useState([]);
	const [showAnalyses, setShowAnalyses] = useState(false);
	const [filteredAnalyses, setFilteredAnalyses] = useState([]);
	const [query, setQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	useFocusEffect(
		useCallback(() => {
			getAnalyses(currentPage);
		}, [currentPage])
	);

	useEffect(() => {
		if (query) {
			const filtered = analyses.filter((analysis) =>
				analysis.itemId.toLowerCase().includes(query.toLowerCase())
			);
			setFilteredAnalyses(filtered);
		} else {
			setFilteredAnalyses(analyses);
		}
	}, [query, analyses]);

	const getAnalyses = async (page) => {
		const pageSize = 5;
		const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}Analyses/Typing-analysis?page=${page}&pageSize=${pageSize}`;

		try {
			setIsLoading(true);
			const response = await axios.get(API_URL);
			const { total, data: analyses } = response.data;
			setAnalyses(analyses);
			setFilteredAnalyses(analyses);

			const totalPages = Math.ceil(total / pageSize);
			setTotalPages(totalPages);
			setShowAnalyses(true);
		} catch (error) {
			console.error("Error:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const newAnalysis = () => {
		router.push({
			pathname: "analysis/new_analysis",
			params: { onItemCreated: () => getAnalyses(currentPage) },
		});
	};

	const editAnalysis = (analysis) => {
		router.push({
			pathname: `/analysis/${analysis.id}`,
			params: { id: analysis.id },
		});
	};

	const handleNextPage = () => {
		if (currentPage < totalPages) {
			setCurrentPage(currentPage + 1);
		}
	};

	const handlePreviousPage = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	return (
		<SafeAreaView className="bg-soft_white h-full">
			<Header title={"Análises"} />
			<View className="p-4">
				<SearchInput initialQuery={query} onSearch={setQuery} />
			</View>
			<View>
				{isLoading ? (
					<ActivityIndicator size="large" color="#0000ff" />
				) : showAnalyses ? (
					<FlatList
						data={filteredAnalyses}
						keyExtractor={(analysis) => analysis.id.toString()}
						renderItem={({ item }) => (
							<View className="flex-row mt-2 items-center p-4 bg-white rounded-xl border-2 border-gray-300 shadow-sm mx-4">
								<TouchableOpacity
									onPress={() => editAnalysis(item)}
								>
									<Image
										source={icons.checklist}
										className="w-10 h-10"
										resizeMode="contain"
									/>
								</TouchableOpacity>
								<TouchableOpacity
									className="ml-4 flex-1"
									onPress={() => editAnalysis(item)}
								>
									<Text className="text-lg text-black font-pregular">
										{item.itemId}
									</Text>
									<Text className="text-gray-500">
										Written by: {item.writtenUserId}
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={() => editAnalysis(item)}
								>
									<Image
										source={icons.edit}
										className="w-6 h-6"
										resizeMode="contain"
									/>
								</TouchableOpacity>
							</View>
						)}
					/>
				) : (
					<Text>No analyses to display</Text>
				)}
			</View>

			{showAnalyses && (
				<View className="absolute bottom-0 w-full flex-row justify-between p-1 bg-soft_white border-t border-gray-300">
					<TouchableOpacity
						className={`bg-blue-500 border-2 border-black p-2 rounded ${
							currentPage === 1 ? "opacity-50" : ""
						}`}
						onPress={handlePreviousPage}
						disabled={currentPage === 1}
					>
						<Text className="text-sm text-center text-white">
							Anterior
						</Text>
					</TouchableOpacity>

					<Text className="text-lg self-center p-2 text-black font-pregular text-center">
						Page {currentPage} of {totalPages}
					</Text>

					<TouchableOpacity
						className={`bg-blue-500 border-2 border-black p-2 rounded ${
							currentPage === totalPages ? "opacity-50" : ""
						}`}
						onPress={handleNextPage}
						disabled={currentPage === totalPages}
					>
						<Text className="text-sm text-center text-white">
							Próxima
						</Text>
					</TouchableOpacity>
				</View>
			)}

			<View className="absolute self-center bottom-0 p-4 w-96 mb-10">
				<CustomButton
					title="Nova Análise"
					handlePress={newAnalysis}
					containerStyles="w-full"
				/>
			</View>
		</SafeAreaView>
	);
};

export default Analysis;
