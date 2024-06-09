import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "expo-router";
import { icons } from "../constants";

const Header = ({ title }) => {
	const { onLogout } = useAuth();
	const router = useRouter();

	const handleLogout = async () => {
		await onLogout();
		router.replace("/sign-in");
	};

	const navigateToUser = () => {
		router.push("/user");
	};

	return (
		<View className="bg-blue flex-row justify-between items-center px-4 py-4">
			<Text className="text-3xl text-soft_white text-primary font-bold text-center">
				{title}
			</Text>

			{title != "Login" && (
				<View className="flex-row">
					<TouchableOpacity
						onPress={navigateToUser}
						className="p-2 bg-green-500 rounded mr-2"
					>
						<Image
							source={icons.passwordReset}
							className="w-6 h-6"
							resizeMode="contain"
						/>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={handleLogout}
						className="p-2 bg-red-500 rounded"
					>
						<Image
							source={icons.logout}
							className="w-6 h-6"
							resizeMode="contain"
						/>
					</TouchableOpacity>
				</View>
			)}
		</View>
	);
};

export default Header;
