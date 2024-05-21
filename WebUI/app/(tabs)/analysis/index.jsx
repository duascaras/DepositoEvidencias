import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import Header from "../../../components/Header";
import CustomButtom from "../../../components/CustomButtom";
import { Link, router } from "expo-router";
import SearchInput from "../../../components/SearchInput";
import { icons } from "../../../constants";

const Analysis = () => {
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

	const newAnalysis = () => {
		router.push({
			pathname: "analysis/new_analysis",
			params: { onItemCreated: getItems },
		});
	};

	const editAnalyis = (item) => {
		router.push({
			pathname: `/analysis/${item.id}`,
			params: { id: item.id },
		});
	};

	return (
		<SafeAreaView className="bg-soft_white h-full">
			<Header title={"Análises"} />

			<SearchInput initialQuery={query} onSearch={setQuery} />

			<View>
				{showItems ? (
					<FlatList
						data={filteredItems}
						keyExtractor={(_item, index) => index.toString()}
						renderItem={({ item }) => (
							<View className="flex-row mt-10 self-center items-center h-14 px-4 rounded-2xl border-2 w-96">
								<Text className="text-xl ml-4 mt-0.5 text-white flex-1 font-pregular">
									{item.name}
								</Text>

								<TouchableOpacity
									onPress={() => editAnalyis(item)}
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
					title="Nova Análise"
					handlePress={newAnalysis}
					containerStyles="w-full"
				/>
			</View>
		</SafeAreaView>
	);
};

export default Analysis;
