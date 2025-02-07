import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { FaBuilding, FaPlus, FaTrash, FaArrowLeft, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const API_URL = "http://localhost:8081/api/customers";

const SubsidiaryManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [subsidiaries, setSubsidiaries] = useState([]);
  const [newSubsidiary, setNewSubsidiary] = useState({ name: "", email: "", address: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const fetchSubsidiaries = useCallback(async () => {
    if (!user || !user.customer || user.customer.type !== "COMPANY") {
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/${user.customer.id}/subsidiaries`, { withCredentials: true });
      setSubsidiaries(response.data);
      setError("");
    } catch (error) {
      setError("Impossible de charger les filiales");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user || !user.customer || user.customer.type !== "COMPANY") {
      navigate("/profile");
      return;
    }
    fetchSubsidiaries();
  }, [user, navigate, fetchSubsidiaries]);

  const addSubsidiary = async () => {
    if (!newSubsidiary.name || !newSubsidiary.email || !newSubsidiary.address) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setIsAdding(true);
    try {
      const response = await axios.post(
        `${API_URL}/${user.customer.id}/subsidiaries`,
        newSubsidiary,
        { withCredentials: true }
      );

      setSubsidiaries([...subsidiaries, response.data]);
      setNewSubsidiary({ name: "", email: "", address: "" });
      setError("");
    } catch (error) {
      setError("Impossible d'ajouter cette filiale");
    } finally {
      setIsAdding(false);
    }
  };

  const deleteSubsidiary = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette filiale ?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
      setSubsidiaries(subsidiaries.filter(subsidiary => subsidiary.id !== id));
    } catch (error) {
      setError("Impossible de supprimer cette filiale");
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid var(--primary-light)',
          borderTop: '4px solid var(--primary-dark)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    );
  }

  return (
    <div style={{
      padding: '5rem',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2rem'
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: 'var(--text-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <FaBuilding /> Gestion des Filiales
        </h1>
        <button
          onClick={() => navigate("/profile")}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: 'var(--background)',
            border: 'none',
            borderRadius: '8px',
            color: 'var(--text-primary)',
            cursor: 'pointer'
          }}
        >
          <FaArrowLeft /> Retour au Profil
        </button>
      </div>

      {error && (
        <div style={{
          backgroundColor: 'var(--error-light)',
          color: 'var(--error)',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}

      <div style={{
        backgroundColor: 'var(--surface)',
        padding: '1.5rem',
        borderRadius: '12px',
        marginBottom: '2rem',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: 'bold',
          marginBottom: '1.5rem',
          color: 'var(--text-primary)'
        }}>
          Ajouter une nouvelle filiale
        </h2>

        <div style={{
          display: 'grid',
          gap: '1rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
        }}>
          <div style={{ position: 'relative' }}>
            <FaBuilding style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-secondary)'
            }} />
            <input
              type="text"
              placeholder="Nom de la filiale"
              value={newSubsidiary.name}
              onChange={(e) => setNewSubsidiary({ ...newSubsidiary, name: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                paddingLeft: '3rem',
                borderRadius: '8px',
                border: '2px solid var(--border)',
                backgroundColor: 'var(--background)',
                color: 'var(--text-primary)'
              }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <FaEnvelope style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-secondary)'
            }} />
            <input
              type="email"
              placeholder="Email"
              value={newSubsidiary.email}
              onChange={(e) => setNewSubsidiary({ ...newSubsidiary, email: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                paddingLeft: '3rem',
                borderRadius: '8px',
                border: '2px solid var(--border)',
                backgroundColor: 'var(--background)',
                color: 'var(--text-primary)'
              }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <FaMapMarkerAlt style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-secondary)'
            }} />
            <input
              type="text"
              placeholder="Adresse"
              value={newSubsidiary.address}
              onChange={(e) => setNewSubsidiary({ ...newSubsidiary, address: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                paddingLeft: '3rem',
                borderRadius: '8px',
                border: '2px solid var(--border)',
                backgroundColor: 'var(--background)',
                color: 'var(--text-primary)'
              }}
            />
          </div>
        </div>

        <button
          onClick={addSubsidiary}
          disabled={isAdding}
          style={{
            marginTop: '1rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: 'var(--primary-main)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}
        >
          {isAdding ? (
            <div style={{
              width: '20px',
              height: '20px',
              border: '2px solid var(--surface)',
              borderTop: '2px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
          ) : (
            <>
              <FaPlus /> Ajouter
            </>
          )}
        </button>
      </div>

      <div style={{
        backgroundColor: 'var(--surface)',
        padding: '1.5rem',
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: 'bold',
          marginBottom: '1.5rem',
          color: 'var(--text-primary)'
        }}>
          Filiales existantes
        </h2>

        {subsidiaries.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            color: 'var(--text-secondary)'
          }}>
            Aucune filiale enregistrée
          </div>
        ) : (
          <div style={{
            overflowX: 'auto'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{
                  borderBottom: '2px solid var(--border)'
                }}>
                  <th style={{
                    padding: '1rem',
                    textAlign: 'left',
                    color: 'var(--text-primary)',
                    fontWeight: 'bold'
                  }}>Nom</th>
                  <th style={{
                    padding: '1rem',
                    textAlign: 'left',
                    color: 'var(--text-primary)',
                    fontWeight: 'bold'
                  }}>Email</th>
                  <th style={{
                    padding: '1rem',
                    textAlign: 'left',
                    color: 'var(--text-primary)',
                    fontWeight: 'bold'
                  }}>Adresse</th>
                  <th style={{
                    padding: '1rem',
                    textAlign: 'right',
                    color: 'var(--text-primary)',
                    fontWeight: 'bold'
                  }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subsidiaries.map(subsidiary => (
                  <tr
                    key={subsidiary.id}
                    style={{
                      borderBottom: '1px solid var(--border)'
                    }}
                  >
                    <td style={{ padding: '1rem', color: 'var(--text-primary)' }}>{subsidiary.name}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-primary)' }}>{subsidiary.email}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-primary)' }}>{subsidiary.address}</td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <button
                        onClick={() => deleteSubsidiary(subsidiary.id)}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: 'var(--error-light)',
                          color: 'var(--error)',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '0.875rem'
                        }}
                      >
                        <FaTrash /> Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubsidiaryManagement;
