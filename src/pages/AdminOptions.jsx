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
    <div style={{ 
      backgroundColor: 'var(--background)', 
      minHeight: '100vh',
      padding: '2rem'
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
        }}>⚙️ Gestion des Options</h2>
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

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '2rem'
        }}>
          {/* Add Option Form */}
          <div style={{
            backgroundColor: 'var(--surface)',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ 
              color: 'var(--primary-dark)',
              marginBottom: '1.5rem',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}>Ajouter une option</h3>

            <div style={{ display: 'grid', gap: '1rem' }}>
              <input 
                type="text" 
                placeholder="Nom de l'option" 
                value={newOption.name} 
                onChange={(e) => setNewOption({ ...newOption, name: e.target.value })} 
                style={{
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '2px solid var(--border)',
                  width: '100%'
                }}
              />
              <input 
                type="number" 
                placeholder="Prix en FCFA" 
                value={newOption.price} 
                onChange={(e) => setNewOption({ ...newOption, price: e.target.value })} 
                style={{
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '2px solid var(--border)',
                  width: '100%'
                }}
              />
              <select 
                value={newOption.category} 
                onChange={(e) => setNewOption({ ...newOption, category: e.target.value })} 
                style={{
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '2px solid var(--border)',
                  backgroundColor: 'var(--background)',
                  color: 'var(--text-primary)',
                  width: '100%'
                }}
              >
                <option value="PERFORMANCE">Performance</option>
                <option value="SECURITE">Sécurité</option>
                <option value="CONFORT">Confort</option>
                <option value="MULTIMEDIA">Multimédia</option>
              </select>

              <button 
                onClick={addOption}
                style={{
                  backgroundColor: 'var(--success)',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                ➕ Ajouter l'option
              </button>
            </div>
          </div>

          {/* Add Incompatibility Form */}
          <div style={{
            backgroundColor: 'var(--surface)',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ 
              color: 'var(--primary-dark)',
              marginBottom: '1.5rem',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}>🚫 Définir une incompatibilité</h3>

            <div style={{ display: 'grid', gap: '1rem' }}>
              <select 
                value={incompatibility.optionId1} 
                onChange={(e) => setIncompatibility({ ...incompatibility, optionId1: e.target.value })} 
                style={{
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '2px solid var(--border)',
                  backgroundColor: 'var(--background)',
                  color: 'var(--text-primary)',
                  width: '100%'
                }}
              >
                <option value="">Sélectionner la première option</option>
                {options.map(option => (
                  <option key={option.id} value={option.id}>{option.name}</option>
                ))}
              </select>

              <select 
                value={incompatibility.optionId2} 
                onChange={(e) => setIncompatibility({ ...incompatibility, optionId2: e.target.value })} 
                style={{
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '2px solid var(--border)',
                  backgroundColor: 'var(--background)',
                  color: 'var(--text-primary)',
                  width: '100%'
                }}
              >
                <option value="">Sélectionner la deuxième option</option>
                {options.map(option => (
                  <option key={option.id} value={option.id}>{option.name}</option>
                ))}
              </select>

              <button 
                onClick={addIncompatibility}
                style={{
                  backgroundColor: 'var(--error)',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                🚫 Ajouter l'incompatibilité
              </button>
            </div>
          </div>
        </div>

        {/* Options List */}
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
          }}>Options existantes</h3>

          {options.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              color: 'var(--text-secondary)'
            }}>
              Aucune option enregistrée.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Nom</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Prix</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Catégorie</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {options.map(option => (
                  <tr 
                    key={option.id}
                    style={{ 
                      borderBottom: '1px solid var(--border)',
                      backgroundColor: 'var(--background)'
                    }}
                  >
                    <td style={{ padding: '1rem' }}>{option.name}</td>
                    <td style={{ padding: '1rem' }}>{option.price.toLocaleString()} FCFA</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        backgroundColor: 
                          option.category === 'PERFORMANCE' ? 'var(--primary-main)' :
                          option.category === 'SECURITE' ? 'var(--accent)' :
                          option.category === 'CONFORT' ? 'var(--success)' :
                          'var(--primary-light)',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.9rem'
                      }}>
                        {option.category}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <button 
                        onClick={() => deleteOption(option.id)}
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Incompatible Options List */}
        <div style={{
          backgroundColor: 'var(--surface)',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ 
            color: 'var(--primary-dark)',
            marginBottom: '1.5rem',
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}>🚫 Options Incompatibles</h3>

          {incompatibleOptions.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              color: 'var(--text-secondary)'
            }}>
              Aucune incompatibilité définie.
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {incompatibleOptions.map((pair, index) => (
                <div 
                  key={index}
                  style={{
                    backgroundColor: 'var(--background)',
                    padding: '1rem',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <span style={{ 
                    backgroundColor: 'var(--primary-main)',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.9rem'
                  }}>{pair.option1.name}</span>
                  <span style={{ color: 'var(--error)' }}>❌</span>
                  <span style={{ 
                    backgroundColor: 'var(--primary-main)',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.9rem'
                  }}>{pair.option2.name}</span>
                </div>
              ))}
            </div>
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

export default AdminOptions;
