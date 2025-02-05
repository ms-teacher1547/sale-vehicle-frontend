import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import '../../styles/Login.css';  // Ajoute un fichier CSS pour le style

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(username, password);
    if (success) {
      navigate("/profile"); // 🔄 Redirige vers le profil après connexion
    } else {
      setError("⚠️ Identifiants incorrects !");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Connexion</h2>
        {error && <div className="alert">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Nom d'utilisateur :</label>
            <input
              type="text"
              className="input-field"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Mot de passe :</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Cacher le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? "👁️" : "🙈"}
              </button>
            </div>
          </div>
          <button type="submit" className="submit-btn">Se connecter</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
