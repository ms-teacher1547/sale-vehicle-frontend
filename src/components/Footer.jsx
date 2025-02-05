import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa'; // Import des icônes de réseaux sociaux

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          {/* Colonne 1: Texte copyright */}
          <div className="col-12 col-lg-6 mb-3 mb-lg-0">
            <p className="mb-0">© 2024 Sale Vehicle - Tous droits réservés</p>
          </div>

          {/* Colonne 2: Liens réseaux sociaux */}
          <div className="col-12 col-lg-6 d-flex justify-content-center justify-content-lg-end social-icons">
            <a href="https://www.facebook.com" className="mx-2" target="_blank" rel="noopener noreferrer">
              <FaFacebookF />
            </a>
            <a href="https://twitter.com" className="mx-2" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </a>
            <a href="https://www.instagram.com" className="mx-2" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
