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
import CustomButton from "../../../components/CustomButton";
import { useRouter, useFocusEffect } from "expo-router";
import { icons } from "../../../constants";
import AlertModal from "../../../components/AlertModal";

const Admin = () => {
	const [users, setUsers] = useState([]);
	const [showUsers, setShowUsers] = useState(false);
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [query, setQuery] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [filter, setFilter] = useState("active");
	const [alertVisible, setAlertVisible] = useState(false);
	const [alertMessage, setAlertMessage] = useState("");
	const router = useRouter();

	const getUsers = useCallback(
		async (page) => {
			const pageSize = 1000;
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
				showAlert("Você não tem acesso a este recurso.");
			} finally {
				setIsLoading(false);
			}
		},
		[filter]
	);

	useFocusEffect(
		useCallback(() => {
			getUsers(currentPage);
		}, [currentPage, getUsers])
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

	const newUser = () => {
		try {
			router.push({
				pathname: "admin/register",
				params: { onItemCreated: getUsers },
			});
		} catch (error) {
			showAlert("Você não tem acesso a este recurso.");
		}
	};

	const editUser = (user) => {
		try {
			router.push({
				pathname: `/admin/${user.id}`,
				params: { id: user.id },
			});
		} catch (error) {
			showAlert("Você não tem acesso a este recurso.");
		}
	};

	const handleFilterChange = (newFilter) => {
		setFilter(newFilter);
		setCurrentPage(1);
		getUsers(1);
	};

	const showAlert = (message) => {
		setAlertMessage(message);
		setAlertVisible(true);
	};

	const closeAlert = () => {
		setAlertVisible(false);
	};

	return (
		<SafeAreaView className="bg-soft_white h-full relative">
			<Header title={"Administrador"} />
			<View className="p-4">
				<SearchInput initialQuery={query} onSearch={setQuery} />
				<View className="flex-row justify-between mt-4">
					<TouchableOpacity
						className={`p-2 border-2 rounded ${
							filter === "active"
								? "bg-blue-500 border-black"
								: "bg-gray-300 border-gray-300 opacity-50"
						}`}
						onPress={() => handleFilterChange("active")}
						disabled={filter === "active"}
					>
						<Text
							className={`text-white ${
								filter === "active" ? "" : "text-black"
							}`}
						>
							Ativos
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						className={`p-2 border-2 rounded ${
							filter === "inactive"
								? "bg-blue-500 border-black"
								: "bg-gray-300 border-gray-300 opacity-50"
						}`}
						onPress={() => handleFilterChange("inactive")}
						disabled={filter === "inactive"}
					>
						<Text
							className={`text-white ${
								filter === "inactive" ? "" : "text-black"
							}`}
						>
							Inativos
						</Text>
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
								className="flex-row mt-2 items-center p-4 bg-white rounded-xl border-2 border-gray-300 boxShadow-sm mx-4"
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
					/>
				</View>
			) : (
				<Text className="text-center text-gray-500 mt-4">
					No users to display
				</Text>
			)}

			<View className="self-center bottom-0 p-4 w-96 mb-2">
				<CustomButton
					title="Novo Usuário"
					handlePress={newUser}
					containerStyles="w-full"
				/>
			</View>

			<AlertModal
				visible={alertVisible}
				message={alertMessage}
				onClose={closeAlert}
			/>
		</SafeAreaView>
	);
};

export default Admin;
