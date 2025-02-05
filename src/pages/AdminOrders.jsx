import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Spinner } from "react-bootstrap";
import { FaBox, FaArrowRight, FaArrowLeft } from "react-icons/fa";
import "../styles/AdminOrder.css"; // Assurez-vous d'importer le CSS

const API_URL = "http://localhost:8081/api/orders";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/`, { withCredentials: true });
      setOrders(response.data);
    } catch (error) {
      console.error("❌ Erreur lors du chargement des commandes :", error);
      setError("Impossible de charger les commandes.");
    }
    setLoading(false);
  };

  const changeOrderStatus = async (orderId, action) => {
    setShowModal(false);
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

  if (loading) return <Spinner animation="border" role="status" />;

  return (
    <div className="admin-orders">
      <h2 className="mb-4 text-center">
        📦 Gestion des Commandes <FaBox />
      </h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {orders.length === 0 ? (
        <p>Aucune commande enregistrée.</p>
      ) : (
        <ul className="list-group">
          {orders.map((order) => (
            <li key={order.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>Commande #{order.id}</strong> - {new Date(order.dateDeCommande).toLocaleDateString()} -
                <span className={`badge ${order.status === "EN_COURS" ? "bg-warning" : "bg-success"}`}>
                  {order.status}
                </span>
                <p><strong>Total :</strong> {order.totalPrice} FCFA</p>
              </div>

              <div>
                <button
                  className="btn btn-success btn-sm mt-2 me-2"
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowModal(true);
                  }}
                >
                  <FaArrowRight /> Avancer
                </button>
                <button
                  className="btn btn-danger btn-sm mt-2"
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowModal(true);
                  }}
                >
                  <FaArrowLeft /> Reculer
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation du changement de statut</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <p>
              Voulez-vous vraiment {selectedOrder.status === "EN_COURS" ? "avancer" : "reculer"} la commande
              <strong> #{selectedOrder.id}</strong> ?
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Annuler
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              const action = selectedOrder.status === "EN_COURS" ? "next" : "previous";
              changeOrderStatus(selectedOrder.id, action);
            }}
          >
            Confirmer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminOrders;
