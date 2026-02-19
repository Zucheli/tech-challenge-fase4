import React, { createContext, ReactNode, useState } from "react";
import { api } from "../services/api";

export type Role = "ALUNO" | "PROFESSOR";

interface AuthContextData {
    token: string | null;
    role: Role | null;
    signIn: (username: string, password: string) => Promise<void>;
    signOut: () => void;
}

export const AuthContext = createContext<AuthContextData>(
    {} as AuthContextData
);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [role, setRole] = useState<Role | null>(null);

    async function signIn(username: string, password: string) {
        const response = await api.post("auth/login", {
            username,
            password,
        });

        const { token, role } = response.data;

        setToken(token);
        setRole(role);

        // Se você usa axios, pode já setar o token aqui:
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    function signOut() {
        setToken(null);
        setRole(null);
        delete api.defaults.headers.common["Authorization"];
    }

    return (
        <AuthContext.Provider
            value={{
                token,
                role,
                signIn,
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
