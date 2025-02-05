import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import '../../styles/Register.css'; // Ajoute un fichier CSS pour le style

const Register = () => {
  const [userData, setUserData] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    address: '',
    type: 'INDIVIDUAL',
    role: 'USER',
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!userData.username || !userData.password || !userData.fullName || !userData.email || !userData.address) {
      setError('⚠️ Veuillez remplir tous les champs.');
      return;
    }

    try {
      const response = await authService.register(userData);
      setSuccessMessage("🎉 Inscription réussie ! Redirection en cours...");
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError("⚠️ Une erreur est survenue lors de l'inscription. Vérifiez vos informations.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Inscription</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Nom d'utilisateur :</label>
            <input
              type="text"
              className="input-field"
              name="username"
              value={userData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Mot de passe :</label>
            <input
              type="password"
              className="input-field"
              name="password"
              value={userData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Nom complet :</label>
            <input
              type="text"
              className="input-field"
              name="fullName"
              value={userData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Email :</label>
            <input
              type="email"
              className="input-field"
              name="email"
              value={userData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Adresse :</label>
            <input
              type="text"
              className="input-field"
              name="address"
              value={userData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Type de compte :</label>
            <select
              className="input-field"
              name="type"
              value={userData.type}
              onChange={handleChange}
              required
            >
              <option value="INDIVIDUAL">👤 Particulier</option>
              <option value="COMPANY">🏢 Entreprise</option>
            </select>
          </div>

          <button type="submit" className="submit-btn">S'inscrire</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
