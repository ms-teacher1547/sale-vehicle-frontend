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
    <div className="profile-container">
      <h2 className="profile-title">Profil de {name}</h2>

      {message && (
        <div className={`alert alert-${messageType} mt-3`} role="alert">
          {message}
        </div>
      )}

      <div className="profile-info">
        <p><strong>Nom :</strong> {name}</p>
        <p><strong>Rôle :</strong> {user?.role}</p>

        {user?.customer ? (
          <>
            <p><strong>Email :</strong> {customer?.email || "Non renseigné"}</p>
            <p><strong>Adresse :</strong> {customer?.address || "Non renseignée"}</p>
            <p><strong>Type de client :</strong> {customer?.type}</p>

            {editMode ? (
              <div className="edit-form">
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="form-control mb-2" 
                />
                <input 
                  type="text" 
                  value={customer.email || ""} 
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })} 
                  className="form-control mb-2" 
                />
                <input 
                  type="text" 
                  value={customer.address || ""} 
                  onChange={(e) => setCustomer({ ...customer, address: e.target.value })} 
                  className="form-control mb-2" 
                />
                <div className="button-group">
                  <button className="btn-save" onClick={handleUpdateProfile}>💾 Sauvegarder</button>
                  <button className="btn-cancel" onClick={() => setEditMode(false)}>❌ Annuler</button>
                </div>
              </div>
            ) : (
              <div className="button-group">
                <button className="btn-edit" onClick={() => setEditMode(true)}>✏️ Modifier</button>
              </div>
            )}

            {customer?.type === "COMPANY" && (
              <button className="btn-manage" onClick={() => navigate("/subsidiaries")}>
                🏢 Gérer les filiales
              </button>
            )}
          </>
        ) : (
          <p>Pas d'informations client (vous êtes un ADMIN).</p>
        )}

        <div className="button-group">
          <button className="btn-logout" onClick={handleLogout}>Se déconnecter</button>
          <button className="btn-catalog" onClick={() => navigate("/catalog")}>🚗 Aller au Catalogue</button>
          {user.role === "ADMIN" && (
            <>
              <button className="btn-manage-customers" onClick={() => navigate("/admin/customers")}>📋 Gérer les Clients</button>
              <button className="btn-manage-options" onClick={() => navigate("/admin/options")}>⚙️ Gérer les options</button>
            </>
          )}
          {user.role === "USER" && (
            <button className="btn-orders" onClick={() => navigate("/my-orders")}>📦 Mes Commandes</button>
          )}
          {user.role === "ADMIN" && (
            <button className="btn-manage-orders" onClick={() => navigate("/admin/orders")}>📋 Gérer les commandes</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
