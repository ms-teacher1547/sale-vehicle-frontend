import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/theme.css";

const API_URL_VEHICLES = "http://localhost:8081/api/catalog/vehicles";
const API_URL_OPTIONS = "http://localhost:8081/api/options";
const API_URL_CART = "http://localhost:8081/api/cart";

const ChooseOptions = () => {
const { user } = useAuth();
const navigate = useNavigate();

useEffect(() => {
  if (!user) {
    navigate("/login");
  }
}, [user, navigate]);


  const [vehicles, setVehicles] = useState([]); // 🔹 Liste des véhicules
  const [options, setOptions] = useState([]); // 🔹 Liste des options
  const [selectedVehicle, setSelectedVehicle] = useState(null); // 🔹 Véhicule sélectionné
  const [selectedOptions, setSelectedOptions] = useState([]); // 🔹 Options sélectionnées
  const [quantity, setQuantity] = useState(1); // 🔹 Quantité de véhicules
  const [error, setError] = useState(""); // 🔹 Gestion des erreurs

  useEffect(() => {
    fetchVehicles();
    fetchOptions();
  }, []);

  // ✅ Récupérer la liste des véhicules
  const fetchVehicles = async () => {
    try {
        const response = await axios.get(`${API_URL_VEHICLES}`, { withCredentials: true });
        setVehicles(response.data);
    } catch (error) {
      console.error("❌ Erreur lors du chargement des véhicules :", error);
      setError("Impossible de charger les véhicules.");
    }
  };

  // ✅ Récupérer la liste des options
  const fetchOptions = async () => {
    try {
      const response = await axios.get(`${API_URL_OPTIONS}/`);
      setOptions(response.data);
    } catch (error) {
      console.error("❌ Erreur lors du chargement des options :", error);
      setError("Impossible de charger les options.");
    }
  };

  // ✅ Gérer la sélection d'un véhicule
  const handleSelectVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setSelectedOptions([]); // Réinitialiser les options sélectionnées
  };

  // ✅ Gérer la sélection d'une option (avec vérification d'incompatibilité)
  const handleSelectOption = (option) => {
    // Vérifier si une incompatibilité existe
    const incompatible = selectedOptions.some(selectedOption => 
      option.incompatibleOptions?.some(incomp => incomp.id === selectedOption.id)
    );

    if (incompatible) {
      setError(`❌ L'option ${option.name} est incompatible avec celles déjà sélectionnées.`);
      return;
    }

    // Ajouter ou retirer l'option
    setSelectedOptions(prevOptions =>
      prevOptions.includes(option)
        ? prevOptions.filter(opt => opt.id !== option.id)
        : [...prevOptions, option]
    );
    setError(""); // Reset error
  };

  // ✅ Ajouter au panier
  const addToCart = async () => {
    if (!selectedVehicle) {
      setError("⚠️ Veuillez sélectionner un véhicule.");
      return;
    }

    try {
      await axios.post(
        `${API_URL_CART}/add`,
        {
          vehicleId: selectedVehicle.id,
          options: selectedOptions.map(opt => opt.id),
          quantity: quantity
        },
        { withCredentials: true }
      );

      navigate("/cart"); // Redirection vers le panier après ajout
    } catch (error) {
      console.error("❌ Erreur lors de l'ajout au panier :", error);
      setError("Les deux options sont incompatibles, selections autres.");
    }
  };

  return (
    <div className="container" style={{ padding: '2rem', backgroundColor: 'var(--background)' }}>
      <div style={{ 
        backgroundColor: 'var(--primary-dark)', 
        padding: '5rem 1rem', 
        marginBottom: '2rem',
        borderRadius: '0 0 20px 20px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
      <h2 style={{ 
          color: 'var(--surface)', 
          marginBottom: '1rem', 
          textAlign: 'center', 
          fontSize: '2.5rem',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: '2px'
        }}>Personnalisez Votre Véhicule 🚗</h2>
        <p style={{ 
          color: 'var(--accent)', 
          textAlign: 'center',
          fontSize: '1.1rem',
          marginBottom: '0'
        }}>Choisissez votre véhicule et configurez-le selon vos préférences</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* 🔹 Sélection des véhicules */}
      <h3 style={{ 
        color: 'var(--primary-main)',
        marginBottom: '1.5rem',
        fontSize: '1.8rem',
        fontWeight: 'bold',
        textAlign: 'center',
        position: 'relative',
        paddingBottom: '0.5rem'
      }}>
        <span style={{
          display: 'block',
          width: '50px',
          height: '4px',
          backgroundColor: 'var(--accent)',
          margin: '0.5rem auto',
          borderRadius: '2px'
        }}></span>
        Véhicules Disponibles
      </h3>
      <div className="grid">
      {vehicles.map((vehicle) => (
        <div key={vehicle.id} className="vehicle-card" style={{ 
              padding: '1.5rem', 
              backgroundColor: 'var(--surface)',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease',
              border: '1px solid var(--border)',
              position: 'relative',
              overflow: 'hidden'
            }}>
            <div style={{
              position: 'absolute',
              top: '0',
              right: '0',
              backgroundColor: 'var(--primary-main)',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0 0 0 12px',
              fontSize: '0.9rem',
              fontWeight: 'bold'
            }}>Disponible</div>
            <h3 style={{ 
              fontSize: '1.5rem',
              color: 'var(--primary-dark)',
              marginTop: '2rem',
              marginBottom: '1rem',
              fontWeight: 'bold'
            }}>{vehicle.name || "Nom non disponible"}</h3> {/* 🔥 Ajout du nom */}
            {/* <p><strong>Type :</strong> {vehicle.type || "Type inconnu"}</p> 🔥 Affichage correct du type */}
            <div style={{ 
              backgroundColor: 'var(--background)',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1rem'
            }}>
              <p style={{ 
                fontSize: '1.2rem',
                color: 'var(--primary-dark)',
                margin: '0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <strong>Prix</strong>
                <span style={{ 
                  color: 'var(--primary-main)',
                  fontWeight: 'bold'
                }}>{vehicle.price.toLocaleString()} FCFA</span>
              </p>
            </div>
            <button 
              className="btn-primary" 
              style={{
                width: '100%',
                padding: '1rem',
                marginTop: '1rem',
                borderRadius: '25px',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                backgroundColor: 'var(--primary-main)',
                border: 'none',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                cursor: 'pointer'
              }} 
              onClick={() => handleSelectVehicle(vehicle)}
            >
              🚗 Choisir ce véhicule
            </button>
        </div>
        ))}

      </div>

      {/* 🔹 Sélection des options */}
      {selectedVehicle && (
        <>
          <h3 style={{ 
            color: 'var(--primary-main)',
            marginTop: '3rem',
            marginBottom: '1.5rem',
            fontSize: '1.8rem',
            fontWeight: 'bold',
            textAlign: 'center',
            position: 'relative',
            paddingBottom: '0.5rem'
          }}>
            <span style={{
              display: 'block',
              width: '50px',
              height: '4px',
              backgroundColor: 'var(--accent)',
              margin: '0.5rem auto',
              borderRadius: '2px'
            }}></span>
            Options Disponibles
          </h3>
          <div className="grid">
            {options.map(option => (
              <div key={option.id}>
                <div 
                  className="vehicle-card" 
                  style={{ 
                    padding: '1.5rem', 
                    backgroundColor: selectedOptions.includes(option) ? 'var(--accent)' : 'var(--surface)', 
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }} 
                  onClick={() => handleSelectOption(option)}
                >
                  <div style={{
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}>
                    <h5 style={{
                      fontSize: '1.3rem',
                      color: 'var(--primary-dark)',
                      margin: '0',
                      fontWeight: 'bold'
                    }}>{option.name}</h5>
                    <div style={{
                      backgroundColor: 'var(--background)',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span>Prix</span>
                      <span style={{ color: 'var(--primary-main)', fontWeight: 'bold' }}>
                        {option.price.toLocaleString()} FCFA
                      </span>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: 'var(--text-secondary)'
                    }}>
                      <span style={{
                        backgroundColor: 'var(--primary-light)',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.9rem'
                      }}>{option.category}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 🔹 Sélection de la quantité */}
          <div className="mt-4">
            <label style={{
              display: 'block',
              color: 'var(--primary-dark)',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              marginBottom: '0.5rem'
            }}>📊 Quantité</label>
            <input
              type="number"
              value={quantity}
              min="1"
              className="form-control"
              style={{ 
                padding: '0.75rem',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                width: '100%',
                marginTop: '0.5rem'
              }}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
            />
          </div>

          {/* 🔹 Bouton pour ajouter au panier */}
          <button 
            className="btn-primary" 
            style={{ 
              marginTop: '2rem', 
              width: '100%', 
              padding: '1.25rem',
              borderRadius: '25px',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              backgroundColor: 'var(--primary-dark)',
              border: 'none',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }} 
            onClick={addToCart}>
            🛒 Ajouter au Panier
          </button>
        </>
      )}

      {/* 🔙 Retour au Catalogue */}
      <button 
          className="btn-primary" 
          style={{ 
            marginTop: '1rem', 
            width: '100%', 
            padding: '1rem',
            borderRadius: '25px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            backgroundColor: 'var(--primary-light)',
            border: 'none',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }} 
          onClick={() => navigate("/catalog")}>
        🔙 Retour au Catalogue
      </button>
    </div>
  );
};

export default ChooseOptions;