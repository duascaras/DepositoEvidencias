import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";

import CustomButton from "../../../components/CustomButton";
import FormField from "../../../components/FormField";
import Header from "../../../components/Header";

const NewItem = ({ onItemCreated }) => {
	const [form, setForm] = useState({
		name: "",
		code: "",
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();

	useFocusEffect(
		React.useCallback(() => {
			setForm({
				name: "",
				code: "",
			});
		}, [])
	);

	const submit = async () => {
		if (!form.name || !form.code) {
			alert("Preencha todos os campos.");
			return;
		}

		setIsSubmitting(true);
		try {
			const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}Itens/create-item`;
			const response = await axios.post(API_URL, form);

			if (response.status === 200) {
				alert(response.data);
				if (onItemCreated && typeof onItemCreated === "function") {
					onItemCreated();
				}
				router.push("items");
			} else {
				alert("Erro inesperado. Tente novamente");
			}
		} catch (error) {
			alert(error.response.data);
		} finally {
			setIsSubmitting(false);
		}
	};

	const cancel = () => {
		router.push("items");
	};

	return (
		<SafeAreaView className="bg-soft_white h-full">
			<ScrollView>
				<View>
					<Header title={"Novo Item"} />
				</View>

				<View className="w-full justify-center min-h-[60vh] px-14">
					<FormField
						title="Nome"
						value={form.name}
						handleChangeText={(e) => setForm({ ...form, name: e })}
						otherStyles="mt-10"
					/>

					<FormField
						title="Código"
						value={form.code}
						handleChangeText={(e) => setForm({ ...form, code: e })}
						otherStyles="mt-8"
					/>

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
		</SafeAreaView>
	);
};

export default NewItem;
