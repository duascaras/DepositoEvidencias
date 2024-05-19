import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import axios from "axios";

import Header from "../../../components/Header";
import CustomButtom from "../../../components/CustomButtom";
import { router } from "expo-router";

const NewItem = () => {
	// TODO: Add tailwind styles
	return (
		<SafeAreaView className="bg-soft_white h-full">
			<View>
				<Header title={"Novo Item"}></Header>
			</View>
		</SafeAreaView>
	);
};

export default NewItem;
