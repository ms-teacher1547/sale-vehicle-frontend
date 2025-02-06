import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/ChooseOptions.css";

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
    <div className="choose-options-container">
      <h2>Choisir un véhicule et ses options 🛒</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* 🔹 Sélection des véhicules */}
      <h4>Véhicules disponibles</h4>
      <div className="row">
      {vehicles.map((vehicle) => (
        <div key={vehicle.id} className="card">
            <h3>{vehicle.name || "Nom non disponible"}</h3> {/* 🔥 Ajout du nom */}
            {/* <p><strong>Type :</strong> {vehicle.type || "Type inconnu"}</p> 🔥 Affichage correct du type */}
            <p><strong>Prix :</strong> {vehicle.price} FCFA</p>
            <button onClick={() => handleSelectVehicle(vehicle)}>Choisir</button>
        </div>
        ))}

      </div>

      {/* 🔹 Sélection des options */}
      {selectedVehicle && (
        <>
          <h4 className="mt-4">Options disponibles</h4>
          <div className="row">
            {options.map(option => (
              <div key={option.id} className="col-md-4">
                <div 
                  className={`card ${selectedOptions.includes(option) ? "bg-warning" : ""}`} 
                  onClick={() => handleSelectOption(option)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="card-body">
                    <h5 className="card-title">{option.name}</h5>
                    <p className="card-text">Prix: {option.price} FCFA</p>
                    <p className="card-text">Catégorie: {option.category}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 🔹 Sélection de la quantité */}
          <div className="mt-4">
            <label>Quantité:</label>
            <input
              type="number"
              value={quantity}
              min="1"
              className="form-control"
              onChange={(e) => setQuantity(parseInt(e.target.value))}
            />
          </div>

          {/* 🔹 Bouton pour ajouter au panier */}
          <button className="btn btn-custom mt-3" onClick={addToCart}>
            🛒 Ajouter au Panier
          </button>
        </>
      )}

      {/* 🔙 Retour au Catalogue */}
      <button className="btn btn-secondary-custom mt-3" onClick={() => navigate("/catalog")}>
        🔙 Retour au Catalogue
      </button>
    </div>
  );
};

export default ChooseOptions;