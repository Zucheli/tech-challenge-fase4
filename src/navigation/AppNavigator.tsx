import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

import { Text, TouchableOpacity } from "react-native";
import CreatePostScreen from "../screens/CreatePostScreen";
import CreateUserScreen from "../screens/CreateUserScreen";
import LoginScreen from "../screens/LoginScreen";
import PostDetailsScreen from "../screens/PostDetailsScreen";
import PostsScreen from "../screens/PostsScreen";
import UserDetailsScreen from "../screens/UserDetailsScreen";
import UsersScreen from "../screens/UsersScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const { token, role, signOut } = useContext(AuthContext);

    return (
        <Stack.Navigator
            screenOptions={{
                headerRight: () =>
                    token ? (
                        <TouchableOpacity
                            onPress={signOut}
                            style={{ marginRight: 15 }}
                        >
                            <Text style={{ color: "#d32f2f", fontWeight: "600" }}>
                                Sair ({role})
                            </Text>
                        </TouchableOpacity>
                    ) : null,
            }}
        >
            {!token ? (
                <Stack.Screen name="Login" component={LoginScreen} />
            ) : (
                <>
                    <Stack.Screen name="Posts" component={PostsScreen} />
                    <Stack.Screen name="PostDetails" component={PostDetailsScreen} />

                    {role === "PROFESSOR" && (
                        <>
                            <Stack.Screen name="CreatePost" component={CreatePostScreen} />
                            <Stack.Screen name="CreateUser" component={CreateUserScreen} />
                            <Stack.Screen name="UserDetails" component={UserDetailsScreen} />
                            <Stack.Screen name="Users" component={UsersScreen} />
                        </>
                    )}
                </>
            )}
        </Stack.Navigator>
    );
}
