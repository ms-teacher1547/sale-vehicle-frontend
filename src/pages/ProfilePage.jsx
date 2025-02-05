import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { FaSignOutAlt, FaEdit, FaSave, FaTimes, FaCar, FaUsers, FaCog, FaBoxOpen, FaEnvelope, FaMapMarkerAlt, FaUserAlt } from "react-icons/fa";
import "../styles/ProfilPage.css";

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
      .catch(() => {
        setMessage("⚠️ Une erreur est survenue lors de la mise à jour.");
        setMessageType("danger");
      });
  };

  return (
    <div className="profile-container">
      <h2>Profil de {name}</h2>

      {message && (
        <div className={`alert alert-${messageType} mt-3`} role="alert">
          {message}
        </div>
      )}

      <div className="profile-card">
        <div className="profile-header">
          <FaUserAlt className="profile-icon" />
          <h3>{name}</h3>
        </div>
        <p><strong>Rôle :</strong> {user?.role}</p>
        {user?.customer && (
          <>
            <div className="profile-info">
              <FaEnvelope /> <span>{customer?.email || "Non renseigné"}</span>
            </div>
            <div className="profile-info">
              <FaMapMarkerAlt /> <span>{customer?.address || "Non renseignée"}</span>
            </div>
            <div className="profile-info">
              <strong>Type de client :</strong> {customer?.type}
            </div>

            {editMode ? (
              <div className="edit-mode">
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-control" />
                <input type="text" value={customer.email || ""} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} className="form-control" />
                <input type="text" value={customer.address || ""} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} className="form-control" />
                <div className="action-buttons">
                  <button className="btn btn-success" onClick={handleUpdateProfile}><FaSave /> Sauvegarder</button>
                  <button className="btn btn-secondary" onClick={() => setEditMode(false)}><FaTimes /> Annuler</button>
                </div>
              </div>
            ) : (
              <button className="btn btn-warning" onClick={() => setEditMode(true)}><FaEdit /> Modifier</button>
            )}
          </>
        )}
      </div>

      <div className="profile-actions">
        <button className="btn btn-danger" onClick={handleLogout}>
          <FaSignOutAlt /> Se déconnecter
        </button>

        <button className="btn btn-primary" onClick={() => navigate("/catalog")}>
          <FaCar /> Aller au Catalogue
        </button>

        {user.role === "ADMIN" && (
          <>
            <button className="btn btn-dark" onClick={() => navigate("/admin/customers")}><FaUsers /> Gérer les Clients</button>
            <button className="btn btn-info" onClick={() => navigate("/admin/options")}><FaCog /> Gérer les options</button>
            <button className="btn btn-dark" onClick={() => navigate("/admin/orders")}><FaBoxOpen /> Gérer les commandes</button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
