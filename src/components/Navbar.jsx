import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaHome, FaUser, FaShoppingCart, FaList, FaSignOutAlt, FaCogs, FaBox } from "react-icons/fa"; // Icônes utilisées
import "../styles/Navbar.css";

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Fonction pour vérifier si le lien est actif
  const isActive = (path) => location.pathname === path ? "active" : "";

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-lg position-fixed w-100 top-0 start-0">
      <div className="container-fluid d-flex justify-content-between">
        {/* Logo et lien vers la page d'accueil */}
        <Link className="navbar-brand text-white fw-bold" to="/">
          Sale Vehicle
        </Link>

        {/* Liens principaux de la navigation */}
        <div className="navbar-nav mx-auto">
          <Link className={`nav-link text-white hover-effect ${isActive("/")}`} to="/">
            <FaHome className="me-2" /> Accueil
          </Link>

          {/* Panier visible uniquement pour les utilisateurs */}
          {user?.role === "USER" && (
            <>
              <Link className={`nav-link text-white hover-effect ${isActive("/catalog")}`} to="/catalog">
                <FaList className="me-2" /> Catalogue
              </Link>
              <Link className={`nav-link text-white hover-effect ${isActive("/cart")}`} to="/cart">
                <FaShoppingCart className="me-2" /> Panier
              </Link>
              <Link className={`nav-link text-white hover-effect ${isActive("/my-orders")}`} to="/my-orders">
                <FaBox className="me-2" /> Mes commandes
              </Link>
              <Link className={`nav-link text-white hover-effect ${isActive("/my-invoices")}`} to="/my-invoices">
                <FaBox className="me-2" /> Mes factures
              </Link>
            </>
          )}

          {/* Liens admin visibles uniquement pour les administrateurs */}
          {user?.role === "ADMIN" && (
            <>
              <Link className={`nav-link text-white hover-effect ${isActive("/admin/catalog")}`} to="/admin/catalog">
                <FaList className="me-2" /> Gérer le Catalogue
              </Link>
              <Link className={`nav-link text-white hover-effect ${isActive("/admin/orders")}`} to="/admin/orders">
                <FaCogs className="me-2" /> Gérer les commandes
              </Link>
              <Link className={`nav-link text-white hover-effect ${isActive("/admin/customers")}`} to="/admin/customers">
                <FaUser className="me-2" /> Gérer les clients
              </Link>
              <Link className={`nav-link text-white hover-effect ${isActive("/admin/options")}`} to="/admin/options">
                <FaCogs className="me-2" /> Gérer les options
              </Link>
            </>
          )}
        </div>

        {/* Liens de profil et de connexion/déconnexion avec icônes */}
        <div className="d-flex ms-auto">
          {user ? (
            <>
              {/* Profil et déconnexion avec icônes uniquement */}
             {/* Profil */}
              <Link className={`btn btn-outline-light profil-btn hover-effect ${isActive("/profile")}`} to="/profile">
                <FaUser className="me-2" />
              </Link>

            </>
          ) : (
            <>
              {/* Si l'utilisateur n'est pas connecté */}
              <Link className={`btn btn-outline-light me-2 hover-effect ${isActive("/login")}`} to="/login">
                Connexion
              </Link>
              <Link className={`btn btn-light text-primary hover-effect ${isActive("/register")}`} to="/register">
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
