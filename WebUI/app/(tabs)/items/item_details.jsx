import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import axios from "axios";

import Header from "../../../components/Header";
import CustomButtom from "../../../components/CustomButtom";
import { router } from "expo-router";

const ItemDetails = () => {
	const [items, setItems] = useState([]);
	const [showItems, setShowItems] = useState(false);

	useEffect(() => {
		getItems();
	}, []);

	const goToDetails = async () => {
		router.push("items/item_details");
	};

	const getItems = async () => {
		const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}Itens/exibir-itens`;

		try {
			const response = await axios.get(API_URL);
			setItems(response.data);
			setShowItems(true);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	return (
		<SafeAreaView className="bg-soft_white h-full">
			<View>
				<Header title={"Editar Itens"}></Header>
			</View>

			<View>
				{showItems && (
					<FlatList
						data={items}
						keyExtractor={(_item, index) => index.toString()}
						renderItem={({ item }) => (
							<View className={"mt-5 ml-5"}>
								<Text className={`text-xl  font-bold`}>
									Nome: {item.name}
								</Text>

								<Text className={`text-xl  font-bold`}>
									Código: {item.code}
								</Text>

								<Text className={`text-xl  font-bold`}>
									Status: {item.isActive}
								</Text>

								<CustomButtom
									title="Aplicar Alterações"
									handlePress={goToDetails}
									containerStyles="mt-4"
								/>

								<CustomButtom
									title="Cancelar"
									handlePress={goToDetails}
									containerStyles="mt-4"
								/>
							</View>
						)}
					/>
				)}
			</View>

			<View>
				<CustomButtom title="Novo item" containerStyles="mt-60" />
			</View>
		</SafeAreaView>
	);
};

export default ItemDetails;
