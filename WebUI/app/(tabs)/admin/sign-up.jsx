import { View, ScrollView, Text, Alert } from "react-native";
import { React, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import CustomButtom from "../../../components/CustomButtom";
import FormField from "../../../components/FormField";

const SignUp = () => {
	const [form, setForm] = useState({
		name: "",
		username: "",
		user: "",
		password: "",
	});

	const [isSubmitting, setisSubmitting] = useState(false);

	const submit = async () => {
		router.push("/admin");
		// if (!form.name || !form.username || !form.user || !form.password) {
		// 	Alert.alert("Error", "Please fill in all the fields");
		// }
		// setisSubmitting(true);
		// try {
		// 	// const result = await createUser(
		// 	// 	form.name,
		// 	// 	form.username,
		// 	// 	form.user,
		// 	// 	form.password
		// 	// );
		// 	// TODO: set it to global state
		// 	router.push("/home");
		// } catch (error) {
		// 	Alert.alert("Error", error.message);
		// } finally {
		// 	setisSubmitting(false);
		// }
	};

	return (
		<SafeAreaView className="bg-soft_white h-full">
			<ScrollView>
				<View className="bg-blue">
					<Text className="text-4xl text-soft_white text-primary text-semibold my-10 font-psemibold text-center ">
						Criar Usuário
					</Text>
				</View>

				<View className="w-full justify-center min-h-[60vh] px-14">
					<FormField
						title="Nome"
						value={form.name}
						handleChangeText={(e) => setForm({ ...form, name: e })}
						otherStyles="mt-10"
					/>

					<FormField
						title="Nome do Usuário"
						value={form.name}
						handleChangeText={(e) => setForm({ ...form, name: e })}
						otherStyles="mt-8"
					/>

					<FormField
						title="Permissão"
						value={form.user}
						handleChangeText={(e) => setForm({ ...form, user: e })}
						otherStyles="mt-8"
						keyboardType="user-address"
					/>

					<FormField
						title="Senha"
						value={form.password}
						handleChangeText={(e) =>
							setForm({ ...form, password: e })
						}
						otherStyles="mt-8"
					/>

					<CustomButtom
						title="Criar"
						handlePress={submit}
						containerStyles="mt-20"
						isLoading={isSubmitting}
					/>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default SignUp;
