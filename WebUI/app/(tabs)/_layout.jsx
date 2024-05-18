import { View, Image, Text } from "react-native";
import { Tabs } from "expo-router";

import { icons } from "../../constants";

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
					name="items/new_item"
					options={{
						href: null,
						title: "Items",
						headerShown: false,
					}}
				/>

				<Tabs.Screen
					name="items/item_details"
					options={{
						href: null,
						title: "Items",
						headerShown: false,
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
						title: "Items",
						headerShown: false,
					}}
				/>

				<Tabs.Screen
					name="analysis/analysis_details"
					options={{
						href: null,
						title: "Items",
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
					name="admin/sign-up"
					options={{
						href: null,
						title: "Items",
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
		</>
	);
};

export default TabsLayout;
