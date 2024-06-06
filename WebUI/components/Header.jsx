import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "expo-router";

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
			<Text className="text-4xl text-soft_white text-primary text-semibold font-psemibold text-center">
				{title}
			</Text>

			{title != "Login" && (
				<View className="flex-row">
					<TouchableOpacity
						onPress={navigateToUser}
						className="p-2 bg-green-500 rounded mr-2"
					>
						<Text className="text-lg text-soft_white">User</Text>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={handleLogout}
						className="p-2 bg-red-500 rounded"
					>
						<Text className="text-lg text-soft_white">Logout</Text>
					</TouchableOpacity>
				</View>
			)}
		</View>
	);
};

export default Header;
