import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { AuthContext } from "../contexts/AuthContext";
import { api } from "../services/api";

interface RouteParams {
    postId: number;
}

function showMessage(title: string, message: string) {
    if (Platform.OS === "web") {
        alert(`${title}\n\n${message}`);
    } else {
        Alert.alert(title, message);
    }
}

export default function PostDetailsScreen() {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { role } = useContext(AuthContext);

    const { postId } = route.params as RouteParams;

    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    useEffect(() => {
        fetchPost();
    }, []);

    const fetchPost = async () => {
        try {
            const response = await api.get(`/posts/${postId}`);
            setPost(response.data);
            setTitle(response.data.title);
            setContent(response.data.content);
        } catch (error) {
            Alert.alert("Erro", "Post não encontrado");
            navigation.goBack();
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        try {
            await api.put(`/posts/${postId}`, {
                title,
                content,
            });

            showMessage("Sucesso", "Post atualizado!");
            setEditing(false);
            fetchPost();
        } catch {
            showMessage("Erro", "Não foi possível atualizar");
        }
    };

    const handleDelete = async () => {
        if (Platform.OS === "web") {
            const confirmDelete = window.confirm("Deseja realmente excluir?");
            if (!confirmDelete) return;

            try {
                await api.delete(`/posts/${postId}`);
                alert("Post removido");
                navigation.goBack();
            } catch {
                alert("Não foi possível excluir");
            }

            return;
        }

        Alert.alert("Excluir", "Deseja realmente excluir?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Excluir",
                style: "destructive",
                onPress: async () => {
                    try {
                        await api.delete(`/posts/${postId}`);
                        navigation.goBack();
                    } catch {
                        Alert.alert("Erro", "Não foi possível excluir");
                    }
                },
            },
        ]);
    };


    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {editing ? (
                <>
                    <TextInput
                        style={styles.input}
                        value={title}
                        onChangeText={setTitle}
                    />
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={content}
                        onChangeText={setContent}
                        multiline
                    />

                    <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                        <Text style={styles.buttonText}>Salvar</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <Text style={styles.title}>{post.title}</Text>
                    <Text style={styles.content}>{post.content}</Text>
                    {post.author && (
                        <Text style={styles.author}>Autor: {post.author}</Text>
                    )}
                </>
            )}

            {role === "PROFESSOR" && !editing && (
                <View style={styles.actions}>
                    <TouchableOpacity
                        style={[styles.button, styles.edit]}
                        onPress={() => setEditing(true)}
                    >
                        <Text style={styles.buttonText}>Editar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.delete]}
                        onPress={() => { handleDelete(); }}
                    >
                        <Text style={styles.buttonText}>Excluir</Text>
                    </TouchableOpacity>
                </View>
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
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 22,
        fontWeight: "600",
        marginBottom: 16,
    },
    content: {
        fontSize: 16,
        lineHeight: 22,
        marginBottom: 12,
    },
    author: {
        fontSize: 12,
        color: "#777",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    textArea: {
        height: 120,
        textAlignVertical: "top",
    },
    actions: {
        marginTop: 20,
    },
    button: {
        backgroundColor: "#111",
        padding: 14,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 12,
    },
    edit: {
        backgroundColor: "#1976d2",
    },
    delete: {
        backgroundColor: "#d32f2f",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
    },
});
