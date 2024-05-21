import React, { useState } from "react";
import {
	View,
	ScrollView,
	Text,
	Alert,
	Image,
	TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import axios from "axios";

import { icons } from "../../../constants";
import CustomButtom from "../../../components/CustomButtom";
import FormField from "../../../components/FormField";
import Header from "../../../components/Header";

const NewAnalysis = ({ onItemCreated }) => {
	const [form, setForm] = useState({
		code: "",
	});

	const [isSubmitting, setisSubmitting] = useState(false);

	const submit = async () => {
		setisSubmitting(true);

		try {
			const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}Itens/novo-item`;
			const response = await axios.post(API_URL, form);

			if (response.status === 200) {
				Alert.alert("Success", "Analysis created successfully");
				onItemCreated(); // Trigger the callback
				router.push("analysis");
			} else {
				Alert.alert("Error", "Something went wrong. Please try again.");
			}
		} catch (error) {
			Alert.alert(
				"Error",
				"Failed to create analysis. Please try again."
			);
			console.error("Error:", error);
		} finally {
			setisSubmitting(false);
		}
	};

	const cancel = () => {
		router.push("analysis");
	};

	const handleCameraPress = () => {
		console.log("Camera Pressed");
	};

	return (
		<SafeAreaView className="bg-soft_white h-full">
			<ScrollView>
				<View>
					<Header title={"Nova Análise"} />
				</View>

				<View className="w-full justify-center min-h-[60vh] px-14">
					<View className="flex-row items-center mt-10">
						<FormField
							title="Código"
							value={form.code}
							handleChangeText={(e) =>
								setForm({ ...form, code: e })
							}
							otherStyles="flex-1"
						/>
						<TouchableOpacity
							onPress={handleCameraPress}
							className="ml-4"
						>
							<Image
								source={icons.camera}
								className="w-10 h-10 mt-7"
								resizeMode="contain"
							/>
						</TouchableOpacity>
					</View>

					<View className="flex flex-row justify-between mt-20">
						<CustomButtom
							title="Confirmar"
							handlePress={submit}
							containerStyles="flex-1 mr-2"
							isLoading={isSubmitting}
						/>
						<CustomButtom
							title="Cancelar"
							handlePress={cancel}
							containerStyles="flex-1 ml-2 bg-red-500"
						/>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default NewAnalysis;
