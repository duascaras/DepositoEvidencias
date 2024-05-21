import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import Header from "../../../components/Header";
import CustomButtom from "../../../components/CustomButtom";
import { router } from "expo-router";
import SearchInput from "../../../components/SearchInput";
import { icons } from "../../../constants";

const Admin = () => {
	const [users, setUsers] = useState([]);
	const [showUsers, setShowUsers] = useState(false);
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [query, setQuery] = useState("");

	useEffect(() => {
		getUsers();
	}, []);

	useEffect(() => {
		if (query) {
			const filtered = users.filter((user) =>
				user.userName.toLowerCase().includes(query.toLowerCase())
			);
			setFilteredUsers(filtered);
		} else {
			setFilteredUsers(users);
		}
	}, [query, users]);

	const getUsers = async () => {
		const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}Account/get-users-active`;
		try {
			const response = await axios.get(API_URL);
			const { users } = response.data; // Destructure users from response.data
			setUsers(users);
			setFilteredUsers(users);
			setShowUsers(true);
		} catch (error) {
			console.error("Error:", error);
		}
	};

	const newUser = () => {
		router.push({
			pathname: "admin/sign-up",
			params: { onItemCreated: getUsers },
		});
	};

	const editUser = (user) => {
		router.push({
			pathname: `/admin/${user.id}`,
			params: { id: user.id },
		});
	};

	return (
		<SafeAreaView className="bg-soft_white h-full">
			<Header title={"Administrador"} />

			<SearchInput initialQuery={query} onSearch={setQuery} />

			<View>
				{showUsers ? (
					<FlatList
						data={filteredUsers}
						keyExtractor={(user) => user.id}
						renderItem={({ item }) => (
							<View className="flex-row mt-10 self-center items-center h-14 px-4 rounded-2xl border-2 w-96">
								<Text className="text-xl ml-4 mt-0.5 text-black flex-1 font-pregular">
									{item.userName}
								</Text>

								<TouchableOpacity
									onPress={() => editUser(item)}
								>
									<Image
										source={icons.edit}
										className="w-6 h-6"
										resizeMode="contain"
									/>
								</TouchableOpacity>
							</View>
						)}
					/>
				) : (
					<Text>Loading...</Text>
				)}
			</View>

			<View className="absolute self-center bottom-0 p-4 w-96 mb-10">
				<CustomButtom
					title="Criar novo usuário"
					handlePress={newUser}
					containerStyles="w-full"
				/>
			</View>
		</SafeAreaView>
	);
};

export default Admin;
