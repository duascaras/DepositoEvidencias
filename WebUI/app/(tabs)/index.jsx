import { Redirect, useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";

export default function App() {
	const { authState } = useAuth();

	if (authState.authenticated) {
		return <Redirect href="/home" />;
	} else {
		return <Redirect href="/sign-in" />;
	}
}
