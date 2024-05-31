import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const AuthLayout = () => {
	return (
		<>
			<Stack>
				<Stack.Screen
					name="sign-in"
					options={{
						headerShown: false,
					}}
				/>

				<Stack.Screen
					name="register"
					options={{
						headerShown: false,
					}}
				/>
			</Stack>

			{/* Only on Mobile: Defines the top of the page (where the hours are shown)*/}
			<StatusBar backgroundColor="#2A316E" style="light" />
		</>
	);
};

export default AuthLayout;
