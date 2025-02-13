import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/theme.css";
import { Box } from '@mui/material';

const API_URL_VEHICLES = "http://localhost:8081/api/catalog/vehicles";
const API_URL_OPTIONS = "http://localhost:8081/api/options";
const API_URL_CART = "http://localhost:8081/api/cart";

const ChooseOptions = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const [vehicles, setVehicles] = useState([]); 
  const [options, setOptions] = useState([]); 
  const [selectedVehicle, setSelectedVehicle] = useState(null); 
  const [selectedOptions, setSelectedOptions] = useState([]); 
  const [quantity, setQuantity] = useState(1); 
  const [error, setError] = useState(""); 

  useEffect(() => {
    fetchVehicles();
    fetchOptions();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get(`${API_URL_VEHICLES}`, { withCredentials: true });
      setVehicles(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des véhicules :", error);
      setError("Impossible de charger les véhicules.");
    }
  };

  const fetchOptions = async () => {
    try {
      const response = await axios.get(`${API_URL_OPTIONS}/`);
      setOptions(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des options :", error);
      setError("Impossible de charger les options.");
    }
  };

  const handleSelectVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setSelectedOptions([]); 
  };

  const handleSelectOption = (option) => {
    const incompatible = selectedOptions.some(selectedOption => 
      option.incompatibleOptions?.some(incomp => incomp.id === selectedOption.id)
    );

    if (incompatible) {
      setError(`L'option ${option.name} est incompatible avec celles déjà sélectionnées.`);
      return;
    }

    setSelectedOptions(prevOptions =>
      prevOptions.includes(option)
        ? prevOptions.filter(opt => opt.id !== option.id)
        : [...prevOptions, option]
    );
    setError(""); 
  };

  const addToCart = async () => {
    if (!selectedVehicle) {
      setError("Veuillez sélectionner un véhicule.");
      return;
    }

    try {
      await axios.post(
        `${API_URL_CART}/add`,
        {
          vehicleId: selectedVehicle.id,
          options: selectedOptions.map(opt => opt.id),
          quantity: quantity
        },
        { withCredentials: true }
      );

      navigate("/cart"); 
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier :", error);
      setError("Les deux options sont incompatibles, selections autres.");
    }
  };

  return (
    <div style={{ 
      backgroundColor: 'var(--background)',
      minHeight: '100vh',
      position: 'relative',
      paddingBottom: '4rem'
    }}>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '300px',
          background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary-main) 100%)',
          opacity: 0.1,
          zIndex: 0
        }}
      />
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ 
          backgroundColor: 'var(--primary-dark)', 
          padding: '5rem 2rem', 
          marginBottom: '3rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 60%)',
            zIndex: 1
          }}/>
          <div style={{ position: 'relative', zIndex: 2, maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ 
              color: 'var(--surface)', 
              marginBottom: '1rem',
              fontSize: '3rem',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              textShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>Personnalisez Votre Véhicule</h2>
            <p style={{ 
              color: 'white', 
              fontSize: '1.2rem',
              opacity: 0.9,
              maxWidth: '600px',
              margin: '0 auto'
            }}>Configurez votre véhicule selon vos besoins et préférences</p>
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          {error && (
            <div style={{
              backgroundColor: 'var(--error-light)',
              color: 'var(--error)',
              padding: '1rem 1.5rem',
              borderRadius: '12px',
              marginBottom: '2rem',
              border: '1px solid var(--error)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <span style={{ fontSize: '1.5rem' }}>⚠️</span>
              <p style={{ margin: 0, fontWeight: 500 }}>{error}</p>
            </div>
          )}

          <div style={{ marginBottom: '4rem' }}>
            <h3 style={{ 
              color: 'var(--text-primary)',
              marginBottom: '2rem',
              fontSize: '2rem',
              fontWeight: 'bold',
              textAlign: 'center',
              position: 'relative'
            }}>
              Véhicules Disponibles
              <span style={{
                display: 'block',
                width: '60px',
                height: '4px',
                backgroundColor: 'var(--primary-main)',
                margin: '1rem auto 0',
                borderRadius: '2px'
              }}></span>
            </h3>

            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '2rem',
              marginBottom: '3rem'
            }}>
              {vehicles.map((vehicle) => (
                <div 
                  key={vehicle.id} 
                  onClick={() => handleSelectVehicle(vehicle)}
                  style={{ 
                    backgroundColor: 'var(--surface)',
                    borderRadius: '16px',
                    border: selectedVehicle?.id === vehicle.id 
                      ? '2px solid var(--primary-main)'
                      : '1px solid var(--border)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    transform: selectedVehicle?.id === vehicle.id ? 'scale(1.02)' : 'scale(1)',
                    boxShadow: selectedVehicle?.id === vehicle.id 
                      ? '0 8px 24px rgba(0,0,0,0.12)'
                      : '0 4px 12px rgba(0,0,0,0.08)'
                  }}
                >
                  <div style={{
                    position: 'relative',
                    paddingTop: '60%',
                    backgroundColor: 'var(--background)',
                    overflow: 'hidden'
                  }}>
                    <img 
                      src={`http://localhost:8081/uploads/vehicles/${vehicle.imageUrl.split('/').pop()}`}
                      alt={vehicle.name}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      backgroundColor: 'var(--success)',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      fontSize: '0.875rem',
                      fontWeight: 'bold',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                      Disponible
                    </div>
                  </div>

                  <div style={{ padding: '1.5rem' }}>
                    <h4 style={{ 
                      fontSize: '1.5rem',
                      color: 'var(--text-primary)',
                      marginBottom: '1rem',
                      fontWeight: 'bold'
                    }}>{vehicle.name}</h4>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '1rem'
                    }}>
                      <div style={{ 
                        fontSize: '1.5rem',
                        color: 'var(--primary-main)',
                        fontWeight: 'bold'
                      }}>
                        {vehicle.price.toLocaleString()} FCFA
                      </div>
                      <button
                        style={{
                          backgroundColor: selectedVehicle?.id === vehicle.id ? 'var(--primary-main)' : 'transparent',
                          color: selectedVehicle?.id === vehicle.id ? 'white' : 'var(--primary-main)',
                          border: '2px solid var(--primary-main)',
                          padding: '0.75rem 1.5rem',
                          borderRadius: '8px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {selectedVehicle?.id === vehicle.id ? 'Sélectionné' : 'Sélectionner'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedVehicle && (
              <div style={{ marginTop: '4rem' }}>
                <h3 style={{ 
                  color: 'var(--text-primary)',
                  marginBottom: '2rem',
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  position: 'relative'
                }}>
                  Options Disponibles
                  <span style={{
                    display: 'block',
                    width: '60px',
                    height: '4px',
                    backgroundColor: 'var(--primary-main)',
                    margin: '1rem auto 0',
                    borderRadius: '2px'
                  }}></span>
                </h3>

                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '1.5rem',
                  marginBottom: '3rem'
                }}>
                  {options.map((option) => (
                    <div
                      key={option.id}
                      onClick={() => handleSelectOption(option)}
                      style={{
                        backgroundColor: 'var(--surface)',
                        borderRadius: '12px',
                        border: selectedOptions.includes(option)
                          ? '2px solid var(--primary-main)'
                          : '1px solid var(--border)',
                        padding: '1.5rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        transform: selectedOptions.includes(option) ? 'scale(1.02)' : 'scale(1)',
                        boxShadow: selectedOptions.includes(option)
                          ? '0 8px 24px rgba(0,0,0,0.12)'
                          : '0 4px 12px rgba(0,0,0,0.08)'
                      }}
                    >
                      <h4 style={{ 
                        fontSize: '1.25rem',
                        color: 'var(--text-primary)',
                        marginBottom: '1rem',
                        fontWeight: 'bold'
                      }}>{option.name}</h4>
                      <p style={{
                        color: 'var(--text-secondary)',
                        marginBottom: '1rem',
                        fontSize: '0.875rem',
                        lineHeight: '1.5'
                      }}>{option.description}</p>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 'auto'
                      }}>
                        <div style={{ 
                          fontSize: '1.25rem',
                          color: 'var(--primary-main)',
                          fontWeight: 'bold'
                        }}>
                          {option.price.toLocaleString()} FCFA
                        </div>
                        <div style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          border: '2px solid var(--primary-main)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: selectedOptions.includes(option) ? 'var(--primary-main)' : 'transparent',
                          transition: 'all 0.3s ease'
                        }}>
                          {selectedOptions.includes(option) && (
                            <span style={{ color: 'white', fontSize: '1rem' }}>✓</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{
                  backgroundColor: 'var(--surface)',
                  borderRadius: '16px',
                  padding: '2rem',
                  marginTop: '2rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  border: '1px solid var(--border)'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem'
                  }}>
                    <div>
                      <h4 style={{
                        fontSize: '1.5rem',
                        color: 'var(--text-primary)',
                        marginBottom: '0.5rem',
                        fontWeight: 'bold'
                      }}>Récapitulatif</h4>
                      <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                        {selectedVehicle.name} avec {selectedOptions.length} option(s)
                      </p>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem'
                    }}>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ 
                          color: 'var(--text-secondary)',
                          margin: '0',
                          fontSize: '0.875rem'
                        }}>Quantité</p>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              border: '1px solid var(--border)',
                              backgroundColor: 'var(--background)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '1.25rem'
                            }}
                          >-</button>
                          <span style={{
                            width: '40px',
                            textAlign: 'center',
                            fontSize: '1.25rem',
                            fontWeight: 'bold'
                          }}>{quantity}</span>
                          <button
                            onClick={() => setQuantity(quantity + 1)}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              border: '1px solid var(--border)',
                              backgroundColor: 'var(--background)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '1.25rem'
                            }}
                          >+</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid var(--border)',
                    paddingTop: '1.5rem'
                  }}>
                    <div>
                      <p style={{
                        color: 'var(--text-secondary)',
                        margin: '0 0 0.5rem 0',
                        fontSize: '0.875rem'
                      }}>Prix total</p>
                      <div style={{
                        fontSize: '2rem',
                        color: 'var(--primary-main)',
                        fontWeight: 'bold'
                      }}>
                        {((selectedVehicle.price + selectedOptions.reduce((sum, opt) => sum + opt.price, 0)) * quantity).toLocaleString()} FCFA
                      </div>
                    </div>
                    <button
                      onClick={addToCart}
                      style={{
                        backgroundColor: 'var(--primary-main)',
                        color: 'white',
                        border: 'none',
                        padding: '1rem 2rem',
                        borderRadius: '12px',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        '&:hover': {
                          backgroundColor: 'var(--primary-dark)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      <span>Ajouter au panier</span>
                      <span style={{ fontSize: '1.25rem' }}>🛒</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseOptions;