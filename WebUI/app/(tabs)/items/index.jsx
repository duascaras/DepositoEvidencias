import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import axios from "axios";

import Header from "../../../components/Header";
import CustomButtom from "../../../components/CustomButtom";
import List from "../../../components/List";
import { router } from "expo-router";

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
		const API_URL = "http://localhost:5021/api/Itens/exibir-itens";

		try {
			const response = await axios.get(API_URL);
			setItems(response.data);
			setShowItems(true);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	// TODO: Add tailwind styles
	return (
		<SafeAreaView className="bg-soft_white h-full">
			<View>
				<Header title={"Itens"}></Header>
			</View>

			<View>
				{showItems && (
					<List
						data={items}
						keyExtractor={(_item, index) => index.toString()}
						renderItem={({ item }) => (
							<View className={"mt-5 ml-5"}>
								<Text className={`text-xl  font-bold`}>
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
