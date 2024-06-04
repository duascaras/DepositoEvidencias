import React, { useEffect, useState } from "react";
import { Camera, CameraView, useCameraPermissions } from "expo-camera";
import * as Clipboard from "expo-clipboard";
import {
	Button,
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { icons } from "../constants";

export default function CameraComponent({ onClose, onCodeScanned }) {
	const [permission, requestPermission] = useCameraPermissions();
	const [hasPermission, setHasPermission] = useState(null);

	useEffect(() => {
		(async () => {
			const { status } = await Camera.requestCameraPermissionsAsync();
			setHasPermission(status === "granted");
		})();
	}, []);

	if (!permission) {
		return <View />;
	}

	if (!permission.granted) {
		return (
			<View>
				<Text style={{ textAlign: "center" }}>
					Por favor, aceite a permissão para utilizar o recurso da
					Camera.
				</Text>
				<Button onPress={requestPermission} title="Aceitar Permissão" />
			</View>
		);
	}

	const handleCodeScanned = async ({ data }) => {
		await Clipboard.setStringAsync(data);
		onCodeScanned(data);
		onClose();
	};

	return (
		<View className="p-5 max-h-max">
			<CameraView onBarcodeScanned={handleCodeScanned}>
				<TouchableOpacity
					className="max-h-max max-w-max"
					onPress={onClose}
				>
					<Image
						source={icons.disabled}
						className="max-h-max max-w-max"
					/>
				</TouchableOpacity>
			</CameraView>
		</View>
	);
}
