import React, { useEffect, useState } from "react";
import { Camera, CameraView, useCameraPermissions } from "expo-camera";
import * as Clipboard from "expo-clipboard";
import {
	Button,
	Image,
	Text,
	TouchableOpacity,
	View,
	Modal,
	StyleSheet,
} from "react-native";
import { icons } from "../constants";

export default function CameraComponent({ onClose, onCodeScanned, visible }) {
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
			<Modal
				animationType="slide"
				transparent={false}
				visible={visible}
				onRequestClose={onClose}
			>
				<View style={styles.permissionContainer}>
					<Text style={styles.permissionText}>
						Por favor, aceite a permissão para utilizar o recurso da
						Camera.
					</Text>
					<Button
						onPress={requestPermission}
						title="Aceitar Permissão"
					/>
					<Button onPress={onClose} title="Fechar" />
				</View>
			</Modal>
		);
	}

	const handleCodeScanned = async ({ data }) => {
		await Clipboard.setStringAsync(data);
		onCodeScanned(data);
		onClose();
	};

	return (
		<Modal
			animationType="slide"
			transparent={false}
			visible={visible}
			onRequestClose={onClose}
		>
			<View style={styles.cameraContainer}>
				<CameraView
					onBarcodeScanned={handleCodeScanned}
					style={styles.camera}
				>
					<View style={styles.closeButtonContainer}>
						<TouchableOpacity onPress={onClose}>
							<Image
								source={icons.disabled}
								style={styles.closeButton}
							/>
						</TouchableOpacity>
					</View>
				</CameraView>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	permissionContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	permissionText: {
		textAlign: "center",
		marginBottom: 20,
	},
	cameraContainer: {
		flex: 1,
	},
	camera: {
		flex: 1,
	},
	closeButtonContainer: {
		position: "absolute",
		bottom: 50,
		left: 0,
		right: 0,
		alignItems: "center",
	},
	closeButton: {
		width: 100,
		height: 100,
	},
});
