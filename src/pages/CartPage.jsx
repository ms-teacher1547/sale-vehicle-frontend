import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/CartPage.css"; // 🔥 Ajoute un fichier CSS personnalisé si besoin

const API_URL = "http://localhost:8081/api/cart";
const ORDER_API_URL = "http://localhost:8081/api/orders";

const CartPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    try {
      const response = await axios.get(`${API_URL}/${user.customer.id}`, { withCredentials: true });
      setCart(response.data);
    } catch (error) {
      console.error("❌ Erreur lors du chargement du panier :", error);
      setError("Impossible de charger votre panier.");
    }
  };

  useEffect(() => {
    
      fetchCart();
    
  }, []);

  const removeFromCart = async (itemId) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet article ?")) return;
    try {
      await axios.delete(`${API_URL}/${cart.id}/remove/${itemId}`, { withCredentials: true });
      fetchCart();
    } catch (error) {
      console.error("❌ Erreur lors de la suppression :", error);
      setError("Impossible de supprimer cet article.");
    }
  };

  const clearCart = async () => {
    if (!window.confirm("Voulez-vous vraiment vider votre panier ?")) return;
    try {
      await axios.delete(`${API_URL}/clear/${user.customer.id}`, { withCredentials: true });
      setCart(null);
    } catch (error) {
      console.error("❌ Erreur lors du vidage du panier :", error);
      setError("Impossible de vider votre panier.");
    }
  };

  const placeOrder = async () => {
    if (!cart || cart.items.length === 0) {
      setError("⚠️ Votre panier est vide. Ajoutez un véhicule avant de passer la commande.");
      return;
    }

    const confirmResult = await Swal.fire({
      title: "🛒 Confirmer la commande ?",
      text: "Voulez-vous vraiment passer cette commande ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, passer la commande !",
      cancelButtonText: "Annuler",
    });

    if (!confirmResult.isConfirmed) return;

    setLoading(true);
    try {
      await axios.post(`${ORDER_API_URL}/`, {}, { withCredentials: true });

      await Swal.fire({
        title: "🎉 Commande passée !",
        text: "Votre commande a été enregistrée avec succès.",
        icon: "success",
        confirmButtonText: "Voir mes commandes",
      });

      navigate("/my-orders", { state: { message: "✅ Votre commande a été passée avec succès !" } });
    } catch (error) {
      console.error("❌ Erreur lors de la commande :", error);

      const errorMessage = error.response?.data;
      if (typeof errorMessage === "string" && errorMessage.includes("commande en attente de paiement")) {
        setError("⚠️ Vous avez déjà une commande en attente de paiement. Payez-la avant d'en créer une nouvelle !");
      } else {
        setError("❌ Impossible de passer la commande.");
      }
    } finally {
      setLoading(false);
    }
  };

  const EmptyCart = () => (
    <div style={{
      backgroundColor: 'var(--surface)',
      padding: '3rem',
      borderRadius: '16px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      textAlign: 'center',
      margin: '2rem auto',
      maxWidth: '600px',
      border: '1px solid var(--border)'
    }}>
      <div style={{ marginBottom: '2rem' }}>
        <span role="img" aria-label="empty cart" style={{ fontSize: '5rem' }}>🛒</span>
      </div>
      <h3 style={{ 
        color: 'var(--text-primary)',
        marginBottom: '1rem',
        fontSize: '1.8rem',
        fontWeight: 'bold'
      }}>Votre panier est vide</h3>
      <p style={{ 
        color: 'var(--text-secondary)',
        marginBottom: '2rem',
        fontSize: '1.1rem',
        lineHeight: '1.6'
      }}>Découvrez notre sélection de véhicules et commencez à configurer votre commande.</p>
      <button 
        onClick={() => navigate('/catalog')}
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
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.75rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          '&:hover': {
            backgroundColor: 'var(--primary-dark)',
            transform: 'translateY(-2px)'
          }
        }}
      >
        <span>Voir le catalogue</span>
        <span style={{ fontSize: '1.25rem' }}>🚗</span>
      </button>
    </div>
  );

  if (!cart) return (
    <div style={{
      backgroundColor: 'var(--background)',
      minHeight: '100vh',
      padding: '2rem'
    }}>
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
          }}>Mon Panier</h2>
        </div>
      </div>
      <EmptyCart />
    </div>
  );

  const totalPrice = cart.items.reduce((total, item) => {
    const optionsPrice = item.options.reduce((sum, option) => sum + option.price, 0);
    return total + (item.vehicle.price + optionsPrice) * item.quantity;
  }, 0);

  return (
    <div style={{
      backgroundColor: 'var(--background)',
      minHeight: '100vh',
      position: 'relative',
      paddingBottom: '4rem'
    }}>
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
          }}>Mon Panier</h2>
          <p style={{ 
            color: 'white', 
            fontSize: '1.2rem',
            opacity: 0.9,
            maxWidth: '600px',
            margin: '0 auto'
          }}>{cart.items.length} article(s) dans votre panier</p>
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

        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '1fr 350px',
          gap: '2rem',
          alignItems: 'start'
        }}>
          <div>
            {cart.items.map((item) => (
              <div 
                key={item.id} 
                style={{
                  backgroundColor: 'var(--surface)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  marginBottom: '1.5rem',
                  border: '1px solid var(--border)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                }}
              >
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '120px 1fr auto',
                  gap: '1.5rem',
                  alignItems: 'center'
                }}>
                  <div style={{
                    position: 'relative',
                    paddingTop: '80px',
                    backgroundColor: 'var(--background)',
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}>
                    <img 
                      src={`http://localhost:8081/uploads/vehicles/${item.vehicle.imageUrl.split('/').pop()}`}
                      alt={item.vehicle.name}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>

                  <div>
                    <h4 style={{
                      fontSize: '1.25rem',
                      color: 'var(--text-primary)',
                      marginBottom: '0.5rem',
                      fontWeight: 'bold'
                    }}>{item.vehicle.name}</h4>
                    
                    {item.options.length > 0 && (
                      <div style={{ marginTop: '0.75rem' }}>
                        <p style={{
                          color: 'var(--text-secondary)',
                          fontSize: '0.875rem',
                          marginBottom: '0.5rem'
                        }}>Options sélectionnées:</p>
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '0.5rem'
                        }}>
                          {item.options.map(option => (
                            <span
                              key={option.id}
                              style={{
                                backgroundColor: 'var(--primary-light)',
                                color: 'var(--primary-dark)',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '16px',
                                fontSize: '0.875rem',
                                fontWeight: '500'
                              }}
                            >
                              {option.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontSize: '1.25rem',
                      color: 'var(--primary-main)',
                      fontWeight: 'bold',
                      marginBottom: '0.5rem'
                    }}>
                      {((item.vehicle.price + item.options.reduce((sum, opt) => sum + opt.price, 0)) * item.quantity).toLocaleString()} €
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      justifyContent: 'flex-end'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        backgroundColor: 'var(--background)',
                        padding: '0.25rem',
                        borderRadius: '8px'
                      }}>
                        <span style={{
                          color: 'var(--text-secondary)',
                          fontSize: '0.875rem'
                        }}>Qté: {item.quantity}</span>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        style={{
                          backgroundColor: 'var(--error-light)',
                          color: 'var(--error)',
                          border: 'none',
                          padding: '0.5rem',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <span role="img" aria-label="remove" style={{ fontSize: '1.25rem' }}>🗑️</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            backgroundColor: 'var(--surface)',
            borderRadius: '16px',
            padding: '2rem',
            position: 'sticky',
            top: '2rem',
            border: '1px solid var(--border)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              color: 'var(--text-primary)',
              marginBottom: '1.5rem',
              fontWeight: 'bold'
            }}>Récapitulatif</h3>

            <div style={{
              borderTop: '1px solid var(--border)',
              paddingTop: '1.5rem',
              marginTop: '1.5rem'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem'
              }}>
                <span style={{
                  fontSize: '1.1rem',
                  color: 'var(--text-primary)',
                  fontWeight: 'bold'
                }}>Total</span>
                <span style={{
                  fontSize: '1.5rem',
                  color: 'var(--primary-main)',
                  fontWeight: 'bold'
                }}>{totalPrice.toLocaleString()} FCFA</span>
              </div>

              <button
                onClick={placeOrder}
                disabled={loading}
                style={{
                  backgroundColor: 'var(--primary-main)',
                  color: 'white',
                  border: 'none',
                  padding: '1rem',
                  borderRadius: '12px',
                  width: '100%',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  marginBottom: '1rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              >
                {loading ? (
                  <span>Traitement en cours...</span>
                ) : (
                  <>
                    <span>Passer la commande</span>
                    <span style={{ fontSize: '1.25rem' }}>✨</span>
                  </>
                )}
              </button>

              <button
                onClick={clearCart}
                disabled={loading}
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--error)',
                  border: '1px solid var(--error)',
                  padding: '0.75rem',
                  borderRadius: '12px',
                  width: '100%',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <span>Vider le panier</span>
                <span role="img" aria-label="clear cart" style={{ fontSize: '1.1rem' }}>🗑️</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
