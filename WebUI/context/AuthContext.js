// context/AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { setItem, getItem, deleteItem } from "../utils/storage";

const TOKEN_KEY = "my-jwt";
export const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}Account`;

const AuthContext = createContext({});

export const useAuth = () => {
	return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
	const [authState, setAuthState] = useState({
		token: null,
		authenticated: null,
	});

	useEffect(() => {
		const loadToken = async () => {
			try {
				const token = await getItem(TOKEN_KEY);
				if (token) {
					axios.defaults.headers.common[
						"Authorization"
					] = `Bearer ${token}`;
					setAuthState({
						token: token,
						authenticated: true,
					});
				}
			} catch (e) {
				console.log(e);
			}
		};
		loadToken();
	}, []);

	const login = async (username, password) => {
		try {
			const result = await axios.post(`${API_URL}/login`, {
				username,
				password,
			});
			setAuthState({
				token: result.data,
				authenticated: true,
			});
			axios.defaults.headers.common[
				"Authorization"
			] = `Bearer ${result.data}`;
			await setItem(TOKEN_KEY, result.data);
			return result.data;
		} catch (e) {
			if (e.response && e.response.data) {
				return { error: true, msg: e.response.data };
			} else {
				return { error: true, msg: "An unexpected error occurred" };
			}
		}
	};

	const logout = async () => {
		try {
			await deleteItem(TOKEN_KEY);
			setAuthState({
				token: null,
				authenticated: false,
			});
			delete axios.defaults.headers.common["Authorization"];
		} catch (e) {
			console.log(e);
		}
	};

	const value = {
		onLogin: login,
		onLogout: logout,
		authState,
	};

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
};
