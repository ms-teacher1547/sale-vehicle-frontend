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

  if (loading) return <div className="spinner">Chargement des clients...</div>;

  return (
    <div className="admin-customers">
      <h2>Gestion des Clients 👥</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* ✅ Filtrage par type de client */}
      <div className="filter-section mb-4">
        <label className="form-label">Filtrer par type :</label>
        <select className="form-control" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="ALL">Tous</option>
          <option value="INDIVIDUAL">INDIVIDUAL</option>
          <option value="COMPANY">COMPANY</option>
          <option value="SUBSIDIARY">FILIALE</option>
        </select>
      </div>

      {/* ✅ Liste des clients */}
      <h4>Clients enregistrés</h4>
      {customers.length === 0 ? (
        <p>Aucun client enregistré.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Adresse</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers
              .filter(customer => filterType === "ALL" || customer.type === filterType)
              .map(customer => (
                <tr key={customer.id}>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.address}</td>
                  <td>{customer.type}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteCustomer(customer.id)}>
                      ❌ Supprimer
                    </button>
                    {customer.type === "COMPANY" && (
                      <button className="btn btn-info btn-sm ms-2" onClick={() => navigate(`subsidiaries/${customer.id}`)}>
                        🏢 Voir Filiales
                      </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}

      {/* 🔙 Bouton retour */}
      <button className="btn btn-secondary mt-3" onClick={() => navigate("/profile")}>🔙 Retour au Profil</button>
    </div>
  );
};

export default AdminCustomers;
