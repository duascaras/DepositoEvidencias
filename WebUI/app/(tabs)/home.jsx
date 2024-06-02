import { View, Text } from "react-native";
import { React } from "react";
import { router } from "expo-router";

import CustomButton from "../../components/CustomButton";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";

const goToItems = async () => {
	router.push("/items");
};

const goToAnalysis = async () => {
	router.push("/analysis");
};

const goToAdmin = async () => {
	router.push("/admin");
};

const goToPending = async () => {
	router.push("/pending");
};

const Home = () => {
	return (
		<SafeAreaView className="bg-soft_white h-full">
			<View>
				<Header title={"Página Inicial"} />
			</View>

			<View className="w-full justify-center min-h-[60vh] px-14">
				<CustomButton
					title="Itens"
					handlePress={goToItems}
					containerStyles="mt-20"
				/>

				<CustomButton
					title="Análises"
					handlePress={goToAnalysis}
					containerStyles="mt-20"
				/>

				<CustomButton
					title="Administrador"
					handlePress={goToAdmin}
					containerStyles="mt-20"
				/>

				<CustomButton
					title="Pendentes"
					handlePress={goToPending}
					containerStyles="mt-20"
				/>
			</View>
		</SafeAreaView>
	);
};

export default Home;
