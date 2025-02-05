import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../styles/CartPage.css";
import Navbar from "../components/Navbar";  // Assurez-vous que la Navbar est importée

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
      console.error("Erreur lors du chargement du panier :", error);
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
      setError("Impossible de supprimer cet article.");
    }
  };

  const clearCart = async () => {
    if (!window.confirm("Voulez-vous vraiment vider votre panier ?")) return;
    try {
      await axios.delete(`${API_URL}/clear/${user.customer.id}`, { withCredentials: true });
      setCart(null);
    } catch (error) {
      setError("Impossible de vider votre panier.");
    }
  };

  const placeOrder = async () => {
    if (!cart || cart.items.length === 0) {
      setError("Votre panier est vide.");
      return;
    }

    const confirmResult = await Swal.fire({
      title: "Confirmer la commande ?",
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
        title: "Commande passée !",
        text: "Votre commande a été enregistrée avec succès.",
        icon: "success",
        confirmButtonText: "Voir mes commandes",
      });
      navigate("/my-orders");
    } catch (error) {
      setError("Impossible de passer la commande.");
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Votre panier est vide 😞</h2>
        <p>Ajoutez des véhicules pour finaliser votre commande.</p>
        <button className="btn btn-primary" onClick={() => navigate("/vehicles")}>Voir les véhicules</button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>🛒 Mon Panier</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="cart-items">
        {cart.items.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.vehicle.image} alt={item.vehicle.name} className="cart-item-image" />
            <div className="cart-item-details">
              <h4>{item.vehicle.name}</h4>
              <p>{item.quantity}x - {item.vehicle.price} FCFA</p>
              <button className="btn btn-sm btn-danger" onClick={() => removeFromCart(item.id)}>❌ Supprimer</button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <h4>Total : {cart.totalPrice} FCFA</h4>
        <button className="btn btn-warning" onClick={clearCart}>🗑️ Vider le panier</button>
        <button className="btn btn-primary" onClick={placeOrder} disabled={loading}>
          {loading ? "⌛ Traitement..." : "🛍️ Passer la commande"}
        </button>
      </div>
    </div>
  );
};

export default CartPage;
