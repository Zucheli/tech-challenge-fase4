import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import {
    Alert,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { api } from "../services/api";

type User = {
    id: number;
    username: string;
    role: "ALUNO" | "PROFESSOR";
};

function showMessage(title: string, message: string) {
    if (Platform.OS === "web") {
        alert(`${title}\n\n${message}`);
    } else {
        Alert.alert(title, message);
    }
}

export default function UserDetailsScreen() {
    const route = useRoute<RouteProp<any>>();
    const navigation = useNavigation<any>();

    const { user } = route.params as { user: User };

    const [username, setUsername] = useState(user.username);
    const [role, setRole] = useState<"ALUNO" | "PROFESSOR">(user.role);
    const [loading, setLoading] = useState(false);

    async function handleUpdate() {
        try {
            setLoading(true);

            await api.put(`/users/${user.id}`, {
                username,
                role,
            });

            showMessage("Sucesso", "Usuário atualizado!");
            navigation.goBack();
        } catch (error) {
            showMessage("Erro", "Não foi possível atualizar");
        } finally {
            setLoading(false);
        }
    }


    async function handleDelete() {
        if (Platform.OS === "web") {
            const confirmDelete = window.confirm("Deseja realmente excluir?");
            if (!confirmDelete) return;

            try {
                await api.delete(`/users/${user.id}`);
                alert("Usuário removido");
                navigation.goBack();
            } catch {
                alert("Não foi possível excluir");
            }

            return;
        }

        Alert.alert("Confirmação", "Deseja realmente excluir?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Excluir",
                style: "destructive",
                onPress: async () => {
                    try {
                        await api.delete(`/users/${user.id}`);
                        Alert.alert("Sucesso", "Usuário removido");
                        navigation.goBack();
                    } catch {
                        Alert.alert("Erro", "Não foi possível excluir");
                    }
                },
            },
        ]);
    }


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Editar Usuário</Text>

            <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Username"
            />

            <View style={styles.roleContainer}>
                <TouchableOpacity
                    style={[
                        styles.roleButton,
                        role === "ALUNO" && styles.selectedAluno,
                    ]}
                    onPress={() => setRole("ALUNO")}
                >
                    <Text>ALUNO</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.roleButton,
                        role === "PROFESSOR" && styles.selectedProfessor,
                    ]}
                    onPress={() => setRole("PROFESSOR")}
                >
                    <Text>PROFESSOR</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity
                    style={[styles.button, styles.edit]}
                    onPress={handleUpdate}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? "Salvando..." : "Salvar"}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.delete]}
                    onPress={handleDelete}
                >
                    <Text style={styles.buttonText}>Excluir</Text>
                </TouchableOpacity>
            </View>

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
        fontSize: 22,
        fontWeight: "600",
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
    },
    roleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    roleButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ddd",
        alignItems: "center",
        marginHorizontal: 5,
    },
    selectedAluno: {
        backgroundColor: "#43a04733",
    },
    selectedProfessor: {
        backgroundColor: "#1e88e533",
    },
    button: {
        backgroundColor: "#111",
        padding: 14,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 15,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
    },
    deleteButton: {
        alignItems: "center",
    },
    deleteText: {
        color: "#d32f2f",
        fontWeight: "600",
    },
    actions: {
        marginTop: 20,
    },
    edit: {
        backgroundColor: "#1976d2",
    },
    delete: {
        backgroundColor: "#d32f2f",
    },
});
