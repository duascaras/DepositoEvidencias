import React, { useState, useEffect, useRef } from "react";
import { View, ScrollView, Image, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import axios from "axios";
import { Camera } from "expo-camera";
import * as Clipboard from "expo-clipboard";

import { icons } from "../../../constants";
import CustomButton from "../../../components/CustomButton";
import FormField from "../../../components/FormField";
import Header from "../../../components/Header";

const NewAnalysis = ({ onItemCreated }) => {
	const [form, setForm] = useState({
		code: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [cameraPermission, setCameraPermission] = useState(null);
	const [scannerPermission, setScannerPermission] = useState(null);
	const [cameraVisible, setCameraVisible] = useState(false);
	const [scanned, setScanned] = useState(false);
	const cameraRef = useRef(null);
	const router = useRouter();

	useEffect(() => {
		const requestPermissions = async () => {
			const cameraStatus = await Camera.requestCameraPermissionsAsync();
			setCameraPermission(cameraStatus.status === "granted");

			const scannerStatus =
				await BarCodeScanner.requestPermissionsAsync();
			setScannerPermission(scannerStatus.status === "granted");
		};

		requestPermissions();
	}, []);

	const handleCameraPress = () => {
		if (!cameraPermission || !scannerPermission) {
			Alert.alert(
				"Permissions not granted",
				"Camera and Scanner permissions are required."
			);
			return;
		}
		setCameraVisible(true);
	};

	const handleBarCodeScanned = async ({ type, data }) => {
		setScanned(true);
		Alert.alert("QR Code Scanned", `Scanned QR code: ${data}`);
		await Clipboard.setStringAsync(data);
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
			</ScrollView>
			{cameraVisible && (
				<View style={{ flex: 1 }}>
					<Camera
						style={{ flex: 1 }}
						type={Camera.Constants.Type.back}
						ref={cameraRef}
					>
						<BarCodeScanner
							onBarCodeScanned={
								scanned ? undefined : handleBarCodeScanned
							}
							style={{ flex: 1 }}
						/>
					</Camera>
				</View>
			)}
		</SafeAreaView>
	);
};

export default NewAnalysis;
