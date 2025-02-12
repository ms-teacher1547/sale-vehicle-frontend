import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
    Box, 
    Typography, 
    Container, 
    Paper, 
    Grid, 
    Button, 
    Chip, 
    Dialog,
    DialogTitle, 
    DialogContent, 
    DialogActions,
    Tooltip,
    IconButton,
    Snackbar,
    Alert,
    Fade,
    Zoom
} from '@mui/material';
import { 
    Business as BusinessIcon, 
    DirectionsCar as VehicleIcon,
    Add as AddIcon,
    Remove as RemoveIcon,
    Info as InfoIcon,
    CheckCircle as SuccessIcon,
    Error as ErrorIcon
} from '@mui/icons-material';

const AdminFleetProposalPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [companies, setCompanies] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [selectedVehicles, setSelectedVehicles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [selectedVehicleDetails, setSelectedVehicleDetails] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const companiesResponse = await axios.get('http://localhost:8081/api/companies/with-subsidiaries', { withCredentials: true });
                const vehiclesResponse = await axios.get('http://localhost:8081/api/catalog/vehicles', { withCredentials: true });
                
                setCompanies(companiesResponse.data);
                setVehicles(vehiclesResponse.data);
            } catch (err) {
                handleError('Impossible de charger les données');
            }
        };

        fetchData();
    }, []);

    const handleError = (message) => {
        setError(message);
        setSnackbarMessage(message);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
    };

    const handleVehicleSelect = (vehicle) => {
        const existingVehicle = selectedVehicles.find(v => v.id === vehicle.id);
        
        if (existingVehicle) {
            setSelectedVehicles(selectedVehicles.map(v => 
                v.id === vehicle.id 
                    ? { ...v, quantity: (v.quantity || 1) + 1 } 
                    : v
            ));
        } else {
            setSelectedVehicles([...selectedVehicles, { ...vehicle, quantity: 1 }]);
        }
    };

    const handleVehicleRemove = (vehicleId) => {
        const existingVehicle = selectedVehicles.find(v => v.id === vehicleId);
        
        if (existingVehicle && existingVehicle.quantity > 1) {
            setSelectedVehicles(selectedVehicles.map(v => 
                v.id === vehicleId 
                    ? { ...v, quantity: v.quantity - 1 } 
                    : v
            ));
        } else {
            setSelectedVehicles(selectedVehicles.filter(v => v.id !== vehicleId));
        }
    };

    const openVehicleDetails = (vehicle) => {
        setSelectedVehicleDetails(vehicle);
        setDetailsModalOpen(true);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');

        try {
            const proposalData = {
                vehicleIds: selectedVehicles.flatMap(v => 
                    Array(v.quantity).fill(v.id)
                ),
                numberOfVehicles: selectedVehicles.reduce((total, v) => total + v.quantity, 0),
                totalPrice: selectedVehicles.reduce((total, vehicle) => total + (vehicle.price * vehicle.quantity), 0),
                proposalStatus: 'EN_ATTENTE'
            };

            const response = await axios.post(`http://localhost:8081/api/fleet-proposals/company/${selectedCompany.id}`, proposalData, { 
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            setSelectedCompany(null);
            setSelectedVehicles([]);
            
            setSnackbarMessage('Proposition de flotte créée avec succès !');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (err) {
            console.error('Erreur détaillée :', err);
            
            if (err.response) {
                handleError(`Erreur : ${err.response.data || 'Impossible de créer la proposition'}`);
            } else if (err.request) {
                handleError('Aucune réponse du serveur');
            } else {
                handleError('Erreur de configuration de la requête');
            }
        } finally {
            setLoading(false);
        }
    };

    
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    return (
        <Box sx={{ 
            maxWidth: '1400px', 
            margin: '0 auto', 
            padding: '20px', 
            backgroundColor: '#f0f4f8', 
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'Roboto, Arial, sans-serif'
        }}>
            <Fade in={true} timeout={1000}>
                <Box 
                    sx={{ 
                        background: '#0B2447',
                        color: 'white',
                        padding: '40px 20px',
                        marginBottom: '30px',
                        borderRadius: '15px',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <BusinessIcon 
                        sx={{ 
                            fontSize: '3rem', 
                            marginBottom: '15px',
                            opacity: 0.8,
                            animation: 'pulse 2s infinite'
                        }} 
                    />
                    <Typography 
                        variant="h3" 
                        sx={{ 
                            fontWeight: 'bold',
                            marginBottom: '10px',
                            textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
                        }}
                    >
                        Création de Proposition de Flotte
                    </Typography>
                    <Typography 
                        variant="subtitle1" 
                        sx={{ 
                            opacity: 0.9,
                            maxWidth: '600px',
                            margin: '0 auto'
                        }}
                    >
                        Sélectionnez une entreprise et choisissez les véhicules pour votre proposition de flotte
                    </Typography>
                </Box>
            </Fade>

            {error && (
                <Paper 
                    elevation={2} 
                    sx={{ 
                        backgroundColor: '#19376D', 
                        color: '#d32f2f', 
                        padding: '15px', 
                        marginBottom: '20px',
                        borderRadius: '8px'
                    }}
                >
                    <Typography variant="body1">{error}</Typography>
                </Paper>
            )}

            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Zoom in={true} timeout={500}>
                        <Paper 
                            elevation={3} 
                            sx={{ 
                                height: '100%', 
                                borderRadius: '15px',
                                overflow: 'hidden',
                                transition: 'transform 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.02)'
                                }
                            }}
                        >
                            <Box 
                                sx={{ 
                                    backgroundColor: '#19376D', 
                                    color: 'white', 
                                    padding: '15px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}
                            >
                                <BusinessIcon />
                                <Typography variant="h6">Sélection de l'Entreprise</Typography>
                            </Box>
                            <Box sx={{ p: 2 }}>
                                <Grid container spacing={2}>
                                    {companies.map(company => (
                                        <Grid item xs={12} key={company.id}>
                                            <Button 
                                                fullWidth
                                                variant={selectedCompany?.id === company.id ? 'contained' : 'outlined'}
                                                color="primary"
                                                onClick={() => setSelectedCompany(company)}
                                                sx={{ 
                                                    justifyContent: 'space-between',
                                                    padding: '12px',
                                                    borderRadius: '10px',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        transform: 'scale(1.02)',
                                                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                                    }
                                                }}
                                            >
                                                {company.name}
                                                <Chip 
                                                    icon={<BusinessIcon />} 
                                                    label={`${company.subsidiaries.length} filiales`} 
                                                    size="small" 
                                                    color="secondary" 
                                                />
                                            </Button>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        </Paper>
                    </Zoom>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Paper 
                        elevation={3} 
                        sx={{ 
                            borderRadius: '15px',
                            overflow: 'hidden',
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                                transform: 'scale(1.02)'
                            }
                        }}
                    >
                        <Box 
                            sx={{ 
                                backgroundColor: '#19376D', 
                                color: 'white', 
                                padding: '15px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}
                        >
                            <VehicleIcon />
                            <Typography variant="h6">Catalogue des Véhicules</Typography>
                        </Box>
                        <Box sx={{ p: 2 }}>
                            <Grid container spacing={3}>
                                {vehicles.map(vehicle => (
                                    <Grid item xs={12} sm={6} md={4} key={vehicle.id}>
                                        <Paper 
                                            variant="outlined"
                                            sx={{ 
                                                height: '100%', 
                                                display: 'flex', 
                                                flexDirection: 'column',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'scale(1.05)',
                                                    boxShadow: '0 6px 12px rgba(0,0,0,0.1)'
                                                }
                                            }}
                                        >
                                            <Box sx={{ p: 2, flexGrow: 1 }}>
                                                <Typography variant="h6" sx={{ color: '#1a73e8' }}>
                                                    {vehicle.name}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    Prix : {vehicle.price.toLocaleString()} €
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    Année : {vehicle.yearOfManufacture}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ 
                                                display: 'flex', 
                                                justifyContent: 'space-between', 
                                                padding: '10px',
                                                borderTop: '1px solid rgba(0,0,0,0.1)'
                                            }}>
                                                <Tooltip title="Détails du véhicule">
                                                    <IconButton onClick={() => openVehicleDetails(vehicle)}>
                                                        <InfoIcon color="primary" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Box>
                                                    <IconButton 
                                                        color="primary" 
                                                        onClick={() => handleVehicleRemove(vehicle.id)}
                                                        disabled={!selectedVehicles.some(v => v.id === vehicle.id)}
                                                    >
                                                        <RemoveIcon />
                                                    </IconButton>
                                                    <IconButton 
                                                        color="primary" 
                                                        onClick={() => handleVehicleSelect(vehicle)}
                                                    >
                                                        <AddIcon />
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </Paper>
                </Grid>

                {selectedVehicles.length > 0 && (
                    <Grid item xs={12}>
                        <Paper 
                            elevation={3} 
                            sx={{ 
                                borderRadius: '15px',
                                overflow: 'hidden',
                                transition: 'transform 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.02)'
                                }
                            }}
                        >
                            <Box 
                                sx={{ 
                                    backgroundColor: '#1a73e8', 
                                    color: 'white', 
                                    padding: '15px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}
                            >
                                <VehicleIcon />
                                <Typography variant="h6">Résumé de la Proposition</Typography>
                            </Box>
                            <Box sx={{ p: 2 }}>
                                <Grid container spacing={3}>
                                    {selectedVehicles.map(vehicle => (
                                        <Grid item xs={12} sm={6} md={4} key={vehicle.id}>
                                            <Paper 
                                                variant="outlined"
                                                sx={{
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        transform: 'scale(1.03)',
                                                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                                    }
                                                }}
                                            >
                                                <Box sx={{ 
                                                    p: 2, 
                                                    display: 'flex', 
                                                    justifyContent: 'space-between', 
                                                    alignItems: 'center' 
                                                }}>
                                                    <Box>
                                                        <Typography variant="subtitle1" sx={{ color: '#1a73e8' }}>
                                                            {vehicle.name}
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            Quantité : {vehicle.quantity}
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            Prix total : {(vehicle.price * vehicle.quantity).toLocaleString()} €
                                                        </Typography>
                                                    </Box>
                                                    <IconButton 
                                                        color="secondary" 
                                                        onClick={() => handleVehicleRemove(vehicle.id)}
                                                    >
                                                        <RemoveIcon />
                                                    </IconButton>
                                                </Box>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                                <Box sx={{ 
                                    marginTop: '20px', 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    padding: '15px',
                                    backgroundColor: '#f0f4f8',
                                    borderRadius: '10px',
                                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
                                }}>
                                    <Typography variant="h6" sx={{ color: '#1a73e8' }}>
                                        Total : {selectedVehicles.reduce((total, vehicle) => total + (vehicle.price * vehicle.quantity), 0).toLocaleString()} €
                                    </Typography>
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        startIcon={<VehicleIcon />}
                                        disabled={!selectedCompany || selectedVehicles.length === 0 || loading}
                                        onClick={handleSubmit}
                                        sx={{
                                            borderRadius: '10px',
                                            padding: '12px 24px',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'scale(1.05)',
                                                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                                            }
                                        }}
                                    >
                                        {loading ? 'Création en cours...' : 'Créer la Proposition'}
                                    </Button>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                )}
            </Grid>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                TransitionComponent={Fade}
            >
                <Alert 
                    onClose={handleSnackbarClose} 
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                    iconMapping={{
                        success: <SuccessIcon />,
                        error: <ErrorIcon />
                    }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            <Dialog 
                open={detailsModalOpen} 
                onClose={() => setDetailsModalOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '15px',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                    }
                }}
            >
                {selectedVehicleDetails && (
                    <>
                        <DialogTitle 
                            sx={{ 
                                backgroundColor: '#1a73e8', 
                                color: 'white',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            {selectedVehicleDetails.name}
                            <VehicleIcon />
                        </DialogTitle>
                        <DialogContent>
                            <Box sx={{ 
                                display: 'grid', 
                                gridTemplateColumns: '1fr 1fr', 
                                gap: '15px',
                                padding: '20px 0'
                            }}>
                                <Typography variant="body1">
                                    <strong>Prix :</strong> {selectedVehicleDetails.price.toLocaleString()} €
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Année :</strong> {selectedVehicleDetails.yearOfManufacture}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Type de carburant :</strong> {selectedVehicleDetails.fuelType}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Kilométrage :</strong> {selectedVehicleDetails.mileage.toLocaleString()} km
                                </Typography>
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button 
                                onClick={() => setDetailsModalOpen(false)} 
                                color="primary" 
                                variant="contained"
                                sx={{
                                    borderRadius: '10px',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.05)'
                                    }
                                }}
                            >
                                Fermer
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
};

export default AdminFleetProposalPage;
