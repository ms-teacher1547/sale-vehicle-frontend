import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8081/api/orders";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  // 🔹 Récupérer toutes les commandes
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/`, { withCredentials: true });
      setOrders(response.data);
    } catch (error) {
      console.error("❌ Erreur lors du chargement des commandes :", error);
      setError("Impossible de charger les commandes.");
    }
  };

  // 🔹 Changer le statut d'une commande
  const changeOrderStatus = async (orderId, action) => {
    if (!window.confirm(`Voulez-vous vraiment ${action === "next" ? "avancer" : "reculer"} cette commande ?`)) return;

    try {
      await axios.put(`${API_URL}/${orderId}/${action}`, {}, { withCredentials: true });
      alert("✅ Statut mis à jour avec succès !");
      fetchOrders();
    } catch (error) {
      console.error("❌ Erreur lors du changement de statut :", error);
      setError("Impossible de modifier le statut.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>📦 Gestion des Commandes (ADMIN)</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {orders.length === 0 ? (
        <p>Aucune commande enregistrée.</p>
      ) : (
        <ul className="list-group">
          {orders.map((order) => (
            <li key={order.id} className="list-group-item">
              <strong>Commande #{order.id}</strong> - {new Date(order.dateDeCommande).toLocaleDateString()} -
              <span className={`badge ${order.status === "EN_COURS" ? "bg-warning" : "bg-success"}`}>
                {order.status}
              </span>

              <p><strong>Total :</strong> {order.totalPrice} FCFA</p>

              <button className="btn btn-success btn-sm mt-2 me-2" onClick={() => changeOrderStatus(order.id, "next")}>➡️ Avancer</button>
              <button className="btn btn-danger btn-sm mt-2" onClick={() => changeOrderStatus(order.id, "previous")}>⬅️ Reculer</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminOrders;
