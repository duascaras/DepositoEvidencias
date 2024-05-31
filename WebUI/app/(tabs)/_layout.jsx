import { View, Image, Text } from "react-native";
import { Tabs, Redirect } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { icons } from "../../constants";
import { StatusBar } from "expo-status-bar";

const TabIcon = ({ icon, color, name, focused }) => {
	return (
		<View className="items-center justify-center gap-2">
			<Image
				source={icon}
				resizeMode="contain"
				tintColor={color}
				className="w-6"
			/>
			<Text
				className={`${
					focused ? "font-psemibold" : "font-pregular"
				} text-xs mb-2`}
				style={{ color: color }}
			>
				{name}
			</Text>
		</View>
	);
};

const TabsLayout = () => {
	const { authState } = useAuth();

	if (!authState.authenticated) {
		return <Redirect href="/sign-in" />;
	}

	return (
		<>
			<Tabs
				screenOptions={{
					tabBarShowLabel: false,
					tabBarActiveTintColor: "#E69A8DFF",
					tabBarInactiveTintColor: "#F6F7F7",
					tabBarStyle: {
						backgroundColor: "#2A316E",
						borderTopWidth: 1,
						borderTopColor: "#232533",
						height: 85,
					},
				}}
			>
				<Tabs.Screen
					name="index"
					options={{
						href: null,
						headerShown: false,
					}}
				/>

				<Tabs.Screen
					name="home"
					options={{
						title: "Home",
						headerShown: false,
						tabBarIcon: ({ color, focused }) => (
							<TabIcon
								icon={icons.home}
								color={color}
								name="Início"
								focused={focused}
							/>
						),
					}}
				/>

				<Tabs.Screen
					name="items/index"
					options={{
						title: "Items",
						headerShown: false,
						tabBarIcon: ({ color, focused }) => (
							<TabIcon
								icon={icons.bookmark}
								color={color}
								name="Itens"
								focused={focused}
							/>
						),
					}}
				/>

				<Tabs.Screen
					name="items/[id]"
					options={{
						href: null,
						title: "Items",
						headerShown: false,
						tabBarVisible: false,
					}}
				/>

				<Tabs.Screen
					name="items/new_item"
					options={{
						href: null,
						headerShown: false,
						tabBarVisible: false,
					}}
				/>

				<Tabs.Screen
					name="analysis/index"
					options={{
						title: "Analysis",
						headerShown: false,
						tabBarIcon: ({ color, focused }) => (
							<TabIcon
								icon={icons.plus}
								color={color}
								name="Análises"
								focused={focused}
							/>
						),
					}}
				/>

				<Tabs.Screen
					name="analysis/new_analysis"
					options={{
						href: null,
						headerShown: false,
					}}
				/>

				<Tabs.Screen
					name="analysis/[id]"
					options={{
						href: null,
						headerShown: false,
					}}
				/>

				<Tabs.Screen
					name="admin/index"
					options={{
						title: "admin",
						headerShown: false,
						tabBarIcon: ({ color, focused }) => (
							<TabIcon
								icon={icons.profile}
								color={color}
								name="Administrador"
								focused={focused}
							/>
						),
					}}
				/>

				<Tabs.Screen
					name="admin/register"
					options={{
						href: null,
						headerShown: false,
					}}
				/>

				<Tabs.Screen
					name="admin/[id]"
					options={{
						href: null,
						headerShown: false,
					}}
				/>

				<Tabs.Screen
					name="admin/edit-password"
					options={{
						href: null,
						headerShown: false,
					}}
				/>

				<Tabs.Screen
					name="admin/inactive-users"
					options={{
						href: null,
						headerShown: false,
					}}
				/>

				<Tabs.Screen
					name="pending/index"
					options={{
						href: null,
						title: "Items",
						headerShown: false,
					}}
				/>
			</Tabs>

			{/* Only on Mobile: Defines the top of the page (where the hours are shown)*/}
			<StatusBar backgroundColor="#2A316E" style="light" />
		</>
	);
};

export default TabsLayout;
