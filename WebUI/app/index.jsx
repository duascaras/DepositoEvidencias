import { Redirect } from "expo-router";

export default function App() {
	// const { isLoading, isLoggedIn } = useGlobalContext();

	// if (!isLoading && isLoggedIn) return <Redirect href="/home" />;

	return <Redirect href={"sign-in"}></Redirect>;
}
