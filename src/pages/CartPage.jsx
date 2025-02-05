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

  if (!cart) return (
    <div className="container mt-5 cart-container">
      <div className="empty-cart-message text-center mt-5">
        <h3 className="text-danger">Votre panier est vide</h3>
        <p className="text-muted">Ajoutez des articles à votre panier pour commencer.</p>
      </div>
    </div>
  );

  return (
    <div className="container mt-5 cart-container">
      <h2 className="text-primary text-center">🛒 Mon Panier</h2>

      {error && <div className="alert alert-danger text-center">{error}</div>}

      <ul className="list-group mt-4">
        {cart.items.map((item) => (
          <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{item.vehicle.name}</strong> - {item.quantity}x - {item.vehicle.price} FCFA
              <ul className="list-unstyled mt-2">
                {item.options.map((option) => (
                  <li key={option.id} className="text-secondary">
                    {option.name} ({option.price} FCFA)
                  </li>
                ))}
              </ul>
            </div>
            <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item.id)}>
              ❌
            </button>
          </li>
        ))}
      </ul>

      <div className="d-flex justify-content-center mt-4">
        <button className="btn btn-warning me-2" onClick={clearCart}>🗑️ Vider le panier</button>
        <button className="btn btn-secondary me-2" onClick={() => navigate("/choose-options")}>🔙 Retour</button>
        <button className="btn btn-primary" onClick={placeOrder} disabled={loading}>
          {loading ? "⌛ Traitement..." : "🛍️ Passer la commande"}
        </button>
      </div>
    </div>
  );
};

export default CartPage;
