import { View, FlatList } from "react-native";
import React from "react";

const List = ({ data, keyExtractor, renderItem }) => {
	return (
		<View className={"flex-1 p-15"}>
			<FlatList
				data={data}
				keyExtractor={keyExtractor}
				renderItem={renderItem}
			/>
		</View>
	);
};

export default List;
