import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import "../styles/PaymentPage.css"; // Ajout d'un fichier CSS pour la mise en page

const API_URL = "http://localhost:8081/api/payments";

const PaymentPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [paymentType, setPaymentType] = useState("COMPTANT");
  const [country, setCountry] = useState("CAMEROUN");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || !user.customer) {
      navigate("/login");
    }
  }, [user, navigate]);

  // 🔹 Fonction pour traiter le paiement
  const handlePayment = async () => {
    if (!paymentType || !country) {
      setError("⚠️ Veuillez sélectionner un type de paiement et un pays.");
      return;
    }

    const confirmResult = await Swal.fire({
      title: "💳 Confirmer le paiement ?",
      text: `Type : ${paymentType} | Pays : ${country}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, payer !",
      cancelButtonText: "Annuler le paiement",
    });

    if (!confirmResult.isConfirmed) {
      try {
        await axios.put(`${API_URL}/reject`, {}, { withCredentials: true });

        await Swal.fire({
          title: "🚫 Paiement annulé",
          text: "Votre paiement a été annulé.",
          icon: "info",
          confirmButtonText: "OK",
        });

        navigate("/my-orders");
      } catch (error) {
        console.error("❌ Erreur lors du rejet du paiement :", error);
        setError("Impossible d'annuler le paiement.");
      }
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${API_URL}/`, { paymentType, country }, { withCredentials: true });
      await axios.put(`${API_URL}/confirm`, {}, { withCredentials: true });

      await Swal.fire({
        title: "✅ Paiement confirmé !",
        text: "Votre paiement a été validé et votre facture générée.",
        icon: "success",
        confirmButtonText: "Voir mes factures",
      });

      navigate("/my-invoices");
    } catch (error) {
      console.error("❌ Erreur lors du paiement :", error);
      setError("Impossible d'effectuer le paiement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-container">
      <h2>💳 Paiement de la Commande #{orderId}</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="form-group">
        <label>Type de Paiement :</label>
        <select className="form-control" value={paymentType} onChange={(e) => setPaymentType(e.target.value)}>
          <option value="COMPTANT">Comptant</option>
          <option value="CREDIT">Crédit</option>
        </select>
      </div>

      <div className="form-group">
        <label>Pays :</label>
        <input type="text" className="form-control" value={country} onChange={(e) => setCountry(e.target.value)} />
      </div>

      <button className="btn btn-pay" onClick={handlePayment} disabled={loading}>
        {loading ? "⌛ Traitement..." : "💳 Payer"}
      </button>
    </div>
  );
};

export default PaymentPage;
