import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, View, Text } from "react-native";

const AnalysisDetails = () => {
	const { id } = useLocalSearchParams(); // Removed the type assertion here

	// TODO: Aguardar get/id do brancão para exibir os detalhes

	return (
		<View>
			<Text>Analysis Details for ID: {id}</Text>
		</View>
	);
};

export default AnalysisDetails;
