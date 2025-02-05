import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:8081/api/payments";

const MyInvoices = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || !user.customer) return;
    fetchInvoices();
  }, [user]);

  // 🔹 Récupérer les factures de l'utilisateur
  const fetchInvoices = async () => {
    try {
      const response = await axios.get(`${API_URL}/my-invoices`, { withCredentials: true });
      setInvoices(response.data);
    } catch (error) {
      console.error("❌ Erreur lors du chargement des factures :", error);
      setError("Impossible de charger vos factures.");
    }
  };

  // 🔹 Télécharger une facture PDF
  const downloadInvoice = async (invoiceId) => {
    try {
      const response = await axios.get(`${API_URL}/invoice/download/${invoiceId}`, {
        responseType: "blob",
        withCredentials: true
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Facture_${invoiceId}.pdf`);
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
      <h2>📜 Mes Factures</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {invoices.length === 0 ? (
        <p>Aucune facture disponible.</p>
      ) : (
        <ul className="list-group">
          {invoices.map((invoice) => (
            <li key={invoice.id} className="list-group-item">
              <strong>{invoice.title}</strong> - 📄 {invoice.filename}
              <button
                className="btn btn-success btn-sm ms-2"
                onClick={() => downloadInvoice(invoice.id)}
              >
                ⬇️ Télécharger
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyInvoices;
