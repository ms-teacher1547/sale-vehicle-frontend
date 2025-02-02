import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:8081/api/catalog/vehicles";

const VehicleDetails = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // ✅ Hook pour naviguer vers le catalogue

  useEffect(() => {
    axios.get(`${API_URL}/${id}`)
      .then(response => {
        setVehicle(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("❌ Erreur lors du chargement des détails :", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Chargement des détails...</p>;
  if (!vehicle) return <p>🚨 Véhicule non trouvé.</p>;

  return (
    <div className="container mt-5">
      <h2>Détails du Véhicule 🚗</h2>
      <p><strong>Nom :</strong> {vehicle.name}</p>
      <p><strong>Prix :</strong> {vehicle.price} FCFA</p>
      <p><strong>Année :</strong> {vehicle.yearOfManufacture}</p>
      <p><strong>Type de carburant :</strong> {vehicle.fuelType}</p>
      <p><strong>Kilométrage :</strong> {vehicle.mileage} km</p>

      {/* ✅ Bouton Retour */}
      <button className="btn btn-secondary mt-3" onClick={() => navigate("/catalog")}>
        ← Retour au Catalogue
      </button>
    </div>
  );
};

export default VehicleDetails;
