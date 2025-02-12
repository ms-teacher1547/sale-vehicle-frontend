import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
    Box, 
    Typography, 
    Container, 
    Paper, 
    Grid, 
    Button, 
    Snackbar,
    Alert,
    IconButton,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Menu,
    MenuItem,
} from '@mui/material';
import { Edit as EditIcon, DirectionsCar as VehicleIcon } from '@mui/icons-material';
import './FleetProposalPage.css';

const API_FLEET_PROPOSAL_URL = "http://localhost:8081/api/fleet-proposals";

const FleetProposalPage = () => {
    const { user } = useAuth();
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedProposal, setSelectedProposal] = useState(null);
    const [vehicleDetails, setVehicleDetails] = useState([]);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

    useEffect(() => {
        const fetchProposals = async () => {
            if (!user || user.customer.type !== "COMPANY") {
                setError("Vous n'avez pas les permissions nécessaires");
                setLoading(false);
                return;
            }
            try {
                const { data } = await axios.get(`${API_FLEET_PROPOSAL_URL}/company/${user.customer.id}`, { withCredentials: true });
                setProposals(data);
            } catch (error) {
                setError("Impossible de charger les propositions");
            } finally {
                setLoading(false);
            }
        };
        fetchProposals();
    }, [user]);

    const handleClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleMenuOpen = (event, proposal) => {
        setAnchorEl(event.currentTarget);
        setSelectedProposal(proposal);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedProposal(null);
    };

    const handleDetailsOpen = async (proposal) => {
        try {
            const response = await axios.get(`${API_FLEET_PROPOSAL_URL}/${proposal.id}`, { withCredentials: true });
            setVehicleDetails(response.data.vehicleDetails);
            setDetailsDialogOpen(true);
        } catch (error) {
            console.error('Erreur lors de la récupération des détails des véhicules :', error);
            setSnackbar({ open: true, message: "Erreur lors de la récupération des détails", severity: 'error' });
        }
    };

    const handleDetailsClose = () => {
        setDetailsDialogOpen(false);
    };

    const changeStatus = async (id) => {
        try {
            await axios.put(`${API_FLEET_PROPOSAL_URL}/${id}/status`, null, { params: { newStatus: 'REJETE' }, withCredentials: true });
            setSnackbar({ open: true, message: `Proposition rejetée avec succès`, severity: 'success' });
        } catch (error) {
            setSnackbar({ open: true, message: "Impossible de mettre à jour le statut", severity: 'error' });
        }
    };

    const addToCart = async (id) => {
        try {
            const response = await axios.get(`${API_FLEET_PROPOSAL_URL}/${id}`, { withCredentials: true });
            const vehicles = response.data.vehicleDetails;
            if (!vehicles || vehicles.length === 0) {
                setSnackbar({ open: true, message: "Aucun véhicule trouvé pour cette proposition", severity: 'error' });
                return;
            }
            for (const vehicle of vehicles) {
                await axios.post(`http://localhost:8081/api/cart/add`, { vehicleId: vehicle.id, options: [], quantity: 1 }, { withCredentials: true });
                setSnackbar({ open: true, message: `Véhicule ${vehicle.id} ajouté au panier`, severity: 'success' });
            }
            handleMenuClose();
        } catch (error) {
            console.error('Erreur lors de l ajout au panier :', error);
            setSnackbar({ open: true, message: "Erreur lors de l'ajout au panier", severity: 'error' });
        }
    };

    return (
        <Container className="fleet-proposal">
            <Typography variant="h4" className="proposal-title">Fleet Proposal</Typography>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="70vh">
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Typography color="error" align="center">{error}</Typography>
            ) : (
                <Grid container spacing={3}>
                    {proposals.map(proposal => (
                        <Grid item xs={12} md={6} key={proposal.id}>
                            <Paper className="proposal-details">
                                <Typography variant="h6" className="proposal-title">Informations de la Proposition #{proposal.id} ✨</Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>Prix total: {proposal.totalPrice} €</Typography>
                                <Button variant="contained" color="secondary" onClick={(event) => handleMenuOpen(event, proposal)} sx={{ mr: 1, backgroundColor: '#ff9800', '&:hover': { backgroundColor: '#f57c20' } }}>
                                    Changer le Statut
                                </Button>
                                <Button variant="contained" color="primary" onClick={() => handleDetailsOpen(proposal)} sx={{ mr: 1 }}>
                                    Voir Détails
                                </Button>
                                <Button variant="contained" color="primary" onClick={() => addToCart(proposal.id)}>
                                    Ajouter au Panier
                                </Button>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            )}
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={snackbar.severity}>{snackbar.message}</Alert>
            </Snackbar>
            <Dialog open={detailsDialogOpen} onClose={handleDetailsClose} className="vehicle-modal">
                <DialogTitle>Détails des Véhicules</DialogTitle>
                <DialogContent>
                    {vehicleDetails.map(vehicle => (
                        <Box key={vehicle.id} sx={{ mb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }} className="vehicles-title">{vehicle.name}</Typography>
                            <Typography variant="body2" className="vehicle-list">Prix: {vehicle.price} €</Typography>
                            <Typography variant="body2" className="vehicle-list">Année: {vehicle.yearOfManufacture}</Typography>
                            <Typography variant="body2" className="vehicle-list">Type de carburant: {vehicle.fuelType}</Typography>
                        </Box>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDetailsClose} color="primary">Fermer</Button>
                </DialogActions>
            </Dialog>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={() => changeStatus(selectedProposal.id)}><VehicleIcon /> Accepter</MenuItem>
                <MenuItem onClick={() => changeStatus(selectedProposal.id)}><VehicleIcon /> Rejeter</MenuItem>
                <MenuItem onClick={() => addToCart(selectedProposal.id)}>Ajouter au Panier</MenuItem>
            </Menu>
        </Container>
    );
};

export default FleetProposalPage;