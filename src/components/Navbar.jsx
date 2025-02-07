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
    <nav style={{
      backgroundColor: 'var(--primary-dark)',
      padding: '1rem',
      position: 'fixed',
      width: '100%',
      top: 0,
      left: 0,
      zIndex: 1000,
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1rem'
      }}>
        {/* Logo */}
        <Link 
          to="/"
          style={{
            color: 'var(--surface)',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          🚗 Sale Vehicle
        </Link>

        {/* Navigation Links */}
        <div style={{
          display: 'flex',
          gap: '1.5rem',
          alignItems: 'center'
        }}>
          <Link 
            to="/"
            style={{
              color: location.pathname === '/' ? 'var(--accent)' : 'var(--surface)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: location.pathname === '/' ? 'bold' : 'normal',
              transition: 'all 0.2s ease'
            }}
          >
            <FaHome /> Accueil
          </Link>

          {/* User Links */}
          {user?.role === "USER" && (
            <>
              <Link 
                to="/catalog"
                style={{
                  color: location.pathname === '/catalog' ? 'var(--accent)' : 'var(--surface)',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.9rem',
                  fontWeight: location.pathname === '/catalog' ? 'bold' : 'normal',
                  transition: 'all 0.2s ease'
                }}
              >
                <FaList /> Catalogue
              </Link>
              <Link 
                to="/cart"
                style={{
                  color: location.pathname === '/cart' ? 'var(--accent)' : 'var(--surface)',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.9rem',
                  fontWeight: location.pathname === '/cart' ? 'bold' : 'normal',
                  transition: 'all 0.2s ease'
                }}
              >
                <FaShoppingCart /> Panier
              </Link>
              <Link 
                to="/my-orders"
                style={{
                  color: location.pathname === '/my-orders' ? 'var(--accent)' : 'var(--surface)',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.9rem',
                  fontWeight: location.pathname === '/my-orders' ? 'bold' : 'normal',
                  transition: 'all 0.2s ease'
                }}
              >
                <FaBox /> Mes commandes
              </Link>
              <Link 
                to="/my-invoices"
                style={{
                  color: location.pathname === '/my-invoices' ? 'var(--accent)' : 'var(--surface)',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.9rem',
                  fontWeight: location.pathname === '/my-invoices' ? 'bold' : 'normal',
                  transition: 'all 0.2s ease'
                }}
              >
                <FaBox /> Mes factures
              </Link>
            </>
          )}

          {/* Admin Links */}
          {user?.role === "ADMIN" && (
            <>
              <Link 
                to="/admin/catalog"
                style={{
                  color: location.pathname === '/admin/catalog' ? 'var(--accent)' : 'var(--surface)',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.9rem',
                  fontWeight: location.pathname === '/admin/catalog' ? 'bold' : 'normal',
                  transition: 'all 0.2s ease'
                }}
              >
                <FaList /> Gérer le Catalogue
              </Link>
              <Link 
                to="/admin/orders"
                style={{
                  color: location.pathname === '/admin/orders' ? 'var(--accent)' : 'var(--surface)',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.9rem',
                  fontWeight: location.pathname === '/admin/orders' ? 'bold' : 'normal',
                  transition: 'all 0.2s ease'
                }}
              >
                <FaCogs /> Gérer les commandes
              </Link>
              <Link 
                to="/admin/customers"
                style={{
                  color: location.pathname === '/admin/customers' ? 'var(--accent)' : 'var(--surface)',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.9rem',
                  fontWeight: location.pathname === '/admin/customers' ? 'bold' : 'normal',
                  transition: 'all 0.2s ease'
                }}
              >
                <FaUser /> Gérer les clients
              </Link>
              <Link 
                to="/admin/options"
                style={{
                  color: location.pathname === '/admin/options' ? 'var(--accent)' : 'var(--surface)',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.9rem',
                  fontWeight: location.pathname === '/admin/options' ? 'bold' : 'normal',
                  transition: 'all 0.2s ease'
                }}
              >
                <FaCogs /> Gérer les options
              </Link>
            </>
          )}
        </div>

        {/* Auth Links */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center'
        }}>
          {user ? (
            <Link 
              to="/profile"
              style={{
                backgroundColor: 'transparent',
                border: '2px solid var(--surface)',
                color: 'var(--surface)',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease',
                fontSize: '0.9rem'
              }}
            >
              <FaUser /> Profil
            </Link>
          ) : (
            <>
              <Link 
                to="/login"
                style={{
                  backgroundColor: 'transparent',
                  border: '2px solid var(--surface)',
                  color: 'var(--surface)',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease',
                  fontSize: '0.9rem'
                }}
              >
                Connexion
              </Link>
              <Link 
                to="/register"
                style={{
                  backgroundColor: 'var(--surface)',
                  color: 'var(--primary-dark)',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease',
                  fontSize: '0.9rem',
                  fontWeight: 'bold'
                }}
              >
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
