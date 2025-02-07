import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/theme.css";

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
    <div className="container" style={{ padding: '2rem', backgroundColor: 'var(--background)' }}>
      <div style={{ 
        backgroundColor: 'var(--primary-dark)', 
        padding: '5rem 1rem', 
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
        }}>📜 Mes Factures</h2>
        <p style={{ 
          color: 'var(--accent)', 
          textAlign: 'center',
          fontSize: '1.1rem',
          marginBottom: '0'
        }}>Consultez et téléchargez vos factures</p>
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

      {invoices.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          backgroundColor: 'var(--surface)',
          borderRadius: '12px',
          marginTop: '2rem'
        }}>
          <p style={{
            fontSize: '1.2rem',
            color: 'var(--text-secondary)',
            margin: '0'
          }}>Aucune facture disponible pour le moment.</p>
        </div>
      ) : (
        <div className="grid" style={{ gap: '1.5rem' }}>
          {invoices.map((invoice) => (
            <div key={invoice.id} style={{ 
              padding: '1.5rem', 
              backgroundColor: 'var(--surface)',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease',
              border: '1px solid var(--border)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
                borderBottom: '2px solid var(--accent)',
                paddingBottom: '0.5rem'
              }}>
                <h3 style={{
                  color: 'var(--primary-dark)',
                  margin: '0',
                  fontSize: '1.3rem',
                  fontWeight: 'bold'
                }}>{invoice.title}</h3>
                <span style={{
                  backgroundColor: 'var(--primary-light)',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.9rem'
                }}>📄 {invoice.filename}</span>
              </div>
              
              <button
                className="btn-primary"
                style={{ 
                  width: '100%',
                  padding: '1rem',
                  backgroundColor: 'var(--success)',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
                onClick={() => downloadInvoice(invoice.id)}
              >
                <span>⬇️</span>
                <span>Télécharger la facture</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyInvoices;
