import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="container mt-5 text-center">
      <h1>Bienvenue sur Sale Vehicle 🚗</h1>
      <p>Votre plateforme pour acheter des véhicules en ligne.</p>

      {user ? (
        // 🔥 Si l'utilisateur est connecté, on lui propose d'aller au catalogue
        <>
          <h2>Bonjour, {user.username} !</h2>
          <p>Vous pouvez maintenant explorer notre catalogue et passer commande.</p>
          <Link to="/catalog" className="btn btn-primary">Accéder au catalogue</Link>
        </>
      ) : (
        // 🔥 Si l'utilisateur n'est pas connecté, on lui propose de se connecter ou s'inscrire
        <>
          <p>Vous avez déjà un compte ?</p>
          <Link to="/login" className="btn btn-success me-2">Se connecter</Link>
          <Link to="/register" className="btn btn-outline-primary">Créer un compte</Link>
        </>
      )}
    </div>
  );
};

export default HomePage;
