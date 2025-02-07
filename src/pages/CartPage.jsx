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
    if (!user || !user.customer) {
      navigate("/login");
      return;
    }
    fetchCart();
  }, [user, navigate]);

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
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      margin: '2rem auto',
      maxWidth: '600px'
    }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '4rem' }}>🛒</span>
      </div>
      <h3 style={{ 
        color: 'var(--primary-dark)',
        marginBottom: '1rem',
        fontSize: '1.5rem',
        fontWeight: 'bold'
      }}>Votre panier est vide</h3>
      <p style={{ 
        color: 'var(--text-secondary)',
        marginBottom: '1.5rem'
      }}>Ajoutez des articles à votre panier pour commencer.</p>
      <button 
        onClick={() => navigate('/catalog')}
        style={{
          backgroundColor: 'var(--primary-main)',
          color: 'white',
          border: 'none',
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        🚗 Voir le catalogue
      </button>
    </div>
  );

  if (!cart) return <EmptyCart />;

  const totalPrice = cart.items.reduce((total, item) => {
    const optionsPrice = item.options.reduce((sum, option) => sum + option.price, 0);
    return total + (item.vehicle.price + optionsPrice) * item.quantity;
  }, 0);

  return (
    <div style={{
      backgroundColor: 'var(--background)',
      minHeight: '100vh',
      padding: '2rem'
    }}>
      <div style={{ 
        backgroundColor: 'var(--primary-dark)', 
        padding: '5rem 1rem', 
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
        }}>🛒 Mon Panier</h2>
      </div>

      {error && (
        <div style={{
          backgroundColor: 'var(--error)',
          color: 'white',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      <div style={{
        backgroundColor: 'var(--surface)',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ marginBottom: '2rem' }}>
          {cart.items.map((item) => (
            <div 
              key={item.id} 
              style={{
                backgroundColor: 'var(--background)',
                padding: '1.5rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '1rem'
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.5rem'
                }}>
                  <h3 style={{ 
                    margin: '0',
                    color: 'var(--primary-dark)',
                    fontSize: '1.2rem',
                    fontWeight: 'bold'
                  }}>{item.vehicle.name}</h3>
                  <span style={{ 
                    backgroundColor: 'var(--primary-light)',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.9rem'
                  }}>{item.quantity}x</span>
                </div>
                <p style={{ 
                  margin: '0 0 1rem 0',
                  color: 'var(--accent)',
                  fontSize: '1.1rem',
                  fontWeight: 'bold'
                }}>{item.vehicle.price.toLocaleString()} FCFA</p>
                {item.options.length > 0 && (
                  <div style={{ 
                    backgroundColor: 'var(--surface)',
                    padding: '1rem',
                    borderRadius: '8px'
                  }}>
                    <p style={{ 
                      margin: '0 0 0.5rem 0',
                      color: 'var(--primary-dark)',
                      fontSize: '0.9rem',
                      fontWeight: 'bold'
                    }}>Options sélectionnées:</p>
                    {item.options.map((option) => (
                      <div 
                        key={option.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          color: 'var(--text-secondary)',
                          fontSize: '0.9rem',
                          marginBottom: '0.25rem'
                        }}
                      >
                        <span>{option.name}</span>
                        <span>{option.price.toLocaleString()} FCFA</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button 
                onClick={() => removeFromCart(item.id)}
                style={{
                  backgroundColor: 'var(--error)',
                  color: 'white',
                  border: 'none',
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                ❌
              </button>
            </div>
          ))}
        </div>

        <div style={{
          borderTop: '2px solid var(--border)',
          paddingTop: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <span style={{ 
              fontSize: '1.2rem',
              fontWeight: 'bold',
              color: 'var(--primary-dark)'
            }}>Total</span>
            <span style={{ 
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: 'var(--accent)'
            }}>{totalPrice.toLocaleString()} FCFA</span>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem'
        }}>
          <button 
            onClick={clearCart}
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
          >🗑️ Vider le panier</button>
          <button 
            onClick={() => navigate("/choose-options")}
            style={{
              backgroundColor: 'var(--primary-light)',
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
          >🔙 Retour</button>
          <button 
            onClick={placeOrder} 
            disabled={loading}
            style={{
              backgroundColor: loading ? 'var(--border)' : 'var(--success)',
              color: 'white',
              border: 'none',
              padding: '0.75rem',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            {loading ? "⌛ Traitement..." : "🛍️ Passer la commande"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
