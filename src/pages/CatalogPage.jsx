import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/CatalogPage.css";
import Navbar from "../components/Navbar"; 
import { FaTh, FaListUl } from "react-icons/fa"; 

const API_URL = "http://localhost:8081/api/catalog/vehicles/search";

const CatalogPage = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    priceMin: "",
    priceMax: "",
    keywords: "",
    operator: "OR",
  });
  const [viewMode, setViewMode] = useState("grid");
  const navigate = useNavigate();

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
    <div className="catalog-container">
      <Navbar />
      <div className="header">
        <h2>Catalogue des Véhicules 🚗</h2>
      </div>

      <div className="search-filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Rechercher par nom..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <input
            type="number"
            placeholder="Prix min"
            value={filters.priceMin}
            onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
          />
          <input
            type="number"
            placeholder="Prix max"
            value={filters.priceMax}
            onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
          />
          <input
            type="text"
            placeholder="Mots-clés"
            value={filters.keywords}
            onChange={(e) => setFilters({ ...filters, keywords: e.target.value })}
          />
          <select
            value={filters.operator}
            onChange={(e) => setFilters({ ...filters, operator: e.target.value })}
          >
            <option value="OR">Mot-clé: Correspondance OR</option>
            <option value="AND">Mot-clé: Correspondance AND</option>
          </select>
          <button onClick={handleSearch}>🔍</button>
        </div>
      </div>

      <div className="view-mode">
        <button
          className={`view-button ${viewMode === "grid" ? "active" : ""}`}
          onClick={() => setViewMode("grid")}
        >
          <FaTh /> Grid
        </button>
        <button
          className={`view-button ${viewMode === "list" ? "active" : ""}`}
          onClick={() => setViewMode("list")}
        >
          <FaListUl /> Liste
        </button>
      </div>

      <div className="vehicles-list">
        {vehicles.length > 0 ? (
          <div className={viewMode === "grid" ? "vehicle-grid" : "vehicle-list"}>
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="vehicle-card">
                <img src={vehicle.image} alt={vehicle.name} className="vehicle-img" />
                <div className="vehicle-info">
                  <h3>{vehicle.name}</h3>
                  <p className="price">{vehicle.price} FCFA</p>
                  <Link to={`/vehicle/${vehicle.id}`} className="btn-details">Voir Détails</Link>
                  {user?.role === "USER" && (
                    <button onClick={() => navigate(`/choose-options/`)} className="btn-add-to-cart">Ajouter les options</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Aucun véhicule disponible.</p>
        )}
      </div>
    </div>
  );
};

export default CatalogPage;
