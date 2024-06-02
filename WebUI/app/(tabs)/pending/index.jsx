import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import CustomButton from "../../../components/CustomButton";
import Header from "../../../components/Header";

const Pending = () => {
	// const [items, setItems] = useState([]);
	// const [showItems, setShowItems] = useState(false);

	// useEffect(() => {
	// 	getItems();
	// }, []);

	// const getItems = async () => {
	// const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}Itens/exibir-itens`;

	// 	try {
	// 		const response = await axios.get(API_URL);
	// 		setItems(response.data);
	// 		setShowItems(true);
	// 	} catch (error) {
	// 		console.error("Error fetching data:", error);
	// 	}
	// };

	// TODO: Add tailwind styles
	return (
		<SafeAreaView className="bg-soft_white h-full">
			<View>
				<Header title={"Confirmações Pendentes"}></Header>
			</View>
		</SafeAreaView>
	);
};

export default Pending;
