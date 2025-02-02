import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const Register = () => {
  const [userData, setUserData] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    address: '',
    type: 'INDIVIDUAL', // ✅ Par défaut, un utilisateur est "INDIVIDUAL"
    role: 'USER',
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // ✅ Gestion du changement de valeurs des inputs
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // ✅ Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // 🔹 Vérifier que tous les champs sont remplis
    if (!userData.username || !userData.password || !userData.fullName || !userData.email || !userData.address) {
      setError('⚠️ Veuillez remplir tous les champs.');
      return;
    }

    try {
      const response = await authService.register(userData);
      console.log('✅ Inscription réussie:', response);

      setSuccessMessage("🎉 Inscription réussie ! Redirection en cours...");
      setTimeout(() => navigate('/login'), 2000); // 🔄 Redirection vers la connexion après 2 sec
    } catch (err) {
      console.error("❌ Erreur lors de l'inscription:", err);
      setError("⚠️ Une erreur est survenue lors de l'inscription. Vérifiez vos informations.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Inscription</h2>

      {/* ✅ Affichage des messages de succès ou d'erreur */}
      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nom d'utilisateur :</label>
          <input
            type="text"
            className="form-control"
            name="username"
            value={userData.username}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Mot de passe :</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={userData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Nom complet :</label>
          <input
            type="text"
            className="form-control"
            name="fullName"
            value={userData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email :</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={userData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Adresse :</label>
          <input
            type="text"
            className="form-control"
            name="address"
            value={userData.address}
            onChange={handleChange}
            required
          />
        </div>

        {/* ✅ Sélecteur pour choisir le type de client */}
        <div className="mb-3">
          <label className="form-label">Type de compte :</label>
          <select
            className="form-control"
            name="type"
            value={userData.type}
            onChange={handleChange}
            required
          >
            <option value="INDIVIDUAL">👤 Particulier</option>
            <option value="COMPANY">🏢 Entreprise</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">S'inscrire</button>
      </form>
    </div>
  );
};

export default Register;
