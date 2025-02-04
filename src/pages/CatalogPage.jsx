import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // Importer le contexte d'authentification

const API_URL = "http://localhost:8081/api/catalog/vehicles/search";

const CatalogPage = () => {
  const { user } = useAuth(); // ✅ Récupérer l'utilisateur connecté
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(""); // ✅ Recherche par nom
  const [filters, setFilters] = useState({
    priceMin: "",
    priceMax: "",
    keywords: "",
    operator: "OR",
  });

  const navigate = useNavigate(); // ✅ Hook pour la navigation

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = () => {
    axios
      .get(API_URL)
      .then((response) => {
        setVehicles(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ Erreur lors du chargement des véhicules :", error);
        setLoading(false);
      });
  };

  const handleSearch = () => {
    let query = `${API_URL}?name=${search}`;

    if (filters.priceMin) query += `&priceMin=${filters.priceMin}`;
    if (filters.priceMax) query += `&priceMax=${filters.priceMax}`;
    if (filters.keywords) query += `&keywords=${filters.keywords}&operator=${filters.operator}`;

    axios
      .get(query)
      .then((response) => {
        setVehicles(response.data);
      })
      .catch((error) => console.error("❌ Erreur lors de la recherche :", error));
  };

  if (loading) return <p>Chargement des véhicules...</p>;

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Catalogue des Véhicules 🚗</h2>
        <div>
          <button className="btn btn-info me-2" onClick={() => navigate("/profile")}>
            👤 Aller au Profil
          </button>

          {/* ✅ Bouton visible UNIQUEMENT pour l'ADMIN */}
          {user?.role === "ADMIN" && (
            <button className="btn btn-warning" onClick={() => navigate("/admin/catalog")}>
              ⚙️ Gérer le Catalogue
            </button>
          )}

          {user.role === "USER" && (
              <button className="btn btn-primary mt-3" onClick={() => navigate("/choose-options")}>
                🚗 Ajouter un element au panier
              </button>
          )}
        </div>
      </div>

      {/* ✅ Barre de Recherche et Filtres */}
      <div className="row mt-4">
        <div className="col-md-3">
          <input
            type="text"
            placeholder="Rechercher par nom..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control mb-2"
          />
        </div>
        <div className="col-md-3">
          <input
            type="number"
            placeholder="Prix min (FCFA)"
            value={filters.priceMin}
            onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
            className="form-control mb-2"
          />
        </div>
        <div className="col-md-3">
          <input
            type="number"
            placeholder="Prix max (FCFA)"
            value={filters.priceMax}
            onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
            className="form-control mb-2"
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            placeholder="Mots-clés"
            value={filters.keywords}
            onChange={(e) => setFilters({ ...filters, keywords: e.target.value })}
            className="form-control mb-2"
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-control mb-2"
            value={filters.operator}
            onChange={(e) => setFilters({ ...filters, operator: e.target.value })}
          >
            <option value="OR">Mot-clé: Correspondance OR</option>
            <option value="AND">Mot-clé: Correspondance AND</option>
          </select>
        </div>
        <div className="col-md-1">
          <button className="btn btn-primary" onClick={handleSearch}>🔍</button>
        </div>
      </div>

      {/* ✅ Liste des véhicules */}
      <div className="row mt-4">
        {vehicles.length > 0 ? (
          vehicles.map((vehicle) => (
            <div key={vehicle.id} className="col-md-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{vehicle.name}</h5>
                  <p className="card-text">Prix : {vehicle.price} FCFA</p>
                  <Link to={`/vehicle/${vehicle.id}`} className="btn btn-primary">
                    Voir Détails
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Aucun véhicule disponible.</p>
        )}
      </div>
    </div>
  );
};

export default CatalogPage;
