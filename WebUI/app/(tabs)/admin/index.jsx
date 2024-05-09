import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { router } from "expo-router";

import CustomButtom from "../../../components/CustomButtom";
import { SafeAreaView } from "react-native-safe-area-context";

const createUser = async () => {
	router.push("admin/sign-up");
};

const Admin = () => {
	return (
		<SafeAreaView className="bg-soft_white h-full">
			<View className="bg-blue">
				<Text className="text-4xl text-soft_white text-primary text-semibold my-10 font-psemibold text-center ">
					Administrador
				</Text>
			</View>

			<View className="w-full justify-center items-center min-h-[10vh] px-14">
				<CustomButtom
					title="Criar Usuário"
					handlePress={createUser}
					containerStyles="mt-20"
				/>
			</View>
		</SafeAreaView>
	);
};

export default Admin;

const styles = StyleSheet.create({});
