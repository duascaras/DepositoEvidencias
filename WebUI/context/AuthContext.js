/* We should have at least 3 methods here:
    1. signIn
    2. createUser
    3. getCurrentUser
*/

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const AuthContext = createContext < AuthProps > {};

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
	const [authState, setAuthState] = useState({
		token: null,
		authenticated: null,
	});

	useEffect(() => {
		// Check if user is already authenticated
		const checkAuthentication = async () => {
			try {
				const token = await SecureStore.getItemAsync("token");
				if (token) {
					setAuthState({ token, authenticated: true });
				} else {
					setAuthState({ token: null, authenticated: false });
				}
			} catch (error) {
				console.error("Error checking authentication:", error);
			}
		};

		checkAuthentication();
	}, []);

	const signIn = async (email, password) => {
		try {
			// Make API call to sign in
			const response = await axios.post("/api/signin", {
				email,
				password,
			});
			const { token } = response.data;

			// Store token securely
			await SecureStore.setItemAsync("token", token);

			// Update auth state
			setAuthState({ token, authenticated: true });
		} catch (error) {
			console.error("Error signing in:", error);
		}
	};

	const createUser = async (email, password) => {
		try {
			// Make API call to create user
			await axios.post("/api/signup", { email, password });
		} catch (error) {
			console.error("Error creating user:", error);
		}
	};

	const getCurrentUser = async () => {
		try {
			// Make API call to get current user
			const response = await axios.get("/api/user");
			return response.data;
		} catch (error) {
			console.error("Error getting current user:", error);
		}
	};

	const onLogout = async () => {
		try {
			// Clear token from secure storage
			await SecureStore.deleteItemAsync("token");

			// Update auth state
			setAuthState({ token: null, authenticated: false });
		} catch (error) {
			console.error("Error logging out:", error);
		}
	};

	return (
		<AuthContext.Provider
			value={{
				authState,
				onRegister: createUser,
				onLogin: signIn,
				onLogout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
