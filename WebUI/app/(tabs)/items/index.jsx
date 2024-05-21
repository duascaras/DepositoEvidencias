import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import Header from "../../../components/Header";
import CustomButtom from "../../../components/CustomButtom";
import { Link, router } from "expo-router";
import SearchInput from "../../../components/SearchInput";
import { icons } from "../../../constants";

const Items = () => {
	const [items, setItems] = useState([]);
	const [showItems, setShowItems] = useState(false);
	const [filteredItems, setFilteredItems] = useState([]);
	const [query, setQuery] = useState("");

	useEffect(() => {
		getItems();
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

	const getItems = async () => {
		const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}Itens/exebir-itens`;

		try {
			const response = await axios.get(API_URL);
			setItems(response.data);
			setFilteredItems(response.data);
			setShowItems(true);
		} catch (error) {
			console.error("Error:", error);
		}
	};

	const newItem = () => {
		router.push({
			pathname: "items/new_item",
			params: { onItemCreated: getItems },
		});
	};

	const editItem = (item) => {
		router.push({
			pathname: `/items/${item.id}`,
			params: { id: item.id },
		});
	};

	const qrCodePopUp = () => {
		// TODO: Add the CustomQRCode component here
		console.log("QRCode");
	};

	return (
		<SafeAreaView className="bg-soft_white h-full">
			<Header title={"Itens"} />

			<SearchInput initialQuery={query} onSearch={setQuery} />

			<View>
				{showItems ? (
					<FlatList
						data={filteredItems}
						keyExtractor={(_item, index) => index.toString()}
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

								<Text className="text-xl ml-4 mt-0.5 text-white flex-1 font-pregular">
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
					<Text>Loading...</Text>
				)}
			</View>

			<View className="absolute self-center bottom-0 p-4 w-96 mb-10">
				<CustomButtom
					title="Novo Item"
					handlePress={newItem}
					containerStyles="w-full"
				/>
			</View>
		</SafeAreaView>
	);
};

export default Items;
