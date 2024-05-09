import { View, Text } from "react-native";
import React from "react";
import { router } from "expo-router";

import CustomButtom from "../../../components/CustomButtom";
import { SafeAreaView } from "react-native-safe-area-context";

const analysisCreate = async () => {
	router.push("analysis/new_analysis");
};

const analysisDetails = async () => {
	router.push("analysis/analysis_details");
};

const Analysis = () => {
	return (
		<SafeAreaView className="bg-soft_white h-full">
			<View className="bg-blue">
				<Text className="text-4xl text-soft_white text-primary text-semibold my-10 font-psemibold text-center ">
					Análises
				</Text>
			</View>

			<View className="w-full justify-center items-center min-h-[10vh] px-14">
				<CustomButtom
					title="Nova Análise"
					handlePress={analysisCreate}
					containerStyles="mt-20"
				/>
			</View>

			<View className="w-full justify-center items-center min-h-[10vh] px-14">
				<CustomButtom
					title="Detalhes"
					handlePress={analysisDetails}
					containerStyles="mt-20"
				/>
			</View>
		</SafeAreaView>
	);
};

export default Analysis;
