import React from "react";
import { View } from "react-native";
import { router } from "expo-router";
import CustomButton from "../../components/CustomButton";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";

const Home = () => {
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

	return (
		<SafeAreaView className="bg-soft_white h-full">
			<Header title={"Página Inicial"} />

			<View className="px-14">
				<CustomButton
					title="Itens"
					handlePress={goToItems}
					containerStyles="mt-28 md:mt-20"
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

				<View className="relative mt-20">
					<CustomButton title="Pendentes" handlePress={goToPending} />
				</View>
			</View>
		</SafeAreaView>
	);
};

export default Home;
