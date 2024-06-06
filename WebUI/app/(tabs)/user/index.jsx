import React, { useState } from "react";
import { View, ScrollView, Text, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import FormField from "../../../components/FormField";
import CustomButton from "../../../components/CustomButton";
import Header from "../../../components/Header";
import { useRouter } from "expo-router";

const ChangePassword = () => {
	const [form, setForm] = useState({
		currentPassword: "",
		newPassword: "",
		confirmedPassword: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();

	const handleChangePassword = async () => {
		if (
			!form.currentPassword ||
			!form.newPassword ||
			!form.confirmedPassword
		) {
			alert("Por favor, preencha todos os campos.");
			return;
		}

		if (form.newPassword !== form.confirmedPassword) {
			alert("As senhas novas não coincidem.");
			return;
		}

		setIsSubmitting(true);
		try {
			const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}Account/edit-password-user`;

			const response = await axios.put(API_URL, form);

			if (response.status === 200) {
				alert("Senha alterada com sucesso.");
				router.push("/(tabs)/admin");
			} else {
				alert("Erro ao alterar a senha. Por favor, tente novamente.");
			}
		} catch (error) {
			alert(error.response.data);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<SafeAreaView className="bg-soft_white h-full">
			<ScrollView>
				<Header title={"Alterar Senha"} />
				<View style={styles.containerColumn}>
					<View style={styles.table}>
						<View className="space-y-2">
							<FormField
								title="Senha Atual"
								value={form.currentPassword}
								handleChangeText={(e) =>
									setForm({ ...form, currentPassword: e })
								}
								otherStyles="mt-8"
							/>
							<FormField
								title="Nova Senha"
								value={form.newPassword}
								handleChangeText={(e) =>
									setForm({ ...form, newPassword: e })
								}
								otherStyles="mt-8"
							/>
							<FormField
								title="Confirmar Nova Senha"
								value={form.confirmedPassword}
								handleChangeText={(e) =>
									setForm({ ...form, confirmedPassword: e })
								}
								otherStyles="mt-8"
							/>
						</View>

						<View className="flex flex-row justify-between mt-20">
							<CustomButton
								title="Confirmar"
								handlePress={handleChangePassword}
								containerStyles="flex-1 mr-2"
								isLoading={isSubmitting}
							/>

							<CustomButton
								title="Cancelar"
								handlePress={() => router.back()}
								containerStyles="flex-1 ml-2 bg-red-500"
							/>
						</View>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	containerColumn: {
		flexDirection: "column",
		justifyContent: "space-between",
		paddingHorizontal: 20,
		marginTop: 30,
	},
	table: {
		marginTop: 10,
		padding: 10,
		marginVertical: 10,
		backgroundColor: "#f0f0f0",
		borderRadius: 10,
		padding: 20,
	},
});

export default ChangePassword;
