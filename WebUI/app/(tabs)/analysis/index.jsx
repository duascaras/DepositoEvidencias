import React, { useEffect, useState } from "react";
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
import CustomButtom from "../../../components/CustomButtom";
import { router } from "expo-router";
import SearchInput from "../../../components/SearchInput";
import { icons } from "../../../constants";

const Analysis = () => {
	const [items, setItems] = useState([]);
	const [showItems, setShowItems] = useState(false);
	const [filteredItems, setFilteredItems] = useState([]);
	const [query, setQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		getItems(currentPage);
	}, [currentPage]);

	useEffect(() => {
		if (query) {
			const filtered = items.filter((item) =>
				item.name.toLowerCase().includes(query.toLowerCase())
			);
			setFilteredItems(filtered);
		} else {
			setFilteredItems(items);
		}
	}, [query, items]);

	const getItems = async (page) => {
		const pageSize = 5; // Number of items to display per page
		const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}Itens/exebir-itens?page=${page}&pageSize=${pageSize}`;

		try {
			const response = await axios.get(API_URL);
			const data = response.data;
			console.log("Number of items received:", data.length);
			setItems(data);
			setFilteredItems(data);

			const totalPages = Math.ceil(data.length / pageSize);
			console.log("Total pages:", totalPages);
			setTotalPages(totalPages);
			setShowItems(true);
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

			<SearchInput initialQuery={query} onSearch={setQuery} />

			<View>
				{isLoading ? (
					<ActivityIndicator size="large" color="#0000ff" />
				) : showItems ? (
					<FlatList
						data={filteredItems}
						keyExtractor={(analysis) => analysis.id}
						renderItem={({ item }) => (
							<View className="flex-row mt-10 self-center items-center h-14 px-4 rounded-2xl border-2 w-96">
								<Text className="text-xl ml-4 mt-0.5 text-white flex-1 font-pregular">
									{item.name}
								</Text>

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

			<View className="flex-row justify-between px-14 mt-4">
				<Button
					title="Previous"
					onPress={handlePreviousPage}
					disabled={currentPage === 1}
				/>
				<Text className="text-xl text-semibold font-psemibold">
					Page {currentPage} of {totalPages}
				</Text>
				<Button
					title="Next"
					onPress={handleNextPage}
					disabled={currentPage === totalPages}
				/>
			</View>

			<View className="absolute self-center bottom-0 p-4 w-96 mb-10">
				<CustomButtom
					title="Nova Análise"
					handlePress={newAnalysis}
					containerStyles="w-full"
				/>
			</View>
		</SafeAreaView>
	);
};

export default Analysis;
