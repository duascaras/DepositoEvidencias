import { View, Text } from "react-native";
import { React } from "react";
import { router } from "expo-router";

import CustomButtom from "../../components/CustomButtom";
import { SafeAreaView } from "react-native-safe-area-context";

const goToItems = async () => {
	router.push("/items");
};

const goToAnalysis = async () => {
	router.push("/analysis");
};

const goToAdmin = async () => {
	router.push("/admin");
};

const Home = () => {
	return (
		<SafeAreaView className="bg-soft_white h-full">
			<View className="bg-blue">
				<Text className="text-4xl text-soft_white text-primary text-semibold my-10 font-psemibold text-center ">
					Página Inicial
				</Text>
			</View>

			<View className="w-full justify-center min-h-[60vh] px-14">
				<CustomButtom
					title="Itens"
					handlePress={goToItems}
					containerStyles="mt-20"
				/>

				<CustomButtom
					title="Análises"
					handlePress={goToAnalysis}
					containerStyles="mt-20"
				/>

				<CustomButtom
					title="Administrador"
					handlePress={goToAdmin}
					containerStyles="mt-20"
				/>
			</View>
		</SafeAreaView>
	);
};

export default Home;
