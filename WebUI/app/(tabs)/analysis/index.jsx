import React, { useCallback, useEffect, useState } from "react";
import {
	View,
	Text,
	FlatList,
	TouchableOpacity,
	Image,
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
	const [filter, setFilter] = useState("inAnalysis");
	const router = useRouter();

	const getAnalyses = useCallback(
		async (page) => {
			const pageSize = 1000;
			let endpoint;
			switch (filter) {
				case "inactive":
					endpoint = "Analyses/Analysis-confirmed";
					break;
				default:
					endpoint = "Analyses/Typing-analysis";
			}
			const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}${endpoint}?page=${page}&pageSize=${pageSize}`;

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
				alert(error);
			} finally {
				setIsLoading(false);
			}
		},
		[filter]
	);

	useFocusEffect(
		useCallback(() => {
			getAnalyses(currentPage);
		}, [currentPage, getAnalyses])
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

	const newAnalysis = () => {
		router.push({
			pathname: "analysis/new_analysis",
			params: { onItemCreated: () => getAnalyses(currentPage) },
		});
	};

	const editAnalysis = (analysis) => {
		router.push({
			pathname: `/analysis/${analysis.id}`,
		});
	};

	const handleFilterChange = (newFilter) => {
		setFilter(newFilter);
		setCurrentPage(1);
		getAnalyses(1);
	};

	return (
		<SafeAreaView className="bg-soft_white h-full relative">
			<Header title={"Análises"} />
			<View className="p-4">
				<SearchInput initialQuery={query} onSearch={setQuery} />
				<View className="flex-row justify-between mt-4">
					<TouchableOpacity
						className={`p-2 border-2 rounded ${
							filter === "inAnalysis"
								? "bg-blue-500 border-black"
								: "bg-gray-300 border-gray-300 opacity-50"
						}`}
						onPress={() => handleFilterChange("inAnalysis")}
						disabled={filter === "inAnalysis"}
					>
						<Text
							className={`text-white ${
								filter === "inAnalysis" ? "" : "text-black"
							}`}
						>
							Em Análise
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						className={`p-2 border-2 rounded ${
							filter === "inactive"
								? "bg-blue-500 border-black"
								: "bg-gray-300 border-gray-300 opacity-50"
						}`}
						onPress={() => handleFilterChange("inactive")}
						disabled={filter === "inactive"}
					>
						<Text
							className={`text-white ${
								filter === "inactive" ? "" : "text-black"
							}`}
						>
							Finalizadas
						</Text>
					</TouchableOpacity>
				</View>
			</View>

			{isLoading ? (
				<ActivityIndicator
					size="large"
					color="#0000ff"
					className="flex-1 justify-center items-center"
				/>
			) : (
				<View className="flex-1">
					{showAnalyses ? (
						<FlatList
							data={filteredAnalyses}
							keyExtractor={(analysis) => analysis.id.toString()}
							renderItem={({ item }) => (
								<View className="flex-row mt-2 items-center p-4 bg-white rounded-xl border-2 border-gray-300 boxShadow-sm mx-4">
									<Image
										source={icons.checklist}
										className="w-10 h-10"
										resizeMode="contain"
									/>
									{filter === "inactive" ? (
										<View className="ml-4 flex-1">
											<Text className="text-lg text-black font-pregular">
												{item.itemId}
											</Text>
											<Text className="text-gray-500">
												por: {item.writtenUserId}
											</Text>
										</View>
									) : (
										<>
											<TouchableOpacity
												className="ml-4 flex-1"
												onPress={() =>
													editAnalysis(item)
												}
											>
												<Text className="text-lg text-black font-pregular">
													{item.itemId}
												</Text>
												<Text className="text-gray-500">
													por: {item.writtenUserId}
												</Text>
											</TouchableOpacity>
											<TouchableOpacity
												onPress={() =>
													editAnalysis(item)
												}
											>
												<Image
													source={icons.edit}
													className="w-6 h-6"
													resizeMode="contain"
												/>
											</TouchableOpacity>
										</>
									)}
								</View>
							)}
						/>
					) : (
						<Text className="text-center mt-4">
							Sem Análises para exibir.
						</Text>
					)}
				</View>
			)}

			<View className="self-center bottom-0 p-4 w-96 mb-2">
				<CustomButton
					title={"Iniciar Análise"}
					handlePress={newAnalysis}
					containerStyles={"w-full"}
				/>
			</View>
		</SafeAreaView>
	);
};

export default Analysis;
