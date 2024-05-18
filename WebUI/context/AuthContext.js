import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "my-jwt";
export const API_URL = "http://localhost:5021/api/Account";
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
				const token = await SecureStore.getItemAsync(TOKEN_KEY);
				console.log("stored: ", token);

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

			console.log(result.data); // Print the JWT for debugging

			setAuthState({
				token: result.data,
				authenticated: true,
			});

			axios.defaults.headers.common[
				"Authorization"
			] = `Bearer ${result.data}`;

			await SecureStore.setItemAsync(TOKEN_KEY, result.data);
			return result.data;
		} catch (e) {
			if (e.response && e.response.data) {
				return { error: true, msg: e.response.data };
			} else {
				return { error: true, msg: "An unexpected error occurred" };
			}
		}
	};

	const value = {
		onLogin: login,
		authState,
	};

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
};
