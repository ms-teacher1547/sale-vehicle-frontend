import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// URL de base pour l'authentification
const API_URL = "http://localhost:8081/api/auth";

// Création du contexte
const AuthContext = createContext();

// Hook personnalisé pour utiliser le contexte
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Vérifier si l'utilisateur est déjà connecté (session active)
  useEffect(() => {
    axios.get(`${API_URL}/me`, { withCredentials: true })
      .then(response => {
        console.log("🔍 Réponse de /me :", response.data); // 🔥 Vérifie ce que renvoie le backend
        setUser(response.data);
      })
      .catch(error => {
        console.error("⚠️ Erreur /me :", error.response?.data || error.message);
        setUser(null); // ✅ S'assure que `user` est bien `null`
      })
      .finally(() => setLoading(false));
  }, []);
  

  // Fonction de connexion
  const login = async (username, password) => {
    try {
      const params = new URLSearchParams({ username, password });
  
      console.log("🔍 Données envoyées à /login :", params.toString());
  
      await axios.post(`${API_URL}/login`, params, { withCredentials: true });
      const { data } = await axios.get(`${API_URL}/me`, { withCredentials: true });
  
      setUser(data);
      return true;
    } catch (error) {
      console.error("❌ Erreur de connexion :", error.response?.data || error.message);
      return false;
    }
  };
  

  // Fonction d'inscription
  const register = async (userData) => {
    try {
      await axios.post(`${API_URL}/register`, userData);
      return true;
    } catch (error) {
      return false;
    }
  };

  // Fonction de déconnexion
  const logout = async () => {
    try {
      await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
      setUser(null);
      window.location.href = "/"; // 🚀 Redirection automatique vers HomePage après déconnexion
    } catch (error) {
      console.error("❌ Erreur de déconnexion :", error.response?.data || error.message);
    }
  };
  

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
