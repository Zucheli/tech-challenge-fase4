import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { api } from "../services/api";

type Post = {
    id: number;
    title: string;
    content: string;
    author?: string;
};

export default function HomeScreen() {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        loadPosts();
    }, []);

    async function loadPosts() {
        const response = await api.get("/posts");
        setPosts(response.data);
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={posts}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text numberOfLines={2}>{item.content}</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#F9FAFB" },
    card: {
        backgroundColor: "#FFF",
        padding: 16,
        borderRadius: 10,
        marginBottom: 12,
        elevation: 2,
    },
    title: {
        fontWeight: "bold",
        fontSize: 16,
        marginBottom: 6,
    },
});