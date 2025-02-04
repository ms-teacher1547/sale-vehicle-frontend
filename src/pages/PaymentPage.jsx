import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:8081/api/payments";

const PaymentPage = () => {
  const { user } = useAuth();
  const { orderId } = useParams();
  const navigate = useNavigate();
  
  const [paymentType, setPaymentType] = useState("COMPTANT");
  const [country, setCountry] = useState("CM"); // 🇨🇲 Cameroun par défaut
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || !user.customer) {
      navigate("/login");
      return;
    }
  }, [user, navigate]);

  // 🔹 Effectuer un paiement
  const makePayment = async () => {
    if (!window.confirm("Voulez-vous vraiment procéder au paiement ?")) return;

    try {
      const response = await axios.post(`${API_URL}/`, { paymentType, country }, { withCredentials: true });
      setPayment(response.data);
      alert("✅ Paiement effectué avec succès !");
    } catch (error) {
      console.error("❌ Erreur lors du paiement :", error);
      setError("Impossible d'effectuer le paiement.");
    }
  };

  // 🔹 Confirmer un paiement
  const confirmPayment = async () => {
    if (!window.confirm("Confirmer définitivement ce paiement ?")) return;

    try {
      await axios.put(`${API_URL}/confirm`, {}, { withCredentials: true });
      alert("✅ Paiement confirmé avec succès !");
      navigate("/my-orders"); // 🔄 Redirection vers les commandes
    } catch (error) {
      console.error("❌ Erreur lors de la confirmation :", error);
      setError("Impossible de confirmer le paiement.");
    }
  };

  // 🔹 Télécharger la facture
  const downloadInvoice = async () => {
    if (!payment) return;

    try {
      const response = await axios.get(`${API_URL}/invoice/${payment.invoiceFilename}`, {
        responseType: "blob",
        withCredentials: true
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", payment.invoiceFilename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("❌ Erreur lors du téléchargement :", error);
      setError("Impossible de télécharger la facture.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>💳 Paiement de la Commande #{orderId}</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Sélection du mode de paiement */}
      <div className="mb-4">
        <h4>Mode de paiement</h4>
        <select 
          className="form-control"
          value={paymentType}
          onChange={(e) => setPaymentType(e.target.value)}
        >
          <option value="COMPTANT">Paiement Comptant</option>
          <option value="CREDIT">Paiement Crédit</option>
        </select>
      </div>

      {/* Sélection du pays */}
      <div className="mb-4">
        <h4>Pays</h4>
        <select 
          className="form-control"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        >
          <option value="CM">🇨🇲 Cameroun</option>
          <option value="FR">🇫🇷 France</option>
          <option value="US">🇺🇸 États-Unis</option>
        </select>
      </div>

      {/* Bouton pour effectuer le paiement */}
      <button className="btn btn-success" onClick={makePayment}>💰 Effectuer le paiement</button>

      {/* Bouton de confirmation de paiement (visible après paiement) */}
      {payment && (
        <>
          <hr />
          <button className="btn btn-primary mt-3" onClick={confirmPayment}>✅ Confirmer le paiement</button>
          <button className="btn btn-secondary mt-3 ms-2" onClick={downloadInvoice}>⬇️ Télécharger la facture</button>
        </>
      )}

      {/* 🔙 Bouton retour */}
      <button className="btn btn-warning mt-4" onClick={() => navigate("/my-orders")}>🔙 Retour</button>
    </div>
  );
};

export default PaymentPage;
