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
    <div style={{ 
        backgroundColor: 'var(--background)', 
        minHeight: '100vh',
        padding: '2rem'
      }}>
      <Navbar />
      
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
        }}>🚗 Catalogue des Véhicules</h2>
        <p style={{ 
          color: 'var(--accent)', 
          textAlign: 'center',
          fontSize: '1.1rem',
          marginBottom: '0'
        }}>Découvrez notre sélection de véhicules</p>
      </div>

      <div style={{
        backgroundColor: 'var(--surface)',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        marginBottom: '2rem'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center'
          }}>
            <input
              type="text"
              placeholder="🔍 Rechercher par nom..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1,
                padding: '1rem',
                borderRadius: '8px',
                border: '2px solid var(--border)',
                fontSize: '1rem',
                backgroundColor: 'var(--background)'
              }}
            />
            <button 
              onClick={handleSearch}
              style={{
                padding: '1rem 2rem',
                backgroundColor: 'var(--primary-main)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease'
              }}
            >
              Rechercher
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            <input
              type="number"
              placeholder="Prix minimum"
              value={filters.priceMin}
              onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
              style={{
                padding: '0.75rem',
                borderRadius: '8px',
                border: '2px solid var(--border)',
                backgroundColor: 'var(--background)'
              }}
            />
            <input
              type="number"
              placeholder="Prix maximum"
              value={filters.priceMax}
              onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
              style={{
                padding: '0.75rem',
                borderRadius: '8px',
                border: '2px solid var(--border)',
                backgroundColor: 'var(--background)'
              }}
            />
            <input
              type="text"
              placeholder="Mots-clés"
              value={filters.keywords}
              onChange={(e) => setFilters({ ...filters, keywords: e.target.value })}
              style={{
                padding: '0.75rem',
                borderRadius: '8px',
                border: '2px solid var(--border)',
                backgroundColor: 'var(--background)'
              }}
            />
            <select
              value={filters.operator}
              onChange={(e) => setFilters({ ...filters, operator: e.target.value })}
              style={{
                padding: '0.75rem',
                borderRadius: '8px',
                border: '2px solid var(--border)',
                backgroundColor: 'var(--background)',
                cursor: 'pointer'
              }}
            >
              <option value="OR">Correspondance OR</option>
              <option value="AND">Correspondance AND</option>
            </select>
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          justifyContent: 'center'
        }}>
          <button
            onClick={() => setViewMode("grid")}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: viewMode === "grid" ? 'var(--primary-dark)' : 'var(--surface)',
              color: viewMode === "grid" ? 'white' : 'var(--text-primary)',
              border: '2px solid var(--primary-dark)',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease'
            }}
          >
            <FaTh /> Grille
          </button>
          <button
            onClick={() => setViewMode("list")}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: viewMode === "list" ? 'var(--primary-dark)' : 'var(--surface)',
              color: viewMode === "list" ? 'white' : 'var(--text-primary)',
              border: '2px solid var(--primary-dark)',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease'
            }}
          >
            <FaListUl /> Liste
          </button>
        </div>

        {vehicles.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            backgroundColor: 'var(--background)',
            borderRadius: '12px',
            color: 'var(--text-secondary)'
          }}>
            <p style={{ fontSize: '1.2rem', margin: '0' }}>Aucun véhicule disponible.</p>
          </div>
        ) : (
          <div style={{
            display: viewMode === "grid" ? 'grid' : 'flex',
            gridTemplateColumns: viewMode === "grid" ? 'repeat(auto-fill, minmax(300px, 1fr))' : '1fr',
            gap: '2rem',
            flexDirection: viewMode === "grid" ? 'unset' : 'column'
          }}>
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} style={{
                backgroundColor: 'var(--surface)',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid var(--border)',
                transition: 'transform 0.3s ease',
                ':hover': {
                  transform: 'translateY(-5px)'
                }
              }}>
                <img 
                  src={vehicle.image} 
                  alt={vehicle.name} 
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover'
                  }}
                />
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{
                    color: 'var(--primary-dark)',
                    fontSize: '1.5rem',
                    marginBottom: '1rem'
                  }}>{vehicle.name}</h3>
                  <p style={{
                    color: 'var(--primary-main)',
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    marginBottom: '1.5rem'
                  }}>{vehicle.price.toLocaleString()} FCFA</p>
                  <div style={{
                    display: 'flex',
                    gap: '1rem',
                    flexDirection: viewMode === "grid" ? 'column' : 'row'
                  }}>
                    <Link 
                      to={`/vehicle/${vehicle.id}`}
                      style={{
                        padding: '0.75rem',
                        backgroundColor: 'var(--primary-dark)',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '8px',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        flex: 1
                      }}
                    >
                      Voir Détails
                    </Link>
                    {user?.role === "USER" && (
                      <button 
                        onClick={() => navigate(`/choose-options/`)}
                        style={{
                          padding: '0.75rem',
                          backgroundColor: 'var(--accent)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          flex: 1
                        }}
                      >
                        Configurer
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogPage;
