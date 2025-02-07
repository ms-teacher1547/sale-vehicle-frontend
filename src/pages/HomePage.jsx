import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { FaCar, FaShieldAlt, FaHandshake, FaSearch, FaArrowRight } from 'react-icons/fa';
import "../styles/HomePage.css";

const Feature = ({ icon: Icon, title, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    style={{
      backgroundColor: 'var(--surface)',
      padding: '0rem',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem',
      textAlign: 'center'
    }}
  >
    <div style={{
      backgroundColor: 'var(--primary-light)',
      padding: '0rem',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Icon size={24} color="var(--primary-main)" />
    </div>
    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{title}</h3>
    <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{description}</p>
  </motion.div>
);

const HomePage = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: FaCar,
      title: "Large Sélection",
      description: "Des milliers de véhicules disponibles pour tous les budgets"
    },
    {
      icon: FaShieldAlt,
      title: "Sécurité Garantie",
      description: "Transactions sécurisées et véhicules vérifiés"
    },
    {
      icon: FaHandshake,
      title: "Service Client",
      description: "Support client disponible 7j/7 pour vous accompagner"
    }
  ];

  return (
    <div className="home-container" style={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{
          padding: '8rem 2rem',
          color: 'white',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <motion.h1
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem'
          }}
        >
          Bienvenue sur <span style={{ color: 'var(--primary-light)' }}>Sale Vehicle</span>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          style={{
            fontSize: '1.25rem',
            maxWidth: '600px',
            margin: '0 auto 2rem'
          }}
        >
          Achetez et vendez des véhicules en toute simplicité !
        </motion.p>

        {user ? (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <h2 style={{ marginBottom: '1rem' }}>Bonjour, {user.username} !</h2>
            <p style={{ marginBottom: '2rem' }}>Découvrez notre catalogue et trouvez le véhicule de vos rêves.</p>
            <Link
              to="/catalog"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'white',
                color: 'var(--primary-main)',
                padding: '1rem 2rem',
                borderRadius: '50px',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'transform 0.2s',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
            >
              <FaSearch /> Voir le Catalogue <FaArrowRight />
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}
          >
            <Link
              to="/login"
              style={{
                backgroundColor: 'white',
                color: 'var(--primary-main)',
                padding: '1rem 2rem',
                borderRadius: '50px',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'transform 0.2s',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
            >
              Se connecter
            </Link>
            <Link
              to="/register"
              style={{
                backgroundColor: 'transparent',
                color: 'white',
                padding: '1rem 2rem',
                borderRadius: '50px',
                textDecoration: 'none',
                fontWeight: '500',
                border: '2px solid white',
                transition: 'transform 0.2s'
              }}
            >
              S'inscrire
            </Link>
          </motion.div>
        )}
      </motion.section>

      {/* Features Section */}
      <section style={{ padding: '4rem 2rem', backgroundColor: 'var(--background)' }}>
        <h2 style={{
          textAlign: 'center',
          marginBottom: '3rem',
          fontSize: '2rem',
          fontWeight: 'bold',
          color: 'var(--text-primary)'
        }}>
          Pourquoi nous choisir ?
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {features.map((feature, index) => (
            <Feature
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section style={{
        backgroundColor: 'var(--primary-light)',
        padding: '4rem 2rem',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: 'var(--primary-dark)',
          marginBottom: '1.5rem'
        }}>
          Prêt à commencer ?
        </h2>
        <p style={{
          fontSize: '1.25rem',
          color: 'var(--primary-dark)',
          marginBottom: '2rem',
          opacity: 0.9
        }}>
          Rejoignez notre communauté et trouvez le véhicule de vos rêves dès aujourd'hui.
        </p>
        <Link
          to={user ? "/catalog" : "/register"}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'var(--primary-dark)',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '50px',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'transform 0.2s',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}
        >
          {user ? "Explorer le Catalogue" : "Commencer Maintenant"} <FaArrowRight />
        </Link>
      </section>
    </div>
  );
};

export default HomePage;
