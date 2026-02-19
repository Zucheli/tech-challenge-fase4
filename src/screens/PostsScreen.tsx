import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useContext, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { AuthContext } from "../contexts/AuthContext";
import { api } from "../services/api";

interface Post {
    id: number;
    title: string;
    content: string;
    author?: string;
    isPublic: boolean;
}

export default function PostsScreen() {
    const navigation = useNavigation<any>();
    const { role } = useContext(AuthContext);

    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchPosts = async () => {
        try {
            const endpoint =
                role === "PROFESSOR" ? "/posts/all" : "/posts";

            const response = await api.get(endpoint);
            setPosts(response.data);
        } catch (error) {
            console.log("Erro ao buscar posts");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchPosts();
        }, [role])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchPosts();
    };

    const renderItem = ({ item }: { item: Post }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() =>
                navigation.navigate("PostDetails", { postId: item.id })
            }
        >
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text numberOfLines={2} style={styles.cardContent}>
                {item.content}
            </Text>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {role === "PROFESSOR" && (
                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => navigation.navigate("Users")}
                >
                    <Text style={styles.secondaryButtonText}>
                        Gerenciar Usuários
                    </Text>
                </TouchableOpacity>
            )}

            {role === "PROFESSOR" && (
                <TouchableOpacity
                    style={styles.createButton}
                    onPress={() => navigation.navigate("CreatePost")}
                >
                    <Text style={styles.createButtonText}>
                        + Novo Post
                    </Text>
                </TouchableOpacity>
            )}

            <FlatList
                data={posts}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderItem}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                ListEmptyComponent={
                    <Text style={styles.empty}>
                        Nenhum post encontrado.
                    </Text>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    createButton: {
        backgroundColor: "#111",
        padding: 14,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
        marginBottom: 20,
    },
    createButtonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
    card: {
        backgroundColor: "#fafafa",
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#eee",
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 8,
    },
    cardContent: {
        fontSize: 14,
        color: "#444",
        marginBottom: 8,
    },
    cardAuthor: {
        fontSize: 12,
        color: "#777",
        fontStyle: "italic",
    },
    empty: {
        textAlign: "center",
        marginTop: 40,
        color: "#888",
    },
    secondaryButton: {
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#111",
        alignItems: "center",
    },
    secondaryButtonText: {
        fontWeight: "600",
    },
});
