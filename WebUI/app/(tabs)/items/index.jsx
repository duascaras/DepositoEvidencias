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
import CustomButton from "../../../components/CustomButtom";
import { router } from "expo-router";
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

	useEffect(() => {
		getItems(currentPage);
	}, []);

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
		const pageSize = 5;
		const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}Itens/exibir-itens?page=${page}&pageSize=${pageSize}`;

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
			console.error("Error:", error);
		} finally {
			setIsLoading(false);
		}
	};

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

	const qrCodePopUp = async (item) => {
		const id = item.id;
		const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}Analyses/GenerateCode/b460c987-0539-4a92-97ed-ad287499ee14/${id}`;

		try {
			const response = await axios.post(API_URL);
			const data = response.data.code;
			alert(data);
		} catch (error) {
			alert("Error 1");
		} finally {
			setIsLoading(false);
		}
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

	return (
		<SafeAreaView className="bg-soft_white h-full">
			<Header title={"Itens"} />

			<SearchInput initialQuery={query} onSearch={setQuery} />

			{isLoading ? (
				<ActivityIndicator size="large" color="#0000ff" />
			) : (
				<View>
					{showItems ? (
						<FlatList
							data={filteredItems}
							keyExtractor={(item) => item.id.toString()}
							renderItem={({ item }) => (
								<View className="flex-row mt-10 self-center items-center h-14 px-4 rounded-2xl border-2 w-96">
									<TouchableOpacity
										onPress={() => qrCodePopUp(item)}
									>
										<Image
											source={icons.qrcode}
											className="w-10 h-10"
											resizeMode="contain"
										/>
									</TouchableOpacity>

									<Text className="text-xl ml-4 mt-0.5 text-black flex-1 font-pregular">
										{item.name}
									</Text>

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
						<Text>No items to display</Text>
					)}

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
				</View>
			)}

			<View className="absolute self-center bottom-0 p-4 w-96 mb-10">
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
