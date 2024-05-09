import axios from "axios";
import { useState } from "react";
import { View, Text, SafeAreaView } from "react-native";

export const getItems = async () => {
	const API_URL = "http://localhost:5021/api/Itens/exibir-itens";

	const [itemInfo, setItemInfo] = useState({});
	const { data } = await axios.get(API_URL);
	console.log(data);
	setItemInfo(data);

	return (
		<SafeAreaView>
			<View>
				<Text>Item: {itemInfo.name}</Text>
			</View>
		</SafeAreaView>
	);
};
