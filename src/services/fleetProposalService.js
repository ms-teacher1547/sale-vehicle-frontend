import axios from 'axios';

const API_URL = "http://localhost:8081/api/fleet-proposals";

const FleetProposalService = {
    // Créer une proposition de flotte pour une entreprise
    createFleetProposal: async (companyId, proposalData) => {
        try {
            const response = await axios.post(`${API_URL}/company/${companyId}`, proposalData, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la création de la proposition de flotte :', error);
            throw error;
        }
    },

    // Récupérer les propositions de flotte pour une entreprise
    getFleetProposalsForCompany: async (companyId) => {
        try {
            const response = await axios.get(`${API_URL}/company/${companyId}`, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des propositions de flotte :', error);
            throw error;
        }
    },

    // Récupérer une proposition de flotte par son ID
    getFleetProposalById: async (proposalId) => {
        try {
            const response = await axios.get(`${API_URL}/${proposalId}`, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération de la proposition de flotte :', error);
            throw error;
        }
    },

    // Mettre à jour le statut d'une proposition de flotte
    updateProposalStatus: async (proposalId, newStatus) => {
        try {
            const response = await axios.put(`${API_URL}/${proposalId}/status`, null, {
                params: { newStatus },
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la mise à jour du statut de la proposition :', error);
            throw error;
        }
    },

    // Récupérer les propositions par statut (admin uniquement)
    getProposalsByStatus: async (status) => {
        try {
            const response = await axios.get(`${API_URL}/status/${status}`, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des propositions par statut :', error);
            throw error;
        }
    }
};

export default FleetProposalService;
