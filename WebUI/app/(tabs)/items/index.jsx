import React, { useEffect, useState, useCallback } from "react";
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
import { router, useFocusEffect } from "expo-router";
import SearchInput from "../../../components/SearchInput";
import { icons } from "../../../constants";

const Items = () => {
	const [items, setItems] = useState([]);
	const [showItems, setShowItems] = useState(false);
	const [filteredItems, setFilteredItems] = useState([]);
	const [query, setQuery] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [filter, setFilter] = useState("active");

	const getItems = useCallback(
		async (page) => {
			const pageSize = 6;
			let endpoint;
			switch (filter) {
				case "active":
					endpoint = "exibir-itens";
					break;
				case "inactive":
					endpoint = "exibir-itens-inativos";
					break;
				case "inAnalysis":
					endpoint = "exibir-itens-inAnalysis";
					break;
				default:
					endpoint = "exibir-itens";
			}
			const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}Itens/${endpoint}?page=${page}&pageSize=${pageSize}`;

			try {
				setIsLoading(true);
				const response = await axios.get(API_URL);
				const { total, data: items } = response.data;
				setItems(items);
				setFilteredItems(items);

				const totalPages = Math.ceil(total / pageSize);
				setTotalPages(totalPages);
				setShowItems(true);
			} catch (error) {
				alert(error);
			} finally {
				setIsLoading(false);
			}
		},
		[filter]
	);

	const qrCodePopUp = async (item) => {
		const id = item.id;
		const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}Analyses/GenerateCode/b460c987-0539-4a92-97ed-ad287499ee14/${id}`;

		try {
			const response = await axios.post(API_URL);
			const data = response.data.code;
			alert(data);
		} catch (error) {
			alert(error);
		} finally {
			setIsLoading(false);
		}
	};

	useFocusEffect(
		useCallback(() => {
			getItems(currentPage);
		}, [currentPage, getItems])
	);

	useEffect(() => {
		getItems(currentPage);
	}, [currentPage, getItems, filter]);

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

	const newItem = () => {
		router.push({
			pathname: "items/new_item",
			params: { onItemCreated: () => getItems },
		});
	};

	const editItem = (item) => {
		router.push({
			pathname: `/items/${item.id}`,
			params: { id: item.id },
		});
	};

	const handleNextPage = () => {
		if (currentPage < totalPages) {
			setCurrentPage(currentPage + 1);
			getItems(currentPage + 1);
		}
	};

	const handlePreviousPage = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
			getItems(currentPage - 1);
		}
	};

	const handleFilterChange = (newFilter) => {
		setFilter(newFilter);
		setCurrentPage(1);
	};

	return (
		<SafeAreaView className="bg-soft_white h-full relative">
			<Header title={"Itens"} />
			<View className="p-4">
				<SearchInput initialQuery={query} onSearch={setQuery} />
				<View className="flex-row justify-between mt-4">
					<TouchableOpacity
						className={`p-2 border-2 rounded ${
							filter === "active"
								? "bg-blue-500 border-black"
								: "bg-gray-300 border-gray-300 opacity-50"
						}`}
						onPress={() => handleFilterChange("active")}
						disabled={filter === "active"}
					>
						<Text
							className={`text-white ${
								filter === "active" ? "" : "text-black"
							}`}
						>
							Ativos
						</Text>
					</TouchableOpacity>
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
							Inativos
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
					{showItems ? (
						<FlatList
							data={filteredItems}
							keyExtractor={(item) => item.id.toString()}
							renderItem={({ item }) => (
								<View className="flex-row mt-2 items-center p-4 bg-white rounded-xl border-2 border-gray-300 shadow-sm mx-4">
									{filter === "inAnalysis" ? (
										<Image
											source={icons.qrcodeChecked}
											className="w-10 h-10"
											resizeMode="contain"
										/>
									) : filter === "inactive" ? (
										<TouchableOpacity
											onPress={() => editItem(item)}
										>
											<Image
												source={icons.disabled}
												className="w-10 h-10"
												resizeMode="contain"
											/>
										</TouchableOpacity>
									) : (
										<TouchableOpacity
											onPress={() => qrCodePopUp(item)}
										>
											<Image
												source={icons.qrcode}
												className="w-10 h-10"
												resizeMode="contain"
											/>
										</TouchableOpacity>
									)}
									<TouchableOpacity
										className="ml-4 flex-1"
										onPress={() => editItem(item)}
									>
										<Text className="text-lg text-black font-pregular">
											{item.name}
										</Text>
										<Text className="text-gray-500">
											ID: {item.id}, Created by:{" "}
											{item.userName}
										</Text>
									</TouchableOpacity>
									<TouchableOpacity
										onPress={() => editItem(item)}
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
						<Text className="text-center mt-4">
							No items to display
						</Text>
					)}
				</View>
			)}

			{showItems && (
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

			<View className="self-center bottom-0 p-4 w-96 mb-10">
				<CustomButton
					title="Novo Item"
					handlePress={newItem}
					containerStyles="w-full"
				/>
			</View>
		</SafeAreaView>
	);
};

export default Items;
