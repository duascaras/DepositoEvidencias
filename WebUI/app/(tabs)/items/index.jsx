import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import Header from "../../../components/Header";
import CustomButtom from "../../../components/CustomButtom";
import { router } from "expo-router";
import SearchInput from "../../../components/SearchInput";

const Items = () => {
	const [items, setItems] = useState([]);
	const [showItems, setShowItems] = useState(false);

	useEffect(() => {
		getItems();
	}, []);

	const goToDetails = async () => {
		router.push("items/item_details");
	};

	const newItem = async () => {
		router.push("items/new_item");
	};

	const getItems = async () => {
		const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}Itens/exibir-itens`;

		try {
			const response = await axios.get(API_URL);
			console.log("Response data:", response.data);
			setItems(response.data);
			setShowItems(true);
			console.log("Items state:", items);
		} catch (error) {
			if (error.response) {
				console.error("Error response:", error.response.data);
				console.error("Error status:", error.response.status);
				console.error("Error headers:", error.response.headers);
			} else if (error.request) {
				console.error("Error request:", error.request);
			} else {
				console.error("Error message:", error.message);
			}
		}
	};

	return (
		<SafeAreaView className="bg-soft_white h-full">
			<View>
				<Header title={"Itens"}></Header>
			</View>

			<SearchInput />

			<View>
				{showItems ? (
					<FlatList
						data={items}
						keyExtractor={(item, index) => index.toString()}
						renderItem={({ item }) => (
							<View className={"mt-5 ml-5"}>
								<Text className={`text-xl font-bold`}>
									Nome do Item: {item.name}
								</Text>
								<CustomButtom
									title="Detalhes"
									handlePress={goToDetails}
									containerStyles="mt-4"
								/>
							</View>
						)}
					/>
				) : (
					<Text>Loading...</Text>
				)}
			</View>

			<View>
				<CustomButtom
					title="Novo Item"
					handlePress={newItem}
					containerStyles="mt-80"
				/>
			</View>
		</SafeAreaView>
	);
};

export default Items;
