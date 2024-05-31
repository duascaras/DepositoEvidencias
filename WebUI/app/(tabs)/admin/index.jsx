import React, { useEffect, useState, useCallback } from "react";
import {
	View,
	Text,
	FlatList,
	TouchableOpacity,
	Image,
	ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import Header from "../../../components/Header";
import SearchInput from "../../../components/SearchInput";
import { icons } from "../../../constants";
import CustomButton from "../../../components/CustomButton";
import { useRouter, useFocusEffect } from "expo-router";

const Admin = () => {
	const [users, setUsers] = useState([]);
	const [showUsers, setShowUsers] = useState(false);
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [query, setQuery] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [filter, setFilter] = useState("active");
	const router = useRouter();

	const filterOptions = [
		{ key: "active", value: "Ativos" },
		{ key: "inactive", value: "Inativos" },
	];

	const getUsers = useCallback(
		async (page) => {
			const pageSize = 5;
			const endpoint =
				filter === "active" ? "get-users-active" : "get-users-inactive";
			const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}Account/${endpoint}?pageNumber=${page}&pageSize=${pageSize}`;

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
		},
		[filter]
	);

	useEffect(() => {
		getUsers(currentPage);
	}, [currentPage, getUsers, filter]);

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

	useFocusEffect(
		useCallback(() => {
			getUsers(currentPage);
		}, [currentPage, getUsers])
	);

	const newUser = () => {
		router.push({
			pathname: "admin/register",
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

	const handleFilterChange = (newFilter) => {
		setFilter(newFilter);
		setCurrentPage(1);
	};

	return (
		<SafeAreaView className="bg-soft_white h-full relative">
			<Header title={"Administrador"} />
			<View className="p-4">
				<SearchInput initialQuery={query} onSearch={setQuery} />
				<View className="flex-row justify-between">
					<TouchableOpacity
						className={`p-2 rounde ${
							filter === "active" ? "bg-blue-500" : "bg-gray-300"
						}`}
						onPress={() => handleFilterChange("active")}
						disabled={filter === "active"}
					>
						<Text className="text-white">Ativos</Text>
					</TouchableOpacity>
					<TouchableOpacity
						className={`p-2 rounded ${
							filter === "inactive"
								? "bg-blue-500"
								: "bg-gray-300"
						}`}
						onPress={() => handleFilterChange("inactive")}
						disabled={filter === "inactive"}
					>
						<Text className="text-white">Inativos</Text>
					</TouchableOpacity>
				</View>
			</View>

			{isLoading ? (
				<ActivityIndicator
					size="large"
					color="#0000ff"
					className="flex-1 justify-center items-center"
				/>
			) : showUsers ? (
				<View className="flex-1">
					<FlatList
						data={filteredUsers}
						keyExtractor={(user) => user.id}
						renderItem={({ item }) => (
							<TouchableOpacity
								className="flex-row mt-2 items-center p-4 bg-white rounded-xl border-2 border-gray-300 shadow-sm mx-4"
								onPress={() => editUser(item)}
							>
								<Image
									source={icons.user}
									className="w-10 h-10"
									resizeMode="contain"
								/>
								<View className="ml-4 flex-1">
									<Text className="text-lg text-black font-pregular">
										{item.userName}
									</Text>
									<Text className="text-sm text-gray-500">
										{item.role}
									</Text>
								</View>
								<Image
									source={icons.edit}
									className="w-5 h-5"
									resizeMode="contain"
								/>
							</TouchableOpacity>
						)}
						ListFooterComponent={() => (
							<View className="self-center bottom-0 p-4 w-96 mb-10">
								<CustomButton
									title="Novo Usuário"
									handlePress={newUser}
									containerStyles="w-full"
								/>
							</View>
						)}
					/>
				</View>
			) : (
				<Text className="text-center text-gray-500 mt-4">
					No users to display
				</Text>
			)}

			{showUsers && (
				<View className="absolute bottom-0 w-full flex-row justify-between p-1 bg-soft_white border-t border-gray-300">
					<TouchableOpacity
						className={`bg-blue-500 border-2 border-black p-2 rounded ${
							currentPage === 1 ? "opacity-50" : ""
						}`}
						onPress={handlePreviousPage}
						disabled={currentPage === 1}
					>
						<Text className="text-sm text-center text-white">
							Anterior
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
							Próxima
						</Text>
					</TouchableOpacity>
				</View>
			)}
		</SafeAreaView>
	);
};

export default Admin;
