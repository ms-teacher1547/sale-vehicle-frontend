import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBox, FaArrowRight, FaArrowLeft, FaSearch, FaFilter } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8081/api/orders";

const OrderStatusBadge = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case "EN_ATTENTE":
        return {
          bg: "var(--warning-light)",
          text: "var(--warning)"
        };
      case "EN_COURS":
        return {
          bg: "var(--info-light)",
          text: "var(--info)"
        };
      case "LIVREE":
        return {
          bg: "var(--success-light)",
          text: "var(--success)"
        };
      case "ANNULEE":
        return {
          bg: "var(--error-light)",
          text: "var(--error)"
        };
      default:
        return {
          bg: "var(--surface-variant)",
          text: "var(--text-secondary)"
        };
    }
  };

  const colors = getStatusColor();

  return (
    <span style={{
      backgroundColor: colors.bg,
      color: colors.text,
      padding: "0.15rem 0.75rem",
      borderRadius: "16px",
      fontSize: "0.875rem",
      fontWeight: "500"
    }}>
      {status}
    </span>
  );
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("TOUS");
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/`, { withCredentials: true });
      setOrders(response.data);
      setError("");
    } catch (err) {
      setError("Une erreur est survenue lors du chargement des commandes");
    } finally {
      setLoading(false);
    }
  };

  const changeOrderStatus = async (orderId, action) => {
    try {
      await axios.put(`${API_URL}/${orderId}/${action}`, {}, { withCredentials: true });
      fetchOrders();
    } catch (err) {
      setError("Impossible de modifier le statut de la commande");
    }
  };

  const filteredOrders = orders
    .filter(order => {
      const matchesSearch = order.id.toString().includes(searchTerm) ||
        order.totalPrice.toString().includes(searchTerm);
      const matchesStatus = statusFilter === "TOUS" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.dateDeCommande) - new Date(a.dateDeCommande));

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

  return (
    <div style={{
      padding: "2rem",
      maxWidth: "1200px",
      margin: "0 auto"
    }}>
      <div style={{
        marginBottom: "2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <h1 style={{
          fontSize: "2rem",
          fontWeight: "bold",
          color: "var(--text-primary)",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem"
        }}>
          <FaBox /> Gestion des Commandes
        </h1>
      </div>

      {error && (
        <div style={{
          backgroundColor: "var(--error-light)",
          color: "var(--error)",
          padding: "1rem",
          borderRadius: "8px",
          marginBottom: "1rem"
        }}>
          {error}
        </div>
      )}

      <div style={{
        display: "flex",
        gap: "1rem",
        marginBottom: "2rem"
      }}>
        <div style={{
          flex: 1,
          position: "relative"
        }}>
          <FaSearch style={{
            position: "absolute",
            left: "1rem",
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--text-secondary)"
          }} />
          <input
            type="text"
            placeholder="Rechercher une commande..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem",
              paddingLeft: "2.5rem",
              borderRadius: "8px",
              border: "2px solid var(--border)",
              backgroundColor: "var(--background)",
              color: "var(--text-primary)"
            }}
          />
        </div>

        <div style={{
          position: "relative"
        }}>
          <FaFilter style={{
            position: "absolute",
            left: "1rem",
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--text-secondary)"
          }} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: "0.75rem",
              paddingLeft: "2.5rem",
              borderRadius: "8px",
              border: "2px solid var(--border)",
              backgroundColor: "var(--background)",
              color: "var(--text-primary)",
              cursor: "pointer"
            }}
          >
            <option value="TOUS">Tous les statuts</option>
            <option value="EN_ATTENTE">En attente</option>
            <option value="EN_COURS">En cours</option>
            <option value="LIVREE">Livrée</option>
            <option value="ANNULEE">Annulée</option>
          </select>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "2rem",
          color: "var(--text-secondary)"
        }}>
          Aucune commande trouvée
        </div>
      ) : (
        <div style={{
          display: "grid",
          gap: "1rem"
        }}>
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              style={{
                backgroundColor: "var(--surface)",
                borderRadius: "12px",
                padding: "1.5rem",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
              }}
            >
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem"
              }}>
                <div>
                  <h3 style={{
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                    color: "var(--text-primary)",
                    marginBottom: "0.5rem"
                  }}>
                    Commande #{order.id}
                  </h3>
                  <p style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.875rem"
                  }}>
                    {new Date(order.dateDeCommande).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>

              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: "1rem",
                borderTop: "1px solid var(--border)"
              }}>
                <p style={{
                  fontSize: "1.125rem",
                  fontWeight: "bold",
                  color: "var(--text-primary)"
                }}>
                  Total: {order.totalPrice.toLocaleString()} FCFA
                </p>

                <div style={{
                  display: "flex",
                  gap: "0.5rem"
                }}>
                  <button
                    onClick={() => changeOrderStatus(order.id, "previous")}
                    disabled={order.status === "EN_ATTENTE"}
                    style={{
                      padding: "0.5rem 1rem",
                      borderRadius: "8px",
                      border: "none",
                      backgroundColor: "var(--background)",
                      color: order.status === "EN_ATTENTE" ? "var(--text-disabled)" : "var(--text-primary)",
                      cursor: order.status === "EN_ATTENTE" ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem"
                    }}
                  >
                    <FaArrowLeft /> Reculer
                  </button>

                  <button
                    onClick={() => changeOrderStatus(order.id, "next")}
                    disabled={order.status === "LIVREE" || order.status === "ANNULEE"}
                    style={{
                      padding: "0.5rem 1rem",
                      borderRadius: "8px",
                      border: "none",
                      backgroundColor: "var(--primary-main)",
                      color: "white",
                      cursor: order.status === "LIVREE" || order.status === "ANNULEE" ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      opacity: order.status === "LIVREE" || order.status === "ANNULEE" ? 0.5 : 1
                    }}
                  >
                    Avancer <FaArrowRight />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
