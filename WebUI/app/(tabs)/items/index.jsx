import React, { useEffect, useState, useCallback } from "react";
import {
	View,
	Text,
	FlatList,
	TouchableOpacity,
	Image,
	ActivityIndicator,
	TouchableWithoutFeedback,
	Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import Header from "../../../components/Header";
import CustomButton from "../../../components/CustomButton";
import { router, useFocusEffect } from "expo-router";
import SearchInput from "../../../components/SearchInput";
import { icons } from "../../../constants";
import { useAuth } from "../../../context/AuthContext";
import QRCode from "react-native-qrcode-svg";
import AlertModal from "../../../components/AlertModal";

const Items = () => {
	const { userId } = useAuth();
	const [items, setItems] = useState([]);
	const [showItems, setShowItems] = useState(false);
	const [filteredItems, setFilteredItems] = useState([]);
	const [query, setQuery] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [, setTotalPages] = useState(1);
	const [filter, setFilter] = useState("active");
	const [qrCodeData, setQrCodeData] = useState(null);
	const [alertVisible, setAlertVisible] = useState(false);
	const [alertMessage, setAlertMessage] = useState("");

	const showAlert = (message) => {
		setAlertMessage(message);
		setAlertVisible(true);
	};

	const closeAlert = () => {
		setAlertVisible(false);
	};

	const getItems = useCallback(
		async (page) => {
			const pageSize = 1000;
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
				showAlert(
					"Você não possui as permissões necessárias para visualizar itens inativos."
				);
				setFilter("active");
				router.push("items");
			} finally {
				setIsLoading(false);
			}
		},
		[filter]
	);

	const qrCodePopUp = async (item) => {
		if (!userId) {
			showAlert("Erro: Tente novamente");
			return;
		}
		const id = item.id;
		const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}Analyses/GenerateCode/${userId}/${id}`;

		try {
			setIsLoading(true);
			const response = await axios.post(API_URL);
			const data = response.data.code;
			setQrCodeData(data);
		} catch (error) {
			showAlert(
				"Você não possui as permissões necessárias para gerar QRCode."
			);
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
		});
	};

	const handleFilterChange = (newFilter) => {
		setFilter(newFilter);
		setCurrentPage(1);
	};

	const closeQRCode = () => {
		setQrCodeData(null);
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
								<View className="flex-row mt-2 items-center p-4 bg-white rounded-xl border-2 border-gray-300 boxShadow-sm mx-4">
									{filter === "inAnalysis" ? (
										<>
											<Image
												source={icons.qrcodeChecked}
												className="w-10 h-10"
												resizeMode="contain"
											/>
											<View className="ml-4 flex-1">
												<Text className="text-lg text-black font-pregular">
													{item.name}
												</Text>
												<Text className="text-gray-500">
													por: {item.userName}
												</Text>
											</View>
										</>
									) : filter === "inactive" ? (
										<>
											<Image
												source={icons.disabled}
												className="w-10 h-10"
												resizeMode="contain"
											/>
											<TouchableOpacity
												className="ml-4 flex-1"
												onPress={() => editItem(item)}
											>
												<Text className="text-lg text-black font-pregular">
													{item.name}
												</Text>
												<Text className="text-gray-500">
													por: {item.userName}
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
										</>
									) : (
										<>
											<TouchableOpacity
												onPress={() =>
													qrCodePopUp(item)
												}
											>
												<Image
													source={icons.qrcode}
													className="w-10 h-10"
													resizeMode="contain"
												/>
											</TouchableOpacity>
											<TouchableOpacity
												className="ml-4 flex-1"
												onPress={() => editItem(item)}
											>
												<Text className="text-lg text-black font-pregular">
													{item.name}
												</Text>
												<Text className="text-gray-500">
													por: {item.userName}
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
										</>
									)}
								</View>
							)}
						/>
					) : (
						<Text className="text-center mt-4">
							Sem Itens para exibir.
						</Text>
					)}
				</View>
			)}

			<View className="self-center bottom-0 p-4 w-96 mb-2">
				<CustomButton
					title={"Novo Item"}
					handlePress={newItem}
					containerStyles={"w-full"}
				/>
			</View>

			<Modal
				visible={!!qrCodeData}
				transparent={true}
				animationType="slide"
			>
				<TouchableWithoutFeedback onPress={closeQRCode}>
					<View className="flex-1 full justify-center items-center bg-black bg-opacity-50">
						<View className="bg-soft_white p-4 rounded-lg">
							<Text className="mb-4 text-black text-2xl font-bold font-pmsemibold text-center">
								{qrCodeData}
							</Text>
							{qrCodeData && (
								<QRCode size={250} value={qrCodeData} />
							)}
							<TouchableOpacity
								onPress={closeQRCode}
								className="mt-4 p-2 rounded"
							>
								<Text className="text-black font-bold font-pmsemibold text-center">
									Fechar
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</TouchableWithoutFeedback>
			</Modal>

			<AlertModal
				visible={alertVisible}
				message={alertMessage}
				onClose={closeAlert}
			/>
		</SafeAreaView>
	);
};

export default Items;
