import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import { router } from "expo-router";

import CustomButtom from "../../../components/CustomButtom";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../components/Header";

const DATA = [
	{
		id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
		title: "First Item",
	},
	{
		id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
		title: "Second Item",
	},
	{
		id: "58694a0f-3da1-471f-bd96-145571e29d72",
		title: "Third Item",
	},
];

const Item = ({ title }) => (
	<View>
		<Text>{title}</Text>
	</View>
);

const createUser = async () => {
	router.push("admin/sign-up");
};

const Admin = () => {
	return (
		<SafeAreaView className="bg-soft_white h-full">
			<View>
				<Header title={"Administrador"}></Header>
			</View>

			<View>
				<FlatList
					data={DATA}
					renderItem={({ item }) => <Item title={item.title} />}
					keyExtractor={(item) => item.id}
				/>
			</View>

			<View className="w-full justify-center items-center min-h-[10vh] px-14">
				<CustomButtom
					title="Criar Novo Usuário"
					handlePress={createUser}
					containerStyles="mt-96"
				/>
			</View>
		</SafeAreaView>
	);
};

export default Admin;
