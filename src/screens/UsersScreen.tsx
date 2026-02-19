import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { api } from "../services/api";

interface User {
    id: number;
    username: string;
    role: "ALUNO" | "PROFESSOR";
}

export default function UsersScreen() {
    const navigation = useNavigation<any>();

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get("/users");
            setUsers(response.data);
        } catch (error) {
            console.log("Erro ao buscar usuários:", error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        try {
            setRefreshing(true);
            const response = await api.get("/users");
            setUsers(response.data);
        } catch (error) {
            console.log("Erro ao atualizar usuários:", error);
        } finally {
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchUsers();
        }, [])
    );

    const renderItem = ({ item }: { item: User }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate("UserDetails", { user: item })}
        >
            <View style={styles.card}>
                <Text style={styles.username}>{item.username}</Text>
                <Text
                    style={[
                        styles.role,
                        item.role === "PROFESSOR"
                            ? styles.professor
                            : styles.aluno,
                    ]}
                >
                    {item.role}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Usuários</Text>

            {/* Botão Novo Usuário */}
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("CreateUser")}
            >
                <Text style={styles.buttonText}>+ Novo Usuário</Text>
            </TouchableOpacity>

            {loading ? (
                <ActivityIndicator size="large" />
            ) : users.length === 0 ? (
                <Text style={styles.emptyText}>
                    Nenhum usuário cadastrado.
                </Text>
            ) : (
                <FlatList
                    data={users}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
        fontWeight: "600",
        marginBottom: 16,
    },
    button: {
        backgroundColor: "#111",
        padding: 14,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 20,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
    },
    card: {
        padding: 16,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#eee",
        marginBottom: 12,
        backgroundColor: "#fafafa",
    },
    username: {
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 6,
    },
    role: {
        fontSize: 12,
        fontWeight: "600",
    },
    professor: {
        color: "#1e88e5",
    },
    aluno: {
        color: "#43a047",
    },
    emptyText: {
        textAlign: "center",
        marginTop: 40,
        color: "#777",
    },
});
