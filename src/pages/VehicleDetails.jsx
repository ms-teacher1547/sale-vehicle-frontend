import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaCar, FaGasPump, FaTachometerAlt, FaCalendarAlt, FaMoneyBillWave, FaArrowLeft, FaShoppingCart } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:8081/api/catalog/vehicles";

const VehicleDetails = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/${id}`);
        setVehicle(response.data);
        setLoading(false);
      } catch (err) {
        setError("Une erreur est survenue lors du chargement des détails du véhicule");
        setLoading(false);
      }
    };

    fetchVehicleDetails();
  }, [id]);

  const handleBuyClick = () => {
    navigate(`/choose-options/${id}`);
  };

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh"
      }}>
        <div style={{
          width: "40px",
          height: "40px",
          border: "4px solid var(--primary-light)",
          borderTop: "4px solid var(--primary-dark)",
          borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: "2rem",
        textAlign: "center",
        color: "var(--error)"
      }}>
        <p>{error}</p>
        <button
          onClick={() => navigate("/catalog")}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            backgroundColor: "var(--primary-main)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          <FaArrowLeft style={{ marginRight: "0.5rem" }} />
          Retour au catalogue
        </button>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div style={{
        padding: "2rem",
        textAlign: "center",
        color: "var(--error)"
      }}>
        <p>Véhicule non trouvé</p>
        <button
          onClick={() => navigate("/catalog")}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            backgroundColor: "var(--primary-main)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          <FaArrowLeft style={{ marginRight: "0.5rem" }} />
          Retour au catalogue
        </button>
      </div>
    );
  }

  return (
    <div style={{
      padding: "8rem",
      maxWidth: "1200px",
      margin: "0 auto"
    }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "2rem",
        backgroundColor: "var(--surface)",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
      }}>
        {/* Left Column - Images */}
        <div style={{
          padding: "2rem"
        }}>
          <div style={{
            position: "relative",
            borderRadius: "8px",
            overflow: "hidden",
            aspectRatio: "16/9",
            backgroundColor: "var(--background)"
          }}>
            {vehicle.imageUrl ? (
              <img
                src={vehicle.imageUrl}
                alt={vehicle.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }}
              />
            ) : (
              <div style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "var(--background)"
              }}>
                <FaCar size={64} color="var(--text-secondary)" />
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Details */}
        <div style={{
          padding: "2rem",
          display: "flex",
          flexDirection: "column"
        }}>
          <h1 style={{
            fontSize: "2rem",
            fontWeight: "bold",
            color: "var(--text-primary)",
            marginBottom: "1rem"
          }}>
            {vehicle.name}
          </h1>

          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.5rem",
            marginBottom: "2rem"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "var(--text-primary)"
            }}>
              <FaMoneyBillWave />
              <div>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>Prix</p>
                <p style={{ fontWeight: "bold" }}>{vehicle.price.toLocaleString()} FCFA</p>
              </div>
            </div>

            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "var(--text-primary)"
            }}>
              <FaCalendarAlt />
              <div>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>Année</p>
                <p style={{ fontWeight: "bold" }}>{vehicle.yearOfManufacture}</p>
              </div>
            </div>

            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "var(--text-primary)"
            }}>
              <FaGasPump />
              <div>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>Carburant</p>
                <p style={{ fontWeight: "bold" }}>
                  {vehicle.fuelType === "essence" ? "Essence" :
                   vehicle.fuelType === "diesel" ? "Diesel" :
                   vehicle.fuelType === "electric" ? "Électrique" : vehicle.fuelType}
                </p>
              </div>
            </div>

            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "var(--text-primary)"
            }}>
              <FaTachometerAlt />
              <div>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>Kilométrage</p>
                <p style={{ fontWeight: "bold" }}>{vehicle.mileage.toLocaleString()} km</p>
              </div>
            </div>
          </div>

          {/* Stock Status */}
          <div style={{
            marginBottom: "2rem",
            padding: "1rem",
            backgroundColor: vehicle.stockQuantity > 0 ? "var(--success-light)" : "var(--error-light)",
            borderRadius: "8px",
            color: vehicle.stockQuantity > 0 ? "var(--success)" : "var(--error)",
            textAlign: "center",
            fontWeight: "bold"
          }}>
            {vehicle.stockQuantity > 0 ? (
              <>👍 Disponible en stock ({vehicle.stockQuantity} unité{vehicle.stockQuantity > 1 ? 's' : ''})</>
            ) : (
              <>⚠️ Rupture de stock</>
            )}
          </div>

          {/* Actions */}
          <div style={{
            display: "flex",
            gap: "1rem",
            marginTop: "auto"
          }}>
            <button
              onClick={() => navigate("/catalog")}
              style={{
                flex: 1,
                padding: "0.75rem",
                backgroundColor: "var(--background)",
                color: "var(--text-primary)",
                border: "2px solid var(--border)",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: "bold",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem"
              }}
            >
              <FaArrowLeft />
              Retour
            </button>

            {user && vehicle.stockQuantity > 0 && (
              <button
                onClick={handleBuyClick}
                style={{
                  flex: 2,
                  padding: "0.75rem",
                  backgroundColor: "var(--primary-main)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem"
                }}
              >
                <FaShoppingCart />
                Commander
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;
