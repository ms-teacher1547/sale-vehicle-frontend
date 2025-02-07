import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa'; // Import des icônes de réseaux sociaux

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--primary-dark)',
      color: 'var(--surface)',
      padding: '2rem 0',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {/* Company Info */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: 'var(--surface)'
            }}>
              🚗 Sale Vehicle
            </h3>
            <p style={{
              color: 'var(--surface-variant)',
              fontSize: '0.9rem',
              lineHeight: '1.5'
            }}>
              Votre partenaire de confiance pour l'achat de véhicules neufs et d'occasion.
              Nous vous offrons une large sélection de véhicules de qualité.
            </p>
          </div>

          {/* Quick Links */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <h4 style={{
              fontSize: '1.2rem',
              fontWeight: 'bold',
              color: 'var(--surface)'
            }}>
              Liens rapides
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.5rem'
            }}>
              <a 
                href="/catalog"
                style={{
                  color: 'var(--surface-variant)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'color 0.2s ease'
                }}
              >
                Catalogue
              </a>
              <a 
                href="/contact"
                style={{
                  color: 'var(--surface-variant)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'color 0.2s ease'
                }}
              >
                Contact
              </a>
              <a 
                href="/about"
                style={{
                  color: 'var(--surface-variant)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'color 0.2s ease'
                }}
              >
                À propos
              </a>
              <a 
                href="/faq"
                style={{
                  color: 'var(--surface-variant)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'color 0.2s ease'
                }}
              >
                FAQ
              </a>
            </div>
          </div>

          {/* Social Links */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <h4 style={{
              fontSize: '1.2rem',
              fontWeight: 'bold',
              color: 'var(--surface)'
            }}>
              Suivez-nous
            </h4>
            <div style={{
              display: 'flex',
              gap: '1rem'
            }}>
              <a 
                href="https://www.facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  backgroundColor: 'var(--surface)',
                  color: 'var(--primary-dark)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.2s ease'
                }}
              >
                <FaFacebookF size={20} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  backgroundColor: 'var(--surface)',
                  color: 'var(--primary-dark)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.2s ease'
                }}
              >
                <FaTwitter size={20} />
              </a>
              <a 
                href="https://www.instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  backgroundColor: 'var(--surface)',
                  color: 'var(--primary-dark)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.2s ease'
                }}
              >
                <FaInstagram size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div style={{
          borderTop: '1px solid var(--surface-variant)',
          marginTop: '2rem',
          paddingTop: '1rem',
          textAlign: 'center',
          color: 'var(--surface-variant)',
          fontSize: '0.9rem'
        }}>
          © 2024 Sale Vehicle - Tous droits réservés
        </div>
      </div>
    </footer>
  );
};

export default Footer;
