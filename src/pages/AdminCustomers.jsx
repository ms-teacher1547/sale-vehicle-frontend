import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/AdminCustomers.css"; // Assurez-vous d'importer le CSS

const API_URL = "http://localhost:8081/api/customers/";

const AdminCustomers = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterType, setFilterType] = useState("ALL"); // 🔹 Filtrage par type

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      navigate("/"); // 🔙 Redirection si pas ADMIN
    } else {
      fetchCustomers();
    }
  }, [user, navigate]);

  // 🔹 Récupérer tous les clients
  const fetchCustomers = async () => {
    try {
      const response = await axios.get(API_URL, { withCredentials: true });
      setCustomers(response.data);
      setLoading(false);
    } catch (error) {
      console.error("❌ Erreur lors du chargement des clients :", error);
      setError("Impossible de charger les clients.");
      setLoading(false);
    }
  };

  // 🔹 Supprimer un client
  const deleteCustomer = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce client ?")) return;

    try {
      await axios.delete(`${API_URL}${id}`, { withCredentials: true });
      setCustomers(customers.filter(customer => customer.id !== id));
    } catch (error) {
      console.error("❌ Erreur lors de la suppression :", error);
      setError("Impossible de supprimer ce client.");
    }
  };

  if (loading) return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: 'var(--background)'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div className="spinner-border" role="status" style={{ color: 'var(--primary-main)' }} />
        <span style={{ color: 'var(--text-primary)' }}>Chargement des clients...</span>
      </div>
    </div>
  );

  return (
    <div style={{ 
      backgroundColor: 'var(--background)', 
      minHeight: '100vh',
      padding: '4rem'
    }}>
      <div style={{ 
        backgroundColor: 'var(--primary-dark)', 
        padding: '3rem 1rem', 
        marginBottom: '2rem',
        borderRadius: '0 0 20px 20px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ 
          color: 'var(--surface)', 
          marginBottom: '0', 
          textAlign: 'center', 
          fontSize: '2.5rem',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: '2px'
        }}>👥 Gestion des Clients</h2>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gap: '2rem'
      }}>
        {error && (
          <div style={{
            backgroundColor: 'var(--error)',
            color: 'white',
            padding: '1rem',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* Filter Section */}
        <div style={{
          backgroundColor: 'var(--surface)',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ 
              display: 'block',
              marginBottom: '0.5rem',
              color: 'var(--primary-dark)',
              fontWeight: 'bold'
            }}>
              Filtrer par type :
            </label>
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '2px solid var(--border)',
                backgroundColor: 'var(--background)',
                color: 'var(--text-primary)'
              }}
            >
              <option value="ALL">Tous les clients</option>
              <option value="INDIVIDUAL">Particuliers</option>
              <option value="COMPANY">Entreprises</option>
              <option value="SUBSIDIARY">Filiales</option>
            </select>
          </div>
        </div>

        {/* Customers List */}
        <div style={{
          backgroundColor: 'var(--surface)',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          overflowX: 'auto'
        }}>
          <h3 style={{ 
            color: 'var(--primary-dark)',
            marginBottom: '1.5rem',
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}>Clients enregistrés</h3>

          {customers.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              color: 'var(--text-secondary)'
            }}>
              Aucun client enregistré.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Nom</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Email</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Adresse</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Type</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers
                  .filter(customer => filterType === "ALL" || customer.type === filterType)
                  .map(customer => (
                    <tr 
                      key={customer.id}
                      style={{ 
                        borderBottom: '1px solid var(--border)',
                        backgroundColor: 'var(--background)'
                      }}
                    >
                      <td style={{ padding: '1rem' }}>{customer.name}</td>
                      <td style={{ padding: '1rem' }}>{customer.email}</td>
                      <td style={{ padding: '1rem' }}>{customer.address}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ 
                          backgroundColor: 
                            customer.type === 'COMPANY' ? 'var(--primary-main)' :
                            customer.type === 'INDIVIDUAL' ? 'var(--accent)' :
                            'var(--primary-light)',
                          color: 'white',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '12px',
                          fontSize: '0.9rem'
                        }}>
                          {customer.type}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button 
                            onClick={() => deleteCustomer(customer.id)}
                            style={{
                              backgroundColor: 'var(--error)',
                              color: 'white',
                              border: 'none',
                              padding: '0.5rem 1rem',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              fontSize: '0.9rem'
                            }}
                          >
                            ❌ Supprimer
                          </button>
                          {customer.type === "COMPANY" && (
                            <button 
                              onClick={() => navigate(`${customer.id}/subsidiaries`)}
                              style={{
                                backgroundColor: 'var(--primary-light)',
                                color: 'white',
                                border: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontSize: '0.9rem'
                              }}
                            >
                              🏢 Voir Filiales
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Back Button */}
        <button 
          onClick={() => navigate("/profile")}
          style={{
            backgroundColor: 'var(--primary-light)',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            width: 'fit-content'
          }}
        >
          🔙 Retour au Profil
        </button>
      </div>
    </div>
  );
};

export default AdminCustomers;
