import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import "../styles/HomePage.css";
import carImage from "../assets/xl.jpeg";

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="home-container d-flex flex-column justify-content-center align-items-center text-center">
      {/* Texte d'accueil animé */}
      <motion.h1 
        className="title"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Bienvenue sur <span className="brand">Sale Vehicle</span> 🚗
      </motion.h1>
      
      <motion.p 
        className="subtitle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        Achetez et vendez des véhicules en toute simplicité !
      </motion.p>
      
      {user ? (
        <>
          <h2 className="welcome-text">Bonjour, {user.username} !</h2>
          <p className="info-text">Découvrez notre catalogue et trouvez le véhicule de vos rêves.</p>
          <Link to="/catalog" className="btn btn-primary btn-lg">Voir le Catalogue</Link>
        </>
      ) : (
        <>
          <p className="info-text">Créez un compte et profitez des meilleures offres !</p>
          <div>
            <Link to="/login" className="btn btn-success me-3">Se connecter</Link>
            <Link to="/register" className="btn btn-outline-light">S'inscrire</Link>
          </div>
        </>
      )}

      {/* Animation d'une voiture */}
      {/* <motion.img 
        src={carImage} 
        alt="Voiture animée" 
        className="car-image"
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.5 }}
      /> */}
    </div>
  );
};

export default HomePage;
