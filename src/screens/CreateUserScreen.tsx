import React, { useContext, useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { AuthContext } from "../contexts/AuthContext";

export default function CreateUserScreen() {
    const { token } = useContext(AuthContext);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<"ALUNO" | "PROFESSOR">("ALUNO");

    async function handleCreate() {
        if (!username || !password) {
            Alert.alert("Erro", "Preencha todos os campos");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    username,
                    password,
                    role,
                }),
            });

            if (!response.ok) {
                throw new Error("Erro ao criar usuário");
            }

            Alert.alert("Sucesso", "Usuário criado com sucesso!");
            setUsername("");
            setPassword("");
            setRole("ALUNO");
        } catch (error) {
            Alert.alert("Erro", "Não foi possível criar usuário");
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Criar Usuário</Text>

            <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
            />

            <TextInput
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={styles.input}
            />

            <View style={styles.roleContainer}>
                <TouchableOpacity
                    style={[
                        styles.roleButton,
                        role === "ALUNO" && styles.roleSelected,
                    ]}
                    onPress={() => setRole("ALUNO")}
                >
                    <Text>Aluno</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.roleButton,
                        role === "PROFESSOR" && styles.roleSelected,
                    ]}
                    onPress={() => setRole("PROFESSOR")}
                >
                    <Text>Professor</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleCreate}>
                <Text style={styles.buttonText}>Criar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    title: {
        fontSize: 22,
        fontWeight: "600",
        marginBottom: 20,
    },
    input: {
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 8,
        marginBottom: 15,
    },
    roleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    roleButton: {
        flex: 1,
        padding: 12,
        backgroundColor: "#e0e0e0",
        borderRadius: 8,
        alignItems: "center",
        marginHorizontal: 5,
    },
    roleSelected: {
        backgroundColor: "#1976d2",
    },
    button: {
        backgroundColor: "#1976d2",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
    },
});
