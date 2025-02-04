import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const API_URL = "http://localhost:8081/api/customers/";

const ProfilePage = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  // ✅ Déclaration des `useState` AVANT tout return conditionnel
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

  // ✅ Fonction de mise à jour du profil
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
        setCustomer(updatedCustomer); // ✅ Corrige l’erreur `setCustomer` non défini
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
    <div className="container mt-5">
      <h2>Profil de {name}</h2>

      {message && (
        <div className={`alert alert-${messageType} mt-3`} role="alert">
          {message}
        </div>
      )}

      <p><strong>Nom :</strong> {name}</p>
      <p><strong>Rôle :</strong> {user?.role}</p>

      {user?.customer ? (
        <>
          <p><strong>Email :</strong> {customer?.email || "Non renseigné"}</p>
          <p><strong>Adresse :</strong> {customer?.address || "Non renseignée"}</p>
          <p><strong>Type de client :</strong> {customer?.type}</p>

          {editMode ? (
            <div>
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
              <button className="btn btn-success me-2" onClick={handleUpdateProfile}>💾 Sauvegarder</button>
              <button className="btn btn-secondary" onClick={() => setEditMode(false)}>❌ Annuler</button>
            </div>
          ) : (
            <button className="btn btn-warning mt-2" onClick={() => setEditMode(true)}>✏️ Modifier</button>
          )}

          {customer?.type === "COMPANY" && (
            <button className="btn btn-info mt-3 ms-2" onClick={() => navigate("/subsidiaries")}>
              🏢 Gérer les filiales
            </button>
          )}
        </>
      ) : (
        <p>Pas d'informations client (vous êtes un ADMIN).</p>
      )}

      <button className="btn btn-danger mt-3 me-2" onClick={handleLogout}>
        Se déconnecter
      </button>

      <button className="btn btn-primary mt-3" onClick={() => navigate("/catalog")}>
        🚗 Aller au Catalogue
      </button>
      {user.role === "ADMIN" && (
        <button className="btn btn-dark mt-3" onClick={() => navigate("/admin/customers")}>
          📋 Gérer les Clients
        </button>
      )}
      {user.role === "ADMIN" && (
        <button 
          className="btn btn-info mt-3 ms-2" 
          onClick={() => navigate("/admin/options")}
        >
          ⚙️ Gérer les options
        </button>
      )}

     

      {user.role === "USER" && (
        <button className="btn btn-primary mt-3" onClick={() => navigate("/my-orders")}>
          📦 Mes Commandes
        </button>
      )}

      {user.role === "ADMIN" && (
        <button className="btn btn-dark mt-3" onClick={() => navigate("/admin/orders")}>📋 Gérer les commandes</button>
      )}

    </div>
  );
};

export default ProfilePage;
