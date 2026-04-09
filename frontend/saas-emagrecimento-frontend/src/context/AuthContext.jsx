"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  loginService,
  socialLoginService,
  getPerfilService,
} from "../services/authService";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function refreshUser() {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      return null;
    }

    const resposta = await getPerfilService(token);

    const usuario =
      resposta?.data || resposta?.usuario || resposta?.data?.usuario || null;

    setUser(usuario);
    return usuario;
  }

  useEffect(() => {
    async function carregarUsuario() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }

        await refreshUser();
      } catch (error) {
        console.error("Erro ao carregar usuário:", error.message);
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    carregarUsuario();
  }, []);

  async function login(email, senha) {
    const resposta = await loginService(email, senha);

    const token =
      resposta?.token ||
      resposta?.data?.token ||
      resposta?.access_token ||
      null;

    if (!token) {
      console.error("Resposta do backend no login:", resposta);
      throw new Error("Token não retornado pelo backend");
    }

    localStorage.setItem("token", token);

    const usuarioPerfil = await refreshUser();
    setUser(usuarioPerfil);
    return usuarioPerfil;
  }

  // ====================================================
  // Base pronta para login social:
  // o backend devolve o mesmo JWT interno e o fluxo
  // continua igual para web e mobile/Capacitor.
  // ====================================================
  async function socialLogin(payload) {
    const resposta = await socialLoginService(payload);

    const token =
      resposta?.token ||
      resposta?.data?.token ||
      resposta?.access_token ||
      null;

    if (!token) {
      throw new Error("Token não retornado pelo backend");
    }

    localStorage.setItem("token", token);

    const usuarioPerfil = await refreshUser();
    setUser(usuarioPerfil);
    return usuarioPerfil;
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        socialLogin,
        logout,
        refreshUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
