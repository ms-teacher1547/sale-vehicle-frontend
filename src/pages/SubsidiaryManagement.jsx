import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:8081/api/customers";

const SubsidiaryManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // ✅ Déclaration correcte des états
  const [subsidiaries, setSubsidiaries] = useState([]); // Liste des filiales
  const [newSubsidiary, setNewSubsidiary] = useState({ name: "", email: "", address: "" }); // Formulaire d'ajout
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); // Gestion des erreurs

  // ✅ Fonction pour récupérer les filiales (corrigée avec useCallback)
  const fetchSubsidiaries = useCallback(async () => {
    if (!user || !user.customer || user.customer.type !== "COMPANY") {
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/${user.customer.id}/subsidiaries`, { withCredentials: true });
      setSubsidiaries(response.data);
      setError(""); // ✅ Réinitialise les erreurs après succès
    } catch (error) {
      console.error("❌ Erreur lors du chargement des filiales :", error);
      setError("Impossible de charger les filiales.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user || !user.customer || user.customer.type !== "COMPANY") {
      navigate("/profile"); // 🔙 Redirige si l'utilisateur n'est pas une entreprise
      return;
    }
    fetchSubsidiaries();
  }, [user, navigate, fetchSubsidiaries]);

  // ✅ Fonction pour ajouter une filiale
  const addSubsidiary = async () => {
    if (!newSubsidiary.name || !newSubsidiary.email || !newSubsidiary.address) {
      setError("⚠️ Veuillez remplir tous les champs.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/${user.customer.id}/subsidiaries`,
        newSubsidiary,
        { withCredentials: true }
      );

      setSubsidiaries([...subsidiaries, response.data]); // ✅ Mise à jour de la liste
      setNewSubsidiary({ name: "", email: "", address: "" }); // Réinitialisation du formulaire
      setError(""); // Réinitialisation des erreurs
    } catch (error) {
      console.error("❌ Erreur lors de l'ajout :", error);
      setError("Impossible d'ajouter cette filiale.");
    }
  };

  // ✅ Fonction pour supprimer une filiale
  const deleteSubsidiary = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette filiale ?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
      setSubsidiaries(subsidiaries.filter(subsidiary => subsidiary.id !== id)); // Mise à jour
    } catch (error) {
      console.error("❌ Erreur lors de la suppression :", error);
      setError("Impossible de supprimer cette filiale.");
    }
  };

  if (loading) return <p>Chargement des filiales...</p>;

  return (
    <div className="container mt-5">
      <h2>Gestion des Filiales 🏢</h2>

      {/* ✅ Affichage des erreurs */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* ✅ Formulaire d'ajout d'une filiale */}
      <div className="mb-4">
        <h4>Ajouter une nouvelle filiale</h4>
        <input 
          type="text" 
          placeholder="Nom" 
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

      {/* ✅ Liste des filiales */}
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

      {/* 🔙 Bouton retour */}
      <button className="btn btn-secondary mt-3" onClick={() => navigate("/profile")}>🔙 Retour au Profil</button>
    </div>
  );
};

export default SubsidiaryManagement;
