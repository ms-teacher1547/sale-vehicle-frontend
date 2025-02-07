import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import "../styles/theme.css";

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
    <div className="container" style={{ padding: '2rem', backgroundColor: 'var(--background)' }}>
      <div style={{ 
        backgroundColor: 'var(--primary-dark)', 
        padding: '6rem 1rem', 
        marginBottom: '2rem',
        borderRadius: '0 0 20px 20px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ 
          color: 'var(--surface)', 
          marginBottom: '1rem', 
          textAlign: 'center', 
          fontSize: '2.5rem',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: '2px'
        }}>💳 Paiement</h2>
        <p style={{ 
          color: 'var(--accent)', 
          textAlign: 'center',
          fontSize: '1.1rem',
          marginBottom: '0'
        }}>Commande #{orderId}</p>
      </div>

      {error && (
        <div style={{
          backgroundColor: 'var(--error)',
          color: 'white',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1rem'
        }}>{error}</div>
      )}

      <div style={{ 
        maxWidth: '600px', 
        margin: '0 auto',
        backgroundColor: 'var(--surface)',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ 
            color: 'var(--primary-dark)', 
            fontWeight: 'bold',
            fontSize: '1.1rem',
            display: 'block',
            marginBottom: '0.5rem'
          }}>Type de Paiement</label>
          <select 
            style={{ 
              padding: '1rem',
              border: '2px solid var(--border)',
              borderRadius: '8px',
              width: '100%',
              backgroundColor: 'var(--background)',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              transition: 'border-color 0.3s ease'
            }} 
            value={paymentType} 
            onChange={(e) => setPaymentType(e.target.value)}>
            <option value="COMPTANT">💵 Paiement Comptant</option>
            <option value="CREDIT">💳 Paiement Crédit</option>
          </select>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ 
            color: 'var(--primary-dark)', 
            fontWeight: 'bold',
            fontSize: '1.1rem',
            display: 'block',
            marginBottom: '0.5rem'
          }}>Pays de Facturation</label>
          <input 
            type="text" 
            style={{ 
              padding: '1rem',
              border: '2px solid var(--border)',
              borderRadius: '8px',
              width: '100%',
              backgroundColor: 'var(--background)',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              transition: 'border-color 0.3s ease'
            }} 
            value={country} 
            onChange={(e) => setCountry(e.target.value)} 
            placeholder="Entrez votre pays"
          />
        </div>

        <button 
          className="btn-primary" 
          style={{ 
            width: '100%', 
            padding: '1.25rem',
            marginTop: '1rem',
            backgroundColor: loading ? 'var(--primary-light)' : 'var(--primary-dark)',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }} 
          onClick={handlePayment} 
          disabled={loading}>
          <span>{loading ? '⌛' : '💳'}</span>
          <span>{loading ? 'Traitement en cours...' : 'Procéder au Paiement'}</span>
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
