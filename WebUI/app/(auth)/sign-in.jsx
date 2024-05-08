import { View, ScrollView, Text, Alert, Platform } from "react-native";
import { React, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import CustomButtom from "../../components/CustomButtom";
import FormField from "../../components/FormField";

const SignIn = () => {
	const [form, setForm] = useState({
		username: "",
		password: "",
	});

	const [isSubmitting, setisSubmitting] = useState(false);

	const submit = async () => {
		router.push("/sign-up");
		// 	if (!form.username || !form.password) {
		// 		Alert.alert("Error", "Please fill in all the fields");
		// 	}
		// 	setisSubmitting(true);
		// 	try {
		// 		await signIn(form.username, form.password);
		// 		// TODO: set it to global state
		// 		router.replace("/home");
		// 	} catch (error) {
		// 		console.log("Error", error.message);
		// 	} finally {
		// 		setisSubmitting(false);
		// 	}
	};

	return (
		<SafeAreaView className="bg-soft_white h-full">
			<ScrollView>
				{/* TODO: set this to a header component file */}
				<View className="bg-blue">
					<Text className="text-4xl text-soft_white text-primary text-semibold my-10 font-psemibold text-center ">
						Login
					</Text>
				</View>

				<View className="w-full justify-center min-h-[60vh] px-14">
					<FormField
						title="Usuário"
						value={form.username}
						handleChangeText={(e) =>
							setForm({ ...form, username: e })
						}
						otherStyles="mt-32"
						keyboardType="email-address"
					/>

					<FormField
						title="Senha"
						value={form.password}
						handleChangeText={(e) =>
							setForm({ ...form, password: e })
						}
						otherStyles="mt-10"
					/>

					<CustomButtom
						title="Entrar"
						handlePress={submit}
						containerStyles="mt-20"
						isLoading={isSubmitting}
					/>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default SignIn;
