import React, { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import CustomButton from "../../components/CustomButtom";
import Header from "../../components/Header";
import FormField from "../../components/FormField";

import { useAuth } from "../../context/AuthContext";

const SignIn = () => {
	const [form, setForm] = useState({ username: "", password: "" });
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { onLogin, authState } = useAuth();
	const router = useRouter();

	const submit = async () => {
		if (!form.username || !form.password) {
			alert("Por favor, preencha todos os campos.");
			return;
		}
		setIsSubmitting(true);
		try {
			const result = await onLogin(form.username, form.password);
			if (result.error) {
				alert(result.msg);
			} else {
				router.replace("/home");
			}
		} catch (error) {
			console.log("Error", error.message);
		} finally {
			setIsSubmitting(false);
		}
	};

	useEffect(() => {
		if (authState.authenticated) {
			router.replace("/home");
		}
	}, [authState]);

	return (
		<SafeAreaView className="bg-soft_white h-full">
			<ScrollView>
				<View>
					<Header title={"Login"} />
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

					<CustomButton
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
