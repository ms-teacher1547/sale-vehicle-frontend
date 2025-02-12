import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import '../styles/SubsidiaryManagement.css'; // Ajoutez votre CSS ici

const API_URL = "http://localhost:8081/api/customers";

const SubsidiaryManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { customerId } = useParams(); // Récupérer l'ID du client depuis l'URL

  const [subsidiaries, setSubsidiaries] = useState([]);
  const [newSubsidiary, setNewSubsidiary] = useState({ name: "", email: "", address: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // // Logs de débogage
  // console.log("🔍 SubsidiaryManagement - User Object:", user);
  // console.log("🔍 SubsidiaryManagement - Customer Details:", user?.customer);
  // console.log("🔍 SubsidiaryManagement - Customer Type:", user?.customer?.type);
  // console.log("🔍 SubsidiaryManagement - Customer ID from URL:", customerId);

  const fetchSubsidiaries = useCallback(async () => {
    // console.log("🔍 Début de fetchSubsidiaries");
    // console.log("🔍 Détails utilisateur complets :", JSON.stringify(user, null, 2));
    // console.log("🔍 ID du client depuis l'URL :", customerId);

    // Vérification plus flexible pour l'accès, en tenant compte du rôle admin
    if (!user) {
      console.error("❌ Aucun utilisateur connecté");
      setError("Utilisateur non authentifié");
      return;
    }

    if (!user.customer && user.role !== "ADMIN") {
      console.error("❌ Accès non autorisé - Ni client, ni admin");
      setError("Vous n'avez pas les permissions nécessaires");
      return;
    }

    try {
      // Pour les admins, utiliser l'ID du client de l'URL
      const targetCustomerId = customerId || (user.customer ? user.customer.id : null);
      
      console.log("🔍 ID du client cible :", targetCustomerId);
      
      if (!targetCustomerId) {
        console.error("❌ Aucun ID de client disponible");
        setError("Impossible de récupérer les filiales - ID client manquant");
        return;
      }

      console.log(`🔍 Tentative de récupération des filiales pour l'ID : ${targetCustomerId}`);
      
      const response = await axios.get(`${API_URL}/${targetCustomerId}/subsidiaries`, { 
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });

      console.log("🔍 Réponse de l'API :", JSON.stringify(response.data, null, 2));
      
      setSubsidiaries(response.data);
      setError("");
    } catch (error) {
      console.error("❌ Erreur détaillée lors du chargement des filiales :", error);
      console.error("❌ Détails de l'erreur :", JSON.stringify(error.response?.data || error.message, null, 2));
      
      setError(error.response?.data?.message || "Impossible de charger les filiales");
    } finally {
      setLoading(false);
    }
  }, [user, customerId]);

  useEffect(() => {
    // Vérification plus flexible pour l'accès à la page, en tenant compte du rôle admin
    if (!user || (!user.customer && user.role !== "ADMIN")) {
      console.log("❌ Redirecting from SubsidiaryManagement due to insufficient permissions");
      navigate("/profile");
      return;
    }
    fetchSubsidiaries();
  }, [user, navigate, fetchSubsidiaries]);

  const addSubsidiary = async () => {
    if (!newSubsidiary.name || !newSubsidiary.email || !newSubsidiary.address) {
      setError("⚠️ Veuillez remplir tous les champs.");
      return;
    }

    try {
      // Pour les admins, utiliser l'ID du client de l'URL
      const targetCustomerId = customerId || (user.customer ? user.customer.id : null);
      
      if (!targetCustomerId) {
        console.error("❌ Aucun ID de client disponible");
        setError("Impossible d'ajouter une filiale");
        return;
      }

      const response = await axios.post(
        `${API_URL}/${targetCustomerId}/subsidiaries`,
        newSubsidiary,
        { withCredentials: true }
      );

      setSubsidiaries([...subsidiaries, response.data]);
      setNewSubsidiary({ name: "", email: "", address: "" });
      setError("");
    } catch (error) {
      console.error("❌ Erreur lors de l'ajout :", error);
      setError("Impossible d'ajouter cette filiale.");
    }
  };

  const deleteSubsidiary = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette filiale ?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
      setSubsidiaries(subsidiaries.filter(subsidiary => subsidiary.id !== id));
    } catch (error) {
      console.error("❌ Erreur lors de la suppression :", error);
      setError("Impossible de supprimer cette filiale.");
    }
  };

  if (loading) return <p>Chargement des filiales...</p>;

  return (
    <div className="subsidiary-management-container">
      <h2>Gestion des Filiales 🏢</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="add-subsidiary-form mb-4">
        <h4>Ajouter une nouvelle filiale</h4>
        <input 
          type="text" 
          placeholder="Nom de la filiale" 
          value={newSubsidiary.name} 
          onChange={(e) => setNewSubsidiary({ ...newSubsidiary, name: e.target.value })} 
          className="form-control mb-2" 
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={newSubsidiary.email} 
          onChange={(e) => setNewSubsidiary({ ...newSubsidiary, email: e.target.value })} 
          className="form-control mb-2" 
        />
        <input 
          type="text" 
          placeholder="Adresse" 
          value={newSubsidiary.address} 
          onChange={(e) => setNewSubsidiary({ ...newSubsidiary, address: e.target.value })} 
          className="form-control mb-2" 
        />
        <button className="btn btn-success mt-2" onClick={addSubsidiary}>➕ Ajouter</button>
      </div>

      <h4>Filiales existantes</h4>
      {subsidiaries.length === 0 ? (
        <p>Aucune filiale enregistrée.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Adresse</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subsidiaries.map(subsidiary => (
              <tr key={subsidiary.id}>
                <td>{subsidiary.name}</td>
                <td>{subsidiary.email}</td>
                <td>{subsidiary.address}</td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteSubsidiary(subsidiary.id)}>❌ Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button className="btn btn-secondary mt-3" onClick={() => navigate("/profile")}>🔙 Retour au Profil</button>
    </div>
  );
};

export default SubsidiaryManagement;