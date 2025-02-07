import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import '../styles/ProfilPage.css'; // Importation du CSS spécifique à la page

const API_URL = "http://localhost:8081/api/customers/";

const ProfilePage = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.role === "ADMIN";
  const [customer, setCustomer] = useState(user?.customer || {});
  const [name, setName] = useState(isAdmin ? user?.fullname : customer?.name || "Nom non disponible");
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  if (loading) return <p>Chargement...</p>;
  if (!user) return <Navigate to="/login" />;

  const handleLogout = async () => {
    await logout();
  };

  const handleUpdateProfile = () => {
    if (isAdmin) {
      setMessage("⚠️ Les administrateurs ne peuvent pas modifier leur nom.");
      setMessageType("warning");
      setTimeout(() => setMessage(""), 4000);
      return;
    }

    const updatedCustomer = { ...customer, name };

    axios.put(`${API_URL}${customer.id}`, updatedCustomer, { withCredentials: true })
      .then(() => {
        setCustomer(updatedCustomer);
        setEditMode(false);
        setMessage("✅ Vos informations ont été mises à jour avec succès !");
        setMessageType("success");
        setTimeout(() => setMessage(""), 4000);
      })
      .catch(error => {
        console.error("❌ Erreur mise à jour :", error);
        setMessage("⚠️ Une erreur est survenue lors de la mise à jour.");
        setMessageType("danger");
      });
  };

  return (
    <div style={{ 
        backgroundColor: 'var(--background)', 
        minHeight: '100vh',
        padding: '2rem'
      }}>
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
        }}>👤 Mon Profil</h2>
        <p style={{ 
          color: 'var(--accent)', 
          textAlign: 'center',
          fontSize: '1.1rem',
          marginBottom: '0'
        }}>{name}</p>
      </div>

      {message && (
        <div style={{
          backgroundColor: messageType === 'success' ? 'var(--success)' : 
                         messageType === 'warning' ? 'var(--warning)' : 'var(--error)',
          color: 'white',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          {message}
        </div>
      )}

      <div style={{
        backgroundColor: 'var(--surface)',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'grid',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem'
          }}>
            <div style={{
              backgroundColor: 'var(--background)',
              padding: '1rem',
              borderRadius: '8px'
            }}>
              <p style={{ margin: '0' }}>
                <strong style={{ color: 'var(--primary-dark)' }}>Rôle:</strong>
                <span style={{ 
                  backgroundColor: user?.role === 'ADMIN' ? 'var(--primary-main)' : 'var(--accent)',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  marginLeft: '0.5rem',
                  fontSize: '0.9rem'
                }}>{user?.role}</span>
              </p>
            </div>

            {user?.customer && (
              <>
                <div style={{
                  backgroundColor: 'var(--background)',
                  padding: '1rem',
                  borderRadius: '8px'
                }}>
                  <p style={{ margin: '0' }}>
                    <strong style={{ color: 'var(--primary-dark)' }}>Email:</strong>
                    <span style={{ marginLeft: '0.5rem' }}>{customer?.email || "Non renseigné"}</span>
                  </p>
                </div>

                <div style={{
                  backgroundColor: 'var(--background)',
                  padding: '1rem',
                  borderRadius: '8px'
                }}>
                  <p style={{ margin: '0' }}>
                    <strong style={{ color: 'var(--primary-dark)' }}>Adresse:</strong>
                    <span style={{ marginLeft: '0.5rem' }}>{customer?.address || "Non renseignée"}</span>
                  </p>
                </div>

                <div style={{
                  backgroundColor: 'var(--background)',
                  padding: '1rem',
                  borderRadius: '8px'
                }}>
                  <p style={{ margin: '0' }}>
                    <strong style={{ color: 'var(--primary-dark)' }}>Type:</strong>
                    <span style={{ 
                      backgroundColor: 'var(--primary-light)',
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      marginLeft: '0.5rem',
                      fontSize: '0.9rem'
                    }}>{customer?.type}</span>
                  </p>
                </div>
              </>
            )}
          </div>

          {user?.customer && editMode ? (
            <div style={{
              display: 'grid',
              gap: '1rem',
              backgroundColor: 'var(--background)',
              padding: '1.5rem',
              borderRadius: '12px'
            }}>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                style={{
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '2px solid var(--border)',
                  width: '100%'
                }}
                placeholder="Votre nom"
              />
              <input 
                type="email" 
                value={customer.email || ""} 
                onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                style={{
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '2px solid var(--border)',
                  width: '100%'
                }}
                placeholder="Votre email"
              />
              <input 
                type="text" 
                value={customer.address || ""} 
                onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                style={{
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '2px solid var(--border)',
                  width: '100%'
                }}
                placeholder="Votre adresse"
              />
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  onClick={handleUpdateProfile}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    backgroundColor: 'var(--success)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >💾 Sauvegarder</button>
                <button 
                  onClick={() => setEditMode(false)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    backgroundColor: 'var(--error)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >❌ Annuler</button>
              </div>
            </div>
          ) : user?.customer && (
            <button 
              onClick={() => setEditMode(true)}
              style={{
                padding: '0.75rem',
                backgroundColor: 'var(--primary-main)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                width: 'fit-content'
              }}
            >✏️ Modifier mon profil</button>
          )}

          {customer?.type === "COMPANY" && (
            <button 
              onClick={() => navigate("/subsidiaries")}
              style={{
                padding: '0.75rem',
                backgroundColor: 'var(--primary-light)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >🏢 Gérer les filiales</button>
          )}
        </div>

        <div style={{
          display: 'grid',
          gap: '1rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          marginTop: '2rem',
          borderTop: '2px solid var(--border)',
          paddingTop: '2rem'
        }}>
          <button 
            onClick={() => navigate("/catalog")}
            style={{
              padding: '1rem',
              backgroundColor: 'var(--primary-dark)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >🚗 Catalogue</button>

          {user.role === "USER" && (
            <button 
              onClick={() => navigate("/my-orders")}
              style={{
                padding: '1rem',
                backgroundColor: 'var(--accent)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >📦 Mes Commandes</button>
          )}

          {user.role === "ADMIN" && (
            <>
              <button 
                onClick={() => navigate("/admin/customers")}
                style={{
                  padding: '1rem',
                  backgroundColor: 'var(--primary-main)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >👥 Gérer les Clients</button>

              <button 
                onClick={() => navigate("/admin/options")}
                style={{
                  padding: '1rem',
                  backgroundColor: 'var(--primary-main)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >⚙️ Gérer les Options</button>

              <button 
                onClick={() => navigate("/admin/orders")}
                style={{
                  padding: '1rem',
                  backgroundColor: 'var(--primary-main)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >📋 Gérer les Commandes</button>
            </>
          )}

          <button 
            onClick={handleLogout}
            style={{
              padding: '1rem',
              backgroundColor: 'var(--error)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >🚪 Se déconnecter</button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
