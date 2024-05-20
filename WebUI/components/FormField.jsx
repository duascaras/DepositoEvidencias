import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";

import { icons } from "../constants";

const FormField = ({
	title,
	value,
	placeholder,
	handleChangeText,
	otherStyles,
	...props
}) => {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<View className={`space-y-2 ${otherStyles}`}>
			<Text className="text-xl text-semibold font-psemibold ">
				{title}
			</Text>
			<View className="h-16 px-4 bg-blue rounded-2xl border-2 border-black flex-row items-center">
				<TextInput
					className="flex-1 text-soft_white font-bold font-lg text-base"
					value={value}
					placeholder={placeholder}
					placeholderTextColor="#7B7B8B"
					onChangeText={handleChangeText}
					secureTextEntry={title === "Senha" && !showPassword}
					{...props}
				/>

				{title === "Senha" && (
					<TouchableOpacity
						onPress={() => setShowPassword(!showPassword)}
					>
						<Image
							source={!showPassword ? icons.eye : icons.eyeHide}
							className="w-10 h-10"
							resizeMode="contain"
						/>
					</TouchableOpacity>
				)}
			</View>
		</View>
	);
};

export default FormField;
