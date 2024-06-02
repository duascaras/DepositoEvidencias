import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Alert, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import FormField from "../../../components/FormField";
import CustomButton from "../../../components/CustomButton";
import { SelectList } from "react-native-dropdown-select-list";
import Header from "../../../components/Header";

const ItemDetails = ({ onItemUpdated }) => {
	const { id } = useLocalSearchParams();
	const [form, setForm] = useState({
		name: "",
		code: "",
		isActive: true,
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();

	const statusOptions = [
		{ key: "true", value: "Ativo" },
		{ key: "false", value: "Inativo" },
	];

	useEffect(() => {
		const getItem = async () => {
			try {
				const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}Itens/exibir-item/${id}`;
				const response = await axios.get(API_URL);
				if (response.status === 200) {
					const itemData = response.data;
					setForm({
						name: itemData.name,
						code: itemData.code,
						isActive: itemData.isActive,
					});
				} else {
					alert("Failed to fetch item data.");
				}
			} catch (error) {
				alert(error);
				console.error("Error:", error);
			}
		};

		getItem();
	}, [id]);

	const updateItem = async () => {
		setIsSubmitting(true);

		try {
			const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}Itens/edit/${id}`;
			const response = await axios.put(API_URL, {
				name: form.name,
				code: form.code,
				isActive: form.isActive,
			});

			if (response.status === 200) {
				alert("Success", "Item updated successfully.");
				if (onItemUpdated) onItemUpdated();
				router.push("/(tabs)/items");
			} else {
				alert("Failed to update item. Please try again.");
			}
		} catch (error) {
			alert(error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const cancel = () => {
		router.push("/(tabs)/items");
	};

	return (
		<SafeAreaView className="bg-soft_white h-full">
			<ScrollView>
				<Header title={"Editar Itens"} />

				<View className="w-full justify-center min-h-[60vh] px-14">
					<FormField
						title="Nome"
						value={form.name}
						handleChangeText={(e) => setForm({ ...form, name: e })}
						otherStyles="mt-8"
					/>

					<FormField
						title="Código"
						value={form.code}
						handleChangeText={(e) => setForm({ ...form, code: e })}
						otherStyles="mt-8"
					/>

					<Text className="text-xl text-semibold font-psemibold mt-8">
						Status
					</Text>
					<SelectList
						setSelected={(val) =>
							setForm({ ...form, isActive: val === "true" })
						}
						data={statusOptions}
						save="key"
						defaultOption={{
							key: String(form.isActive),
							value: form.isActive ? "Ativo" : "Inativo",
						}}
						boxStyles={styles.selectListBox}
						inputStyles={styles.selectListInput}
						dropdownStyles={styles.selectListDropdown}
						dropdownItemStyles={styles.selectListDropdownItem}
						dropdownTextStyles={styles.selectListDropdownText}
					/>

					<View className="flex flex-row justify-between mt-20">
						<CustomButton
							title="Confirmar"
							handlePress={updateItem}
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

const styles = StyleSheet.create({
	selectListBox: {
		height: 60,
		borderWidth: 2,
		borderColor: "black",
		paddingLeft: 16,
		paddingRight: 16,
		borderRadius: 14,
		padding: 8,
	},
	selectListInput: {
		color: "#000000",
		marginTop: 6.5,
	},
	selectListDropdown: {
		borderColor: "black",
	},
	selectListDropdownItem: {
		padding: 8,
	},
	selectListDropdownText: {
		color: "#000000",
	},
});

export default ItemDetails;
