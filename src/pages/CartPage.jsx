import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // 🔥 Importer SweetAlert pour de meilleurs messages


const API_URL = "http://localhost:8081/api/cart";
const ORDER_API_URL = "http://localhost:8081/api/orders"; // ✅ URL de l'API des commandes

const CartPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Fonction pour récupérer le panier du client
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
  }, [user, navigate, fetchCart]); // ✅ Ajout de fetchCart
  

  // 🔹 Supprimer un article du panier
  const removeFromCart = async (itemId) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet article ?")) return;

    try {
      await axios.delete(`${API_URL}/${cart.id}/remove/${itemId}`, { withCredentials: true });
      fetchCart(); // 🔄 Rafraîchir le panier après suppression
    } catch (error) {
      console.error("❌ Erreur lors de la suppression :", error);
      setError("Impossible de supprimer cet article.");
    }
  };

  // 🔹 Vider le panier
  const clearCart = async () => {
    if (!window.confirm("Voulez-vous vraiment vider votre panier ?")) return;

    try {
      await axios.delete(`${API_URL}/clear/${user.customer.id}`, { withCredentials: true });
      setCart(null); // 🔥 Réinitialiser le panier après suppression
    } catch (error) {
      console.error("❌ Erreur lors du vidage du panier :", error);
      setError("Impossible de vider votre panier.");
    }
  };

  // 🔹 Passer la commande avec sélection du paiement

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

    if (!confirmResult.isConfirmed) return; // 🚫 Annulation de la commande

    setLoading(true);
    try {
      await axios.post(`${ORDER_API_URL}/`, {}, { withCredentials: true }); // ✅ Fix ici

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

  
  


  if (!cart) return <p>Votre panier est vide.</p>;

  return (
    <div className="container mt-5">
      <h2>🛒 Mon Panier</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <ul className="list-group">
        {cart.items.map((item) => (
          <li key={item.id} className="list-group-item">
            <strong>{item.vehicle.name}</strong> - {item.quantity}x - {item.vehicle.price} FCFA
            <ul>
              {item.options.map((option) => (
                <li key={option.id}>{option.name} ({option.price} FCFA)</li>
              ))}
            </ul>
            <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item.id)}>❌ Supprimer</button>
          </li>
        ))}
      </ul>

     

      <button className="btn btn-warning mt-3 me-2" onClick={clearCart}>🗑️ Vider le panier</button>
      <button className="btn btn-secondary mt-3 me-2" onClick={() => navigate("/choose-options")}>🔙 Retour</button>
      <button className="btn btn-primary mt-3" onClick={placeOrder} disabled={loading}>
        {loading ? "⌛ Traitement..." : "🛍️ Passer la commande"}
      </button>
    </div>
  );
};

export default CartPage;
