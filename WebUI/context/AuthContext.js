// context/AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { b64utoutf8 } from "jsrsasign";
import { setItem, getItem, deleteItem } from "../utils/storage";

const TOKEN_KEY = "my-jwt";
export const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}Account`;

const AuthContext = createContext({});

export const useAuth = () => {
	return useContext(AuthContext);
};

const decodeJWT = (token) => {
	try {
		const parts = token.split(".");
		if (parts.length !== 3) {
			throw new Error("JWT must have 3 parts");
		}
		const payload = JSON.parse(b64utoutf8(parts[1]));
		return {
			username:
				payload[
					"http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
				],
			id: payload[
				"http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
			],
		};
	} catch (e) {
		return null;
	}
};

export const AuthProvider = ({ children }) => {
	const [authState, setAuthState] = useState({
		token: null,
		authenticated: null,
		user: null,
	});

	useEffect(() => {
		const loadToken = async () => {
			try {
				const token = await getItem(TOKEN_KEY);
				if (token) {
					axios.defaults.headers.common[
						"Authorization"
					] = `Bearer ${token}`;
					const user = decodeJWT(token);
					if (user) {
						setAuthState({
							token: token,
							authenticated: true,
							user: user,
						});
					}
				}
			} catch (e) {
				return e;
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
			const token = result.data;
			const user = decodeJWT(token);
			if (user) {
				setAuthState({
					token: token,
					authenticated: true,
					user: user,
				});
				axios.defaults.headers.common[
					"Authorization"
				] = `Bearer ${token}`;
				await setItem(TOKEN_KEY, token);
				return result.data;
			} else {
				throw new Error("Failed to decode JWT");
			}
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
				user: null,
			});
			delete axios.defaults.headers.common["Authorization"];
		} catch (e) {
			return e;
		}
	};

	const value = {
		onLogin: login,
		onLogout: logout,
		authState,
		userId: authState.user ? authState.user.id : null,
	};

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
};
