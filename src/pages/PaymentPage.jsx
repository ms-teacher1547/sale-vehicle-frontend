import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

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
      return;
    }
  }, [user, navigate]);

  // 🔹 Fonction pour traiter le paiement
  const handlePayment = async () => {
    if (!paymentType || !country) {
      setError("Veuillez sélectionner un type de paiement et un pays.");
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

    setLoading(true);

    if (confirmResult.isConfirmed) {
      // 🔥 L'utilisateur a confirmé => Appel de l'API pour effectuer le paiement
      try {
        await axios.post(`${API_URL}/`, { paymentType, country }, { withCredentials: true });

        // 🔥 Après création du paiement, confirmation automatique
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
    } else {
      // 🔥 L'utilisateur a annulé => Rejet du paiement
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
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2>💳 Paiement de la Commande #{orderId}</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-3">
        <label>Type de Paiement :</label>
        <select className="form-control" value={paymentType} onChange={(e) => setPaymentType(e.target.value)}>
          <option value="COMPTANT">Comptant</option>
          <option value="CREDIT">Crédit</option>
        </select>
      </div>

      <div className="mb-3">
        <label>Pays :</label>
        <input type="text" className="form-control" value={country} onChange={(e) => setCountry(e.target.value)} />
      </div>

      <button className="btn btn-primary" onClick={handlePayment} disabled={loading}>
        {loading ? "⌛ Traitement..." : "💳 Payer"}
      </button>
    </div>
  );
};

export default PaymentPage;
