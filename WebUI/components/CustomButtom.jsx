import { Text, TouchableOpacity } from "react-native";
import React from "react";

const CustomButtom = ({
	title,
	handlePress,
	containerStyles,
	textStyles,
	isLoading,
}) => {
	return (
		<TouchableOpacity
			onPress={handlePress}
			activeOpacity={0.7}
			className={`bg-blue py-2 px-4 border-2 border-black rounded-full ${containerStyles} ${
				isLoading ? "opacity-50" : ""
			}`}
			disabled={isLoading}
		>
			<Text
				className={`text-xl text-center text-soft_white font-bold ${textStyles}`}
			>
				{title}
			</Text>
		</TouchableOpacity>
	);
};

export default CustomButtom;
