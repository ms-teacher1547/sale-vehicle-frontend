import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/AdminOptions.css"; // Fichier CSS personnalisé pour un style plus moderne

const API_URL = "http://localhost:8081/api/options";

const AdminOptions = () => {
  const [options, setOptions] = useState([]);
  const [newOption, setNewOption] = useState({ name: "", price: "", category: "PERFORMANCE" });
  const [incompatibility, setIncompatibility] = useState({ optionId1: "", optionId2: "" });
  const [incompatibleOptions, setIncompatibleOptions] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchOptions();
    fetchIncompatibleOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const response = await axios.get(`${API_URL}/`);
      setOptions(response.data);
    } catch (error) {
      console.error("❌ Erreur lors du chargement des options :", error);
      setError("Impossible de charger les options.");
    }
  };

  const fetchIncompatibleOptions = async () => {
    try {
      const response = await axios.get(`${API_URL}/incompatible`);
      setIncompatibleOptions(response.data);
    } catch (error) {
      console.error("❌ Erreur lors du chargement des incompatibilités :", error);
      setError("Impossible de charger les incompatibilités.");
    }
  };

  const addOption = async () => {
    if (!newOption.name || !newOption.price || !newOption.category) {
      setError("⚠️ Veuillez remplir tous les champs.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/`, newOption, { withCredentials: true });
      setOptions([...options, response.data]);
      setNewOption({ name: "", price: "", category: "PERFORMANCE" });
      setError("");
    } catch (error) {
      console.error("❌ Erreur lors de l'ajout :", error);
      setError("Impossible d'ajouter cette option.");
    }
  };

  const addIncompatibility = async () => {
    if (!incompatibility.optionId1 || !incompatibility.optionId2) {
      setError("⚠️ Veuillez sélectionner deux options incompatibles.");
      return;
    }

    try {
      await axios.post(`${API_URL}/incompatible`, incompatibility, { withCredentials: true });
      setIncompatibility({ optionId1: "", optionId2: "" });
      fetchIncompatibleOptions();
      setError("");
    } catch (error) {
      console.error("❌ Erreur lors de l'ajout d'une incompatibilité :", error);
      setError("Impossible d'ajouter cette incompatibilité.");
    }
  };

  const deleteOption = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette option ?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
      setOptions(options.filter(option => option.id !== id));
    } catch (error) {
      console.error("❌ Erreur lors de la suppression :", error);
      setError("Impossible de supprimer cette option.");
    }
  };

  return (
    <div className="admin-options-container">
    <div className="container mt-5">
      <h2 className="text-center text-primary">Gestion des Options ⚙️</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card p-4 shadow-sm">
        <h4>Ajouter une nouvelle option</h4>
        <input 
          type="text" 
          placeholder="Nom" 
          value={newOption.name} 
          onChange={(e) => setNewOption({ ...newOption, name: e.target.value })} 
          className="form-control mb-3" 
        />
        <input 
          type="number" 
          placeholder="Prix" 
          value={newOption.price} 
          onChange={(e) => setNewOption({ ...newOption, price: e.target.value })} 
          className="form-control mb-3" 
        />
        <select 
          value={newOption.category} 
          onChange={(e) => setNewOption({ ...newOption, category: e.target.value })} 
          className="form-control mb-3"
        >
          <option value="PERFORMANCE">Performance</option>
          <option value="SECURITE">Sécurité</option>
          <option value="CONFORT">Confort</option>
          <option value="MULTIMEDIA">Multimédia</option>
        </select>
        <button className="btn btn-success w-100" onClick={addOption}>➕ Ajouter</button>
      </div>

      <div className="card p-4 mt-4 shadow-sm">
        <h4>Définir une incompatibilité entre deux options 🚫</h4>
        <select 
          value={incompatibility.optionId1} 
          onChange={(e) => setIncompatibility({ ...incompatibility, optionId1: e.target.value })} 
          className="form-control mb-3"
        >
          <option value="">Sélectionner la première option</option>
          {options.map(option => (
            <option key={option.id} value={option.id}>{option.name}</option>
          ))}
        </select>

        <select 
          value={incompatibility.optionId2} 
          onChange={(e) => setIncompatibility({ ...incompatibility, optionId2: e.target.value })} 
          className="form-control mb-3"
        >
          <option value="">Sélectionner la deuxième option</option>
          {options.map(option => (
            <option key={option.id} value={option.id}>{option.name}</option>
          ))}
        </select>

        <button className="btn btn-danger w-100" onClick={addIncompatibility}>🚫 Ajouter Incompatibilité</button>
      </div>

      <div className="mt-4">
        <h4>Options existantes</h4>
        {options.length === 0 ? (
          <p>Aucune option enregistrée.</p>
        ) : (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Prix</th>
                <th>Catégorie</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {options.map(option => (
                <tr key={option.id}>
                  <td>{option.name}</td>
                  <td>{option.price} FCFA</td>
                  <td>{option.category}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteOption(option.id)}>❌ Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-4">
        <h4>Options Incompatibles 🚫</h4>
        {incompatibleOptions.length === 0 ? (
          <p>Aucune incompatibilité définie.</p>
        ) : (
          <ul>
            {incompatibleOptions.map((pair, index) => (
              <li key={index}>
                {pair.option1.name} ❌ {pair.option2.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="d-flex justify-content-center mt-4">
        <button className="btn btn-secondary" onClick={() => navigate("/profile")}>🔙 Retour au Profil</button>
      </div>
    </div>
    </div>
  );
};

export default AdminOptions;
