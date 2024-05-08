import { Stack } from "expo-router";

const StackLayout = () => {
	return (
		<Stack
			screenOptions={{
				headerStyle: {
					backgroundColor: "#f4511e",
				},
				headerTintColor: "#fff",
				headerTitleStyle: {
					fontWeight: "bold",
				},
			}}
		>
			{/* Optionally configure static options outside the route.*/}
			<Stack.Screen name="items" options={{}} />
		</Stack>
	);
};

export default StackLayout;
