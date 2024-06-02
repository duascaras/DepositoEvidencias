import { View, Text } from "react-native";
import React from "react";

const Header = ({ title }) => {
	return (
		<View className="bg-blue">
			<Text className="text-4xl text-soft_white text-primary text-semibold my-10 font-psemibold text-center ">
				{title}
			</Text>
		</View>
	);
};

export default Header;
