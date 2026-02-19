import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity
} from "react-native";
import { api } from "../services/api";

export default function CreatePostScreen() {
    const navigation = useNavigation<any>();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [author, setAuthor] = useState("");
    const [isPublic, setIsPublic] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        if (!title.trim() || !content.trim()) {
            Alert.alert("Erro", "Preencha título e conteúdo");
            return;
        }

        try {
            setLoading(true);

            await api.post("/posts", {
                title,
                content,
                author,
                isPublic,
            });

            Alert.alert("Sucesso", "Post criado com sucesso!");

            // limpa campos
            setTitle("");
            setContent("");
            setAuthor("");
            setIsPublic(true);

            navigation.goBack();
        } catch (error) {
            Alert.alert("Erro", "Não foi possível criar o post");
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Novo Post</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Título"
                    value={title}
                    onChangeText={setTitle}
                />

                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Conteúdo"
                    value={content}
                    onChangeText={setContent}
                    multiline
                />

                <TextInput
                    style={styles.input}
                    placeholder="Autor (opcional)"
                    value={author}
                    onChangeText={setAuthor}
                />

                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleCreate}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Criar Post</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        backgroundColor: "#fff",
        flexGrow: 1,
        justifyContent: "center",
    },
    title: {
        fontSize: 26,
        fontWeight: "700",
        marginBottom: 30,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#e0e0e0",
        padding: 14,
        borderRadius: 10,
        marginBottom: 18,
        backgroundColor: "#fafafa",
        fontSize: 16,
    },
    textArea: {
        height: 140,
        textAlignVertical: "top",
    },
    switchContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 30,
    },
    switchLabel: {
        fontSize: 16,
        fontWeight: "500",
    },
    button: {
        backgroundColor: "#111",
        padding: 16,
        borderRadius: 10,
        alignItems: "center",
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
});
