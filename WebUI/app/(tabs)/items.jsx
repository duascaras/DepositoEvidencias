import { View, Text } from "react-native";
import React from "react";
import { router } from "expo-router";

import CustomButtom from "../../components/CustomButtom";
import { SafeAreaView } from "react-native-safe-area-context";

const createItem = async () => {
	router.push("/new_item");
};

const Items = () => {
	return (
		<SafeAreaView className="bg-soft_white h-full">
			<View className="bg-blue">
				<Text className="text-4xl text-soft_white text-primary my-10 font-bold text-center ">
					Itens
				</Text>
			</View>

			<View className="w-full justify-center items-center min-h-[10vh] px-14">
				<CustomButtom
					title="Novo Item"
					handlePress={createItem}
					containerStyles="mt-20"
				/>
			</View>
		</SafeAreaView>
	);
};

export default Items;
