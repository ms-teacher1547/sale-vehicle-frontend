import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Sale Vehicle</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/catalog">Catalogue</Link>
            </li>
            {user && user.role === "ADMIN" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/vehicles">Gérer les véhicules</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/orders">Gérer les commandes</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/customers">Gérer les clients</Link>
                </li>
              </>
            )}
            {user && (
              <li className="nav-item">
                <Link className="nav-link" to="/profile">Profil</Link>
              </li>
            )}
          </ul>
          <div className="d-flex">
            {!user ? (
              <>
                <Link className="btn btn-outline-success me-2" to="/login">Connexion</Link>
                <Link className="btn btn-success" to="/register">Inscription</Link>
              </>
            ) : (
              <Link className="btn btn-danger" to="/profile">Se déconnecter</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
