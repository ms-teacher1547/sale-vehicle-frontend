import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/VehicleDetails.css"; // ✅ Style spécifique à cette page

const API_URL = "http://localhost:8081/api/catalog/vehicles";

const VehicleDetails = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_URL}/${id}`)
      .then(response => {
        setVehicle(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("❌ Erreur lors du chargement des détails :", error);
        setError(true);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="loading">Chargement des détails...</p>;
  if (error) return <p className="error">❌ Erreur lors du chargement du véhicule.</p>;
  if (!vehicle) return <p className="not-found">🚨 Véhicule non trouvé.</p>;

  return (
    <div className="vehicle-details-container">
      <div className="vehicle-card">
        {/* ✅ Affichage de l'image du véhicule */}
        {vehicle.imageUrl && (
          <img src={vehicle.imageUrl} alt={vehicle.name} className="vehicle-image" />
        )}

        <h2>{vehicle.name} 🚗</h2>

        <div className="vehicle-info">
          <p><strong>Prix :</strong> {vehicle.price} FCFA</p>
          <p><strong>Année :</strong> {vehicle.yearOfManufacture}</p>
          <p><strong>Type de carburant :</strong> {vehicle.fuelType}</p>
          <p><strong>Kilométrage :</strong> {vehicle.mileage} km</p>
        </div>

        <button className="back-button" onClick={() => navigate("/catalog")}>
          ← Retour au Catalogue
        </button>
      </div>
    </div>
  );
};

export default VehicleDetails;
