import React, { useState } from "react";
import { View, ScrollView, Image, TouchableOpacity, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import axios from "axios";

import { icons } from "../../../constants";
import CustomButton from "../../../components/CustomButton";
import FormField from "../../../components/FormField";
import Header from "../../../components/Header";
import ConfirmationModal from "../../../components/ConfirmationModal";
import AlertModal from "../../../components/AlertModal";
import CameraComponent from "../../../components/Camera";

const NewAnalysis = ({ onItemCreated }) => {
	const [form, setForm] = useState({ code: "" });
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [cameraVisible, setCameraVisible] = useState(false);
	const [confirmationVisible, setConfirmationVisible] = useState(false);
	const [alertVisible, setAlertVisible] = useState(false);
	const [modalMessage, setModalMessage] = useState("");
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
			showAlert("Por favor, preencha todos os campos.");
			return;
		}

		setModalMessage("Confirmar envio de análise?");
		setConfirmationVisible(true);
	};

	const handleConfirmation = () => {
		setConfirmationVisible(false);
		sendAnalysis();
	};

	const cancel = () => {
		router.push("analysis");
	};

	const sendAnalysis = async () => {
		setIsSubmitting(true);
		try {
			const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}Analyses/Create-Analysis/1`;
			const response = await axios.post(API_URL, form);

			if (response.status === 200) {
				showAlert("Success. Analysis created successfully");
				router.push("analysis");
			} else {
				showAlert("Something went wrong. Please try again.");
			}
		} catch (error) {
			showAlert("Failed to create analysis. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const showAlert = (message) => {
		setModalMessage(message);
		setAlertVisible(true);
	};

	const closeAlert = () => {
		setAlertVisible(false);
	};

	return (
		<SafeAreaView className="bg-soft_white h-full">
			<ScrollView>
				<Header title={"Nova Análise"} />

				<View>
					<Modal
						visible={cameraVisible}
						animationType="slide"
						transparent={true}
					>
						<CameraComponent
							onClose={handleCloseCamera}
							onCodeScanned={handleCodeScanned}
						/>
					</Modal>
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
							title="Cancelar"
							handlePress={cancel}
							containerStyles="flex-1 mr-2"
						/>
						<CustomButton
							title="Confirmar"
							handlePress={() => setConfirmationVisible(true)}
							containerStyles="flex-1 ml-2 bg-red-500"
							isLoading={isSubmitting}
						/>
					</View>
				</View>
			</ScrollView>

			<ConfirmationModal
				visible={confirmationVisible}
				message={modalMessage}
				onConfirm={handleConfirmation}
				onCancel={() => setConfirmationVisible(false)}
			/>

			<AlertModal
				visible={alertVisible}
				message={modalMessage}
				onClose={closeAlert}
			/>
		</SafeAreaView>
	);
};

export default NewAnalysis;
