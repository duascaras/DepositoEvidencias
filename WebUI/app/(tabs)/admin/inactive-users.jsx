import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	FlatList,
	TouchableOpacity,
	Image,
	Button,
	ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import Header from "../../../components/Header";
import CustomButton from "../../../components/CustomButtom"; // Assuming you have a CustomButton component
import { router } from "expo-router";
import SearchInput from "../../../components/SearchInput";
import { icons } from "../../../constants";

const Admin = () => {
	const [users, setUsers] = useState([]);
	const [showUsers, setShowUsers] = useState(false);
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [query, setQuery] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);

	useEffect(() => {
		getUsers(currentPage); // Fetch users for the initial page
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

	const getUsers = async (page) => {
		const pageSize = 5;
		const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}Account/get-users-inactive?pageNumber=${page}&pageSize=${pageSize}`;

		try {
			setIsLoading(true);
			const response = await axios.get(API_URL);
			const { totalUsers, users } = response.data;
			setUsers(users);
			setFilteredUsers(users);

			const totalPages = Math.ceil(totalUsers / pageSize);
			setTotalPages(totalPages);
			setShowUsers(true);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
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

	const handleNextPage = () => {
		if (currentPage < totalPages) {
			setCurrentPage(currentPage + 1);
			getUsers(currentPage + 1);
		}
	};

	const handlePreviousPage = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
			getUsers(currentPage - 1);
		}
	};

	return (
		<SafeAreaView className="bg-soft_white h-full">
			<Header title={"Administrador"} />

			<SearchInput initialQuery={query} onSearch={setQuery} />

			<View>
				{isLoading ? ( // Show loading indicator while fetching users
					<ActivityIndicator size="large" color="#0000ff" />
				) : showUsers ? (
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
					<Text>No users to display</Text>
				)}
			</View>

			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					paddingHorizontal: 14,
					marginTop: 20,
				}}
			>
				<Button
					title="Previous"
					onPress={handlePreviousPage}
					disabled={currentPage === 1}
				/>
				<Text style={{ fontSize: 18, fontWeight: "bold" }}>
					Page {currentPage} of {totalPages}
				</Text>
				<Button
					title="Next"
					onPress={handleNextPage}
					disabled={currentPage === totalPages}
				/>
			</View>

			<View className="absolute self-center bottom-0 p-4 w-96 mb-10">
				<CustomButton
					title="Criar novo usuário"
					handlePress={newUser}
					containerStyles="w-full"
				/>
			</View>
		</SafeAreaView>
	);
};

export default Admin;
