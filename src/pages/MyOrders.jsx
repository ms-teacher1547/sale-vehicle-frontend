import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaFileDownload, FaCheckCircle, FaCreditCard } from "react-icons/fa";
import "../styles/MyOrder.css";

const API_URL = "http://localhost:8081/api/orders";

const MyOrders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDocuments, setShowDocuments] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  // 🔹 Récupérer les commandes du client connecté
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/my-orders`, { withCredentials: true });
      const sortedOrders = response.data.sort((a, b) => new Date(b.dateDeCommande) - new Date(a.dateDeCommande)); // Trier par date décroissante
      setOrders(sortedOrders);
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
      // Ne pas réinitialiser les documents ici
      fetchOrders(); // Rafraîchir les commandes après confirmation
    } catch (error) {
      console.error("❌ Erreur lors de la confirmation :", error);
      setError("Impossible de confirmer la commande.");
    }
  };


  // 🔹 Récupérer les documents d'une commande
  const fetchDocuments = async (orderId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/my-documents`, { withCredentials: true });
      const sortedDocuments = response.data.sort((a, b) => b.id - a.id); // Trier par ID décroissant
      setDocuments(sortedDocuments);
      setSelectedOrderId(orderId);
      setError("");
    } catch (error) {
      console.error("❌ Erreur lors du chargement des documents :", error);
      setError("Impossible de charger les documents.");
    } finally {
      setLoading(false);
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


  // Filtrer les documents en fonction du terme de recherche
  useEffect(() => {
    const filtered = documents.filter(doc =>
      doc.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDocuments(filtered);
  }, [searchTerm, documents]);

  return (
    
      <div className="myorders-container">
        <div className="page-header">
          <h2 className="text-white">📦 Mes Commandes</h2>
          <p className="text-white text-center">Gérez vos commandes et accédez à vos documents</p>
        </div>
        <div className="row">
          <div className="col-md-8">
  
            {error && <div className="alert alert-danger">{error}</div>}
  
            {orders.length === 0 ? (
              <div className="alert alert-info">Aucune commande enregistrée.</div>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order.id} className="order-card">
                    <div className="order-header d-flex justify-content-between align-items-center">
                      <h3 className="h5 mb-0">Commande #{order.id}</h3>
                      <div className="d-flex align-items-center">
                        <span className="me-3">{new Date(order.dateDeCommande).toLocaleDateString()}</span>
                        <span className={`badge ${order.status === "EN_COURS" ? "bg-warning" : "bg-success"}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">

  
                  <div className="vehicles-list">
                    {order.orderVehicles.map((item) => (
                      <div key={item.id} className="vehicle-item">
                        <div>
                          <span className="vehicle-name">🚗 {item.vehicle.name}</span>
                          <span className="text-muted ms-2">x{item.quantity}</span>
                        </div>
                        <span className="vehicle-price">{item.vehicle.price.toLocaleString()} FCFA</span>
                      </div>
                    ))}
                  </div>
                  
                  {order.options && order.options.length > 0 && (
                    <div>
                      <h4>Options ajoutées :</h4>
                      <ul>
                        {order.options.map(option => (
                          <li key={option.id}>
                            {option.name} - {option.price} FCFA
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="order-total mt-3 pt-3 border-top d-flex justify-content-between align-items-center">
                    <span className="total-label">Total de la commande</span>
                    <span className="total-amount">{order.totalPrice.toLocaleString()} FCFA</span>
                  </div>

                  <div className="order-actions mt-4 d-flex justify-content-end gap-3">
                    {order.status === "EN_COURS" && (
                      <button 
                        className="btn btn-primary" 
                        onClick={() => confirmOrder(order.id)}
                      >
                        <FaCheckCircle className="me-2" />
                        Confirmer la commande
                      </button>
                    )}
                    
                    {(order.status === "VALIDEE" || order.status === "LIVREE") && (
                      <>
                        <button 
                          className="btn btn-info" 
                          onClick={() => {
                            fetchDocuments(order.id);
                            setShowDocuments(true); // Pour afficher les documents
                          }}
                        >
                          <i className="fas fa-file-alt me-2"></i>
                          Voir les documents
                        </button>
                        {order.status === "VALIDEE" && (
                          <button 
                            className="btn btn-success" 
                            onClick={() => navigate(`/payment/${order.id}`)}
                          >
                            <FaCreditCard className="me-2" />
                            Procéder au paiement
                          </button>
                        )}
                                              </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
            )}
          </div>

        
          {/* Section des documents */}
          <div className="col-md-4">
            <div className="documents-section p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="h4 mb-0">Documents disponibles</h3>
                {documents.length > 0 && (
                  <button 
                    className="btn btn-link text-decoration-none"
                    onClick={() => setShowDocuments(!showDocuments)}
                  >
                    {showDocuments ? (
                      <><i className="fas fa-chevron-up me-2"></i>Masquer</>
                    ) : (
                      <><i className="fas fa-chevron-down me-2"></i>Afficher</>
                    )}
                  </button>
                )}
              </div>
              
              {showDocuments && documents.length > 0 && (
                <div className="documents-list">
                  <div className="search-box mb-4">
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaSearch />
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Rechercher un document..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  {loading ? (
                    <div className="text-center py-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Chargement...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="documents-grid">
                      {filteredDocuments.map((doc) => (
                        <div key={doc.id} className="document-card">
                          <div className="document-info">
                            <span className="document-title">{doc.title}</span>
                            <small className="text-muted">
                              {new Date(doc.createdAt).toLocaleDateString()}
                            </small>
                          </div>
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => downloadDocument(doc.id)}
                          >
                            <FaFileDownload className="me-2" />
                            Télécharger
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    
  );
};

  
export default MyOrders;