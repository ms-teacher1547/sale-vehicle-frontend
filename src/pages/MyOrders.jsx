import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8081/api/orders";

const MyOrders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || !user.customer) {
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  // 🔹 Récupérer les commandes du client connecté
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/my-orders`, { withCredentials: true });
      setOrders(response.data);
    } catch (error) {
      console.error("❌ Erreur lors du chargement des commandes :", error);
      setError("Impossible de charger vos commandes.");
    }
  };

  // 🔹 Confirmer une commande
  const confirmOrder = async (orderId) => {
    if (!window.confirm("Voulez-vous vraiment confirmer cette commande ?")) return;

    try {
      await axios.put(`${API_URL}/status?next=true`, {}, { withCredentials: true });
      alert("✅ Commande confirmée avec succès !");
      fetchOrders(); // 🔄 Rafraîchir les commandes après confirmation
    } catch (error) {
      console.error("❌ Erreur lors de la confirmation :", error);
      setError("Impossible de confirmer la commande.");
    }
  };


  // 🔹 Récupérer les documents d'une commande confirmée
  const fetchDocuments = async (orderId) => {
    try {
      const response = await axios.get(`${API_URL}/my-documents`, { withCredentials: true });
      setDocuments(response.data);
      setSelectedOrderId(orderId); // ✅ Associer les documents à la commande sélectionnée
    } catch (error) {
      console.error("❌ Erreur lors du chargement des documents :", error);
      setError("Impossible de charger les documents.");
    }
  };

  // 🔹 Télécharger un document PDF
  // 🔹 Télécharger un document PDF
  const downloadDocument = async (documentId) => { // ✅ Utilisation de l'ID au lieu du titre
    try {
        const response = await axios.get(`${API_URL}/download/${documentId}`, {
            responseType: "blob", // ✅ Important pour les fichiers
            withCredentials: true
        });

        // 📥 Créer un lien de téléchargement
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `document_${documentId}.pdf`); // ✅ Nom de fichier générique
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error("❌ Erreur lors du téléchargement :", error);
        setError("Impossible de télécharger le document.");
    }
  };


  return (
    <div className="container mt-5">
      <h2>📦 Mes Commandes</h2>

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

              <ul>
                {order.orderVehicles.map((item) => (
                  <li key={item.id}>
                    🚗 {item.vehicle.name} - {item.quantity}x - {item.vehicle.price} FCFA
                  </li>
                ))}
              </ul>

              <p><strong>Total :</strong> {order.totalPrice} FCFA</p>

              {/* ✅ Bouton pour confirmer la commande si elle est "EN_COURS" */}
              {order.status === "EN_COURS" && (
                <button 
                  className="btn btn-primary btn-sm mt-2" 
                  onClick={() => confirmOrder(order.id)}
                >
                  ✅ Confirmer la commande
                </button>
              )}


              {/* ✅ Afficher les documents pour une commande confirmée */}
              {order.status === "VALIDEE" && (
                <button 
                  className="btn btn-info btn-sm mt-2" 
                  onClick={() => fetchDocuments(order.id)}
                >
                  📄 Voir les documents
                </button>
              )}

              {/* ✅ Liste des documents si une commande est sélectionnée */}
              {selectedOrderId === order.id && (
                <ul className="mt-3">
                  {documents.length === 0 ? (
                    <p>Aucun document disponible.</p>
                  ) : (
                    documents.map((doc, index) => (
                      <li key={index}>
                        {doc.title}
                        <button 
                          className="btn btn-success btn-sm ms-2"
                          onClick={() => downloadDocument(doc.id)}
                        >
                          ⬇️ Télécharger
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              )}

              {/* ✅ Bouton pour passer au paiement si la commande n'est pas payée */}
              {order.status === "VALIDEE" && (
                <button 
                  className="btn btn-primary btn-sm mt-2" 
                  onClick={() => navigate(`/payment/${order.id}`)}
                >
                  💳 Passer au paiement
                </button>
              )}

            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyOrders;
