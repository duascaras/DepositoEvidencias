import { useState } from "react";
import { View, Image, TextInput, TouchableOpacity } from "react-native";
import { icons } from "../constants";

const SearchInput = ({ initialQuery, onSearch }) => {
	const [query, setQuery] = useState(initialQuery || "");

	const handleTextChange = (text) => {
		setQuery(text);
		if (onSearch) {
			onSearch(text);
		}
	};

	return (
		<View className="flex-row mb-2 ml-4 mr-4 self-center items-center h-14 px-4 border-4">
			<TouchableOpacity onPress={() => handleTextChange(query)}>
				<Image
					source={icons.search}
					className="w-6 h-6"
					resizeMode="contain"
				/>
			</TouchableOpacity>

			<TextInput
				className="text-xl ml-4 flex-1 font-pregular"
				value={query}
				placeholder="Pesquisar"
				placeholderTextColor="#000000"
				onChangeText={handleTextChange}
			/>
		</View>
	);
};

export default SearchInput;
