import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	FlatList,
	TouchableOpacity,
	Image,
	ActivityIndicator,
	ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import Header from "../../../components/Header";
import CustomButton from "../../../components/CustomButtom";
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
		getUsers(currentPage);
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
		const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}Account/get-users-active?pageNumber=${page}&pageSize=${pageSize}`;

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
			alert(error);
		} finally {
			setIsLoading(false);
		}
	};

	const goToInactiveUsers = () => {
		router.push({
			pathname: "admin/inactive-users",
		});
	};

	const goToEditPassword = () => {
		router.push({
			pathname: "admin/edit-password",
		});
	};

	const goToInactivateUser = () => {
		router.push({
			pathname: "admin/inactivate-user",
		});
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
		<SafeAreaView className="bg-soft_white h-full relative">
			<Header title={"Administrador"} />

			<SearchInput initialQuery={query} onSearch={setQuery} />

			<View className="flex-row p-2">
				<View className="w-1/3 mt-2 p-2">
					<CustomButton
						title="Novo Usuário"
						handlePress={newUser}
						containerStyles="mb-4"
					/>
					<CustomButton
						title="Usuários Inativos"
						handlePress={goToInactiveUsers}
						containerStyles="mb-4"
					/>
					<CustomButton
						title="Editar Senhas"
						handlePress={goToEditPassword}
						containerStyles="mb-4"
					/>
					<CustomButton
						title="Inativar Usuário"
						handlePress={goToInactivateUser}
						containerStyles="mb-4"
					/>
				</View>

				<View className="flex-1 p-2">
					{isLoading ? (
						<ActivityIndicator size="large" color="#0000ff" />
					) : showUsers ? (
						<ScrollView>
							<FlatList
								data={filteredUsers}
								keyExtractor={(user) => user.id}
								renderItem={({ item }) => (
									<View className="flex-row mt-2 items-center h-12 px-2 rounded-xl border-2">
										<Image
											source={icons.user}
											className="w-8 h-8"
											resizeMode="contain"
										/>
										<Text className="text-lg ml-2 text-black flex-1 font-pregular">
											{item.userName}
										</Text>
										<TouchableOpacity
											onPress={() => editUser(item)}
										>
											<Image
												source={icons.edit}
												className="w-5 h-5"
												resizeMode="contain"
											/>
										</TouchableOpacity>
									</View>
								)}
							/>
						</ScrollView>
					) : (
						<Text>No users to display</Text>
					)}
				</View>
			</View>

			{showUsers && (
				<View className="absolute bottom-0 w-full flex-row justify-between p-2 bg-soft_white border-t border-gray-300">
					<TouchableOpacity
						className={`bg-blue-500 border-2 border-black p-2 rounded ${
							currentPage === 1 ? "opacity-50" : ""
						}`}
						onPress={handlePreviousPage}
						disabled={currentPage === 1}
					>
						<Text className="text-sm text-center text-white">
							Previous
						</Text>
					</TouchableOpacity>

					<Text className="text-lg self-center p-2 text-black font-pregular text-center">
						Page {currentPage} of {totalPages}
					</Text>

					<TouchableOpacity
						className={`bg-blue-500 border-2 border-black p-2 rounded ${
							currentPage === totalPages ? "opacity-50" : ""
						}`}
						onPress={handleNextPage}
						disabled={currentPage === totalPages}
					>
						<Text className="text-sm text-center text-white">
							Next
						</Text>
					</TouchableOpacity>
				</View>
			)}
		</SafeAreaView>
	);
};

export default Admin;
