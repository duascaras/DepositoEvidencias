import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import CustomButton from "../../../components/CustomButtom";

const Items = () => {
	const [items, setItems] = useState([]);
	const [showItems, setShowItems] = useState(false);

	useEffect(() => {
		getItems();
	}, []);

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
		<SafeAreaView style={{ flex: 1 }}>
			<View>
				<Text style={{ fontSize: 24, marginBottom: 20 }}>Itens</Text>
				{showItems &&
					items.map((item, index) => (
						<View key={index}>
							<Text>Name: {item.name}</Text>
							<Text>Code: {item.code}</Text>
							<Text>Create Date: {item.createDate}</Text>
							{/* Add more fields here as needed */}
							<View style={{ paddingBottom: 20 }}>
								<CustomButton
									title="Detalhes"
									onPress={getItems}
								/>
							</View>
						</View>
					))}
			</View>
			<View style={{ paddingBottom: 20 }}>
				<CustomButton title="Novo Item" onPress={getItems} />
			</View>
		</SafeAreaView>
	);
};

export default Items;
