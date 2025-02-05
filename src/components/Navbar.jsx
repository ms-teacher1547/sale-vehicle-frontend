import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaHome, FaUser, FaShoppingCart, FaSignOutAlt } from "react-icons/fa"; // Icônes utilisées
import "../styles/Navbar.css";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-lg position-fixed w-100 top-0 start-0">
      <div className="container-fluid d-flex justify-content-between">
        {/* Logo et lien vers la page d'accueil */}
        <Link className="navbar-brand text-white fw-bold" to="/">
          Sale Vehicle
        </Link>

        {/* Liens principaux de la navigation */}
        <div className="navbar-nav mx-auto">
          <Link className="nav-link text-white hover-effect" to="/">
            <FaHome className="me-2" /> Home
          </Link>

          {/* Panier visible uniquement pour les utilisateurs */}
          {user?.role === "USER" && (
            <>
              <Link className="nav-link text-white hover-effect" to="/catalog">
                Catalogue
              </Link>

              <Link className="nav-link text-white hover-effect" to="/choose-options">
                <FaShoppingCart className="me-2" /> Panier
              </Link>
            </>
          )}

          {/* Liens admin visibles uniquement pour les administrateurs */}
          {user?.role === "ADMIN" && (
            <>
              <Link className="nav-link text-white hover-effect" to="/admin/catalog">
                Gérer le Catalogue
              </Link>
              <Link className="nav-link text-white hover-effect" to="/admin/vehicles">
                Gérer les véhicules
              </Link>
              <Link className="nav-link text-white hover-effect" to="/admin/orders">
                Gérer les commandes
              </Link>
              <Link className="nav-link text-white hover-effect" to="/admin/customers">
                Gérer les clients
              </Link>
            </>
          )}
        </div>

        {/* Liens de profil et de connexion/déconnexion */}
        <div className="d-flex ms-auto">
          {user ? (
            <>
              {/* Profil et déconnexion */}
              <Link className="btn btn-outline-light me-2 hover-effect" to="/profile">
                <FaUser className="me-2" /> Profil
              </Link>
              <Link className="btn btn-outline-light hover-effect" to="/logout">
                <FaSignOutAlt className="me-2" /> Se déconnecter
              </Link>
            </>
          ) : (
            <>
              {/* Si l'utilisateur n'est pas connecté */}
              <Link className="btn btn-outline-light me-2 hover-effect" to="/login">
                Connexion
              </Link>
              <Link className="btn btn-light text-primary hover-effect" to="/register">
                Inscription
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
