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
    Chip,
} from '@mui/material';
import { 
    Edit as EditIcon, 
    DirectionsCar as VehicleIcon,
    CheckCircle as CheckIcon,
    Cancel as CancelIcon,
    ShoppingCart as CartIcon,
    Info as InfoIcon
} from '@mui/icons-material';
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
                console.log('Propositions récupérées:', data);
                console.log('Données des propositions:', data);
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
        <Box sx={{ 
            backgroundColor: 'var(--background)',
            minHeight: '100vh',
            py: 9,
            position: 'relative'
        }}>
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '300px',
                    background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary-main) 100%)',
                    opacity: 0.1,
                    zIndex: 0
                }}
            />
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ 
                    backgroundColor: 'var(--primary-dark)',
                    borderRadius: '24px',
                    p: { xs: 3, md: 5 },
                    mb: 6,
                    color: 'white',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 60%)',
                        zIndex: 1
                    }
                }}>
                    <Box sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(45deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 100%)',
                        zIndex: 1
                    }}/>
                    <Box sx={{ position: 'relative', zIndex: 2 }}>
                        <Typography 
                            variant="h3" 
                            sx={{ 
                                fontWeight: 700,
                                mb: 2,
                                letterSpacing: '0.5px',
                                fontSize: { xs: '2rem', md: '2.5rem' },
                                textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }}
                        >
                            Propositions de Flotte
                        </Typography>
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                fontWeight: 400,
                                opacity: 0.9,
                                maxWidth: '600px',
                                mx: 'auto',
                                lineHeight: 1.6,
                                fontSize: { xs: '1rem', md: '1.1rem' }
                            }}
                        >
                            Gérez vos propositions de flotte de véhicules en toute simplicité
                        </Typography>
                    </Box>
                </Box>

                {loading ? (
                    <Box display="flex" flexDirection="column" alignItems="center" sx={{ height: '50vh', justifyContent: 'center' }}>
                        <CircularProgress sx={{ color: 'var(--primary-main)', mb: 2 }} />
                        <Typography variant="body1" color="text.secondary">
                            Chargement de vos propositions...
                        </Typography>
                    </Box>
                ) : error ? (
                    <Paper sx={{ 
                        p: 4, 
                        textAlign: 'center',
                        backgroundColor: 'var(--surface)',
                        borderRadius: '16px',
                        border: '1px solid var(--border)',
                        maxWidth: '600px',
                        mx: 'auto'
                    }}>
                        <Typography color="error" variant="h6" gutterBottom>{error}</Typography>
                        <Typography color="text.secondary" variant="body1">
                            Veuillez réessayer plus tard ou contacter le support si le problème persiste.
                        </Typography>
                    </Paper>
                ) : (
                    <Grid container spacing={3}>
                        {proposals.map(proposal => (
                             <Grid item xs={12} md={6} key={proposal.id}>
                                <Paper sx={{
                                    p: 4,
                                    borderRadius: '16px',
                                    backgroundColor: 'var(--surface)',
                                    border: '1px solid var(--border)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
                                    }
                                }}>
                                    <Box sx={{ mb: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                            <Typography variant="h6" sx={{ 
                                                color: 'var(--text-primary)',
                                                fontWeight: 600,
                                            }}>
                                                Proposition #{proposal.id}
                                            </Typography>
                                            <Chip
                                                label={proposal.status}
                                                color={proposal.status === 'ACCEPTE' ? 'success' : proposal.status === 'REJETE' ? 'error' : 'default'}
                                                size="small"
                                                sx={{ 
                                                    borderRadius: '8px',
                                                    textTransform: 'uppercase',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    letterSpacing: '0.5px'
                                                }}
                                            />
                                        </Box>
                                        <Typography variant="h4" sx={{ 
                                            color: 'var(--primary-main)',
                                            fontWeight: 700,
                                            mb: 3
                                        }}>
                                            {proposal.totalPrice.toLocaleString()} FCFA

                                        </Typography>
                                        <Typography variant="body1" sx={{ color: 'black', mb: 2 }}>
                                            Statut : {proposal.status}
                                        </Typography>
                                    </Box>
                                    
                                    <Box sx={{ 
                                        display: 'flex',
                                        gap: 2,
                                        flexWrap: 'wrap'
                                    }}>
                                        <Button
                                            variant="outlined"
                                            startIcon={<InfoIcon />}
                                            onClick={() => handleDetailsOpen(proposal)}
                                            sx={{
                                                borderColor: 'var(--primary-main)',
                                                color: 'var(--primary-main)',
                                                borderWidth: '2px',
                                                '&:hover': {
                                                    borderColor: 'var(--primary-dark)',
                                                    backgroundColor: 'rgba(44, 65, 89, 0.04)',
                                                    borderWidth: '2px'
                                                }
                                            }}
                                        >
                                            Détails
                                        </Button>
                                        <Button
                                            variant="contained"
                                            startIcon={<EditIcon />}
                                            onClick={(event) => handleMenuOpen(event, proposal)}
                                            sx={{
                                                backgroundColor: 'var(--primary-main)',
                                                fontWeight: 600,
                                                '&:hover': {
                                                    backgroundColor: 'var(--primary-dark)',
                                                    transform: 'translateY(-2px)',
                                                    transition: 'all 0.2s ease'
                                                }
                                            }}
                                        >
                                            Statut
                                        </Button>
                                        <Button
                                            variant="contained"
                                            startIcon={<CartIcon />}
                                            onClick={() => addToCart(proposal.id)}
                                            sx={{
                                                backgroundColor: 'var(--success)',
                                                fontWeight: 600,
                                                '&:hover': {
                                                    backgroundColor: '#058558',
                                                    transform: 'translateY(-2px)',
                                                    transition: 'all 0.2s ease'
                                                }
                                            }}
                                        >
                                            Ajouter au Panier
                                        </Button>
                                    </Box>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                )}

                <Dialog 
                    open={detailsDialogOpen} 
                    onClose={handleDetailsClose}
                    maxWidth="md"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: '20px',
                            backgroundColor: 'var(--surface)',
                            backgroundImage: 'radial-gradient(at top right, rgba(255,255,255,0.1), transparent)'
                        }
                    }}
                >
                    <DialogTitle sx={{ 
                        borderBottom: '1px solid var(--border)',
                        px: 4,
                        py: 3,
                        backgroundColor: 'var(--primary-dark)',
                        color: 'white'
                    }}>
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                            Détails des Véhicules
                        </Typography>
                    </DialogTitle>
                    <DialogContent sx={{ p: 4 }}>
                        <Grid container spacing={3}>
                            {vehicleDetails.map(vehicle => (
                                <Grid item xs={12} key={vehicle.id}>
                                    <Paper sx={{ 
                                        p: 3,
                                        borderRadius: '12px',
                                        border: '1px solid var(--border)',
                                        background: 'linear-gradient(to right, var(--surface), var(--background))',
                                        transition: 'transform 0.2s ease',
                                        '&:hover': {
                                            transform: 'translateX(4px)'
                                        }
                                    }}>
                                        <Typography variant="h6" sx={{ 
                                            fontWeight: 600,
                                            color: 'var(--text-primary)',
                                            mb: 2
                                        }}>
                                            {vehicle.name}
                                        </Typography>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} sm={4}>
                                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                                    Prix
                                                </Typography>
                                                <Typography variant="h6" color="var(--primary-main)" sx={{ fontWeight: 600 }}>
                                                    {vehicle.price.toLocaleString()} €
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                                    Année
                                                </Typography>
                                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                    {vehicle.yearOfManufacture}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                                    Carburant
                                                </Typography>
                                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                    {vehicle.fuelType}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 3, borderTop: '1px solid var(--border)' }}>
                        <Button 
                            onClick={handleDetailsClose}
                            variant="outlined"
                            sx={{
                                borderColor: 'var(--primary-main)',
                                color: 'var(--primary-main)',
                                borderWidth: '2px',
                                px: 4,
                                '&:hover': {
                                    borderColor: 'var(--primary-dark)',
                                    backgroundColor: 'rgba(44, 65, 89, 0.04)',
                                    borderWidth: '2px'
                                }
                            }}
                        >
                            Fermer
                        </Button>
                    </DialogActions>
                </Dialog>

                <Menu 
                    anchorEl={anchorEl} 
                    open={Boolean(anchorEl)} 
                    onClose={handleMenuClose}
                    PaperProps={{
                        sx: {
                            mt: 1,
                            borderRadius: '12px',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                            border: '1px solid var(--border)',
                            minWidth: '200px'
                        }
                    }}
                >
                    <MenuItem 
                        onClick={() => changeStatus(selectedProposal?.id)} 
                        sx={{ 
                            py: 1.5,
                            '&:hover': {
                                backgroundColor: 'var(--success-light)'
                            }
                        }}
                    >
                        <CheckIcon sx={{ mr: 2, color: 'var(--success)' }} />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            Accepter
                        </Typography>
                    </MenuItem>
                    <MenuItem 
                        onClick={() => changeStatus(selectedProposal?.id)} 
                        sx={{ 
                            py: 1.5,
                            '&:hover': {
                                backgroundColor: 'var(--error-light)'
                            }
                        }}
                    >
                        <CancelIcon sx={{ mr: 2, color: 'var(--error)' }} />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            Rejeter
                        </Typography>
                    </MenuItem>
                </Menu>

                <Snackbar 
                    open={snackbar.open} 
                    autoHideDuration={6000} 
                    onClose={handleClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert 
                        onClose={handleClose} 
                        severity={snackbar.severity}
                        sx={{ 
                            borderRadius: '12px',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                            border: '1px solid var(--border)',
                            '.MuiAlert-icon': {
                                fontSize: '1.5rem'
                            }
                        }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Container>
        </Box>
    );
};

export default FleetProposalPage;