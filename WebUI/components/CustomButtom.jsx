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
			// className={`text-2xl bg-blue rounded-full h-16
			//     justify-center items-center  ${containerStyles} ${
			// 	isLoading ? "opacity-50" : ""
			// }`}
			className={`bg-blue py-2 px-4 border-2 border-black rounded-full ${containerStyles} ${
				isLoading ? "opacity-50" : ""
			}`}
			disabled={isLoading}
		>
			<Text
				className={`text-2xl text-center text-soft_white font-bold ${textStyles}`}
			>
				{title}
			</Text>
		</TouchableOpacity>
	);
};

export default CustomButtom;
