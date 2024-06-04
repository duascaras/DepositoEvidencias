import React, { useState } from "react";
import { View, ScrollView, Image, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import axios from "axios";

import { icons } from "../../../constants";
import CustomButton from "../../../components/CustomButton";
import FormField from "../../../components/FormField";
import Header from "../../../components/Header";
import CameraComponent from "../../../components/Camera";

const NewAnalysis = ({ onItemCreated }) => {
	const [form, setForm] = useState({ code: "" });
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [cameraVisible, setCameraVisible] = useState(false);
	const router = useRouter();

	const handleCameraPress = () => {
		setCameraVisible(true);
	};

	const handleCloseCamera = () => {
		setCameraVisible(false);
	};

	const handleCodeScanned = (data) => {
		setForm({ ...form, code: data });
		setCameraVisible(false);
	};

	const submit = async () => {
		if (!form.code) {
			alert("Por favor, preencha todos os campos.");
			return;
		}

		setIsSubmitting(true);
		try {
			const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}Analyses/Create-Analysis/2bba2917-f514-4eba-b51c-08b3be49cb6c`;
			const response = await axios.post(API_URL, form);

			if (response.status === 200) {
				alert("Success. Analysis created successfully");
				if (onItemCreated && typeof onItemCreated === "function") {
					onItemCreated();
				}
				router.push("analysis");
			} else {
				alert("Something went wrong. Please try again.");
			}
		} catch (error) {
			alert("Failed to create analysis. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const cancel = () => {
		router.push("analysis");
	};

	return (
		<SafeAreaView className="bg-soft_white h-full">
			<ScrollView>
				<View>
					<Header title={"Nova Análise"} />
				</View>

				{cameraVisible ? (
					<View>
						<CameraComponent
							onClose={handleCloseCamera}
							onCodeScanned={handleCodeScanned}
						/>
					</View>
				) : (
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
							<CustomButton
								title="Confirmar"
								handlePress={submit}
								containerStyles="flex-1 mr-2"
								isLoading={isSubmitting}
							/>
							<CustomButton
								title="Cancelar"
								handlePress={cancel}
								containerStyles="flex-1 ml-2 bg-red-500"
							/>
						</View>
					</View>
				)}
			</ScrollView>
		</SafeAreaView>
	);
};

export default NewAnalysis;
