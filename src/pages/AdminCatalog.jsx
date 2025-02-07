import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Spinner } from "react-bootstrap";
import { FaCar, FaTrash, FaEdit, FaSave, FaArrowLeft, FaSearch, FaList } from "react-icons/fa";
import "../styles/AdminCatalog.css";

const API_URL = "http://localhost:8081/api/catalog/vehicles";

const AdminCatalog = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      navigate("/");
    }
  }, [user, navigate]);

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vehicleType, setVehicleType] = useState("car");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [filterConfig, setFilterConfig] = useState({
    search: "",
    fuelType: "all",
    yearMin: "",
    yearMax: ""
  });
  const [newVehicle, setNewVehicle] = useState({
    name: "",
    price: "",
    stockQuantity: "",
    yearOfManufacture: "",
    fuelType: "essence", // Valeur par défaut pour le carburant
    mileage: "",
    numberOfDoors: "",
    hasStorageBox: false,
  });

  const [showModal, setShowModal] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getFilteredAndSortedVehicles = () => {
    let filteredVehicles = [...vehicles];

    // Apply filters
    if (filterConfig.search) {
      const searchLower = filterConfig.search.toLowerCase();
      filteredVehicles = filteredVehicles.filter(vehicle =>
        vehicle.name.toLowerCase().includes(searchLower)
      );
    }

    if (filterConfig.fuelType !== 'all') {
      filteredVehicles = filteredVehicles.filter(vehicle =>
        vehicle.fuelType === filterConfig.fuelType
      );
    }

    if (filterConfig.yearMin) {
      filteredVehicles = filteredVehicles.filter(vehicle =>
        vehicle.yearOfManufacture >= parseInt(filterConfig.yearMin)
      );
    }

    if (filterConfig.yearMax) {
      filteredVehicles = filteredVehicles.filter(vehicle =>
        vehicle.yearOfManufacture <= parseInt(filterConfig.yearMax)
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      filteredVehicles.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredVehicles;
  };

  const fetchVehicles = () => {
    setLoading(true);
    axios.get(API_URL)
      .then(response => {
        setVehicles(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("❌ Erreur lors du chargement des véhicules :", error);
        setLoading(false);
      });
  };

  const applyDiscount = () => {
    axios.put(`${API_URL}/discount`, {}, { withCredentials: true })
      .then(response => {
        setVehicles(response.data);
        alert("🎉 Réduction appliquée avec succès !");
      })
      .catch(error => console.error("❌ Erreur lors de l'application de la réduction :", error));
  };

  const handleInputChange = (e) => {
    setNewVehicle({ ...newVehicle, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    setNewVehicle({ ...newVehicle, hasStorageBox: e.target.checked });
  };

  const addVehicle = () => {
    const vehicleData = {
      name: newVehicle.name,
      price: Number(newVehicle.price),
      stockQuantity: Number(newVehicle.stockQuantity),
      yearOfManufacture: Number(newVehicle.yearOfManufacture),
      fuelType: newVehicle.fuelType,
      mileage: Number(newVehicle.mileage),
      ...(vehicleType === "car" ? { numberOfDoors: Number(newVehicle.numberOfDoors) } : { hasStorageBox: newVehicle.hasStorageBox }),
    };

    axios.post(`${API_URL}/${vehicleType}`, vehicleData, {
      withCredentials: true,
    })
    .then(response => {
      setVehicles([...vehicles, response.data]);
      resetForm();
      alert("✅ Véhicule ajouté avec succès !");
    })
    .catch(error => console.error("❌ Erreur lors de l'ajout :", error));
  };

  const resetForm = () => {
    setNewVehicle({
      name: "",
      price: "",
      stockQuantity: "",
      yearOfManufacture: "",
      fuelType: "essence", // Réinitialisation de la valeur carburant à "essence"
      mileage: "",
      numberOfDoors: "",
      hasStorageBox: false,
    });
  };

  const confirmDelete = (vehicle) => {
    setVehicleToDelete(vehicle);
    setShowModal(true);
  };

  const deleteVehicle = () => {
    if (!vehicleToDelete) return;

    axios.delete(`${API_URL}/${vehicleToDelete.id}`, {
      withCredentials: true,
    })
    .then(() => {
      setVehicles(vehicles.filter(vehicle => vehicle.id !== vehicleToDelete.id));
      setShowModal(false);
      alert("✅ Véhicule supprimé avec succès !");
    })
    .catch(error => console.error("❌ Erreur lors de la suppression :", error));
  };

  if (loading) return <Spinner animation="border" role="status" />;

  return (
    <div className="admin-container" style={{ padding: '5rem', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="row mb-4">
        <div className="col-12">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1.5rem',
            backgroundColor: 'white',
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '2rem'
          }}>
            <h2 style={{ margin: 0, color: '#2c3e50', fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FaCar style={{ color: '#3498db' }} /> Gestion des Véhicules
            </h2>

            <div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  className="btn btn-outline-primary" 
                  onClick={() => navigate("/catalog")}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    fontWeight: '500'
                  }}
                >
                  <FaArrowLeft /> Retour au Catalogue
                </button>
                <button 
                  className="btn btn-warning" 
                  onClick={applyDiscount}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    fontWeight: '500',
                    backgroundColor: '#f1c40f',
                    border: 'none',
                    color: '#2c3e50'
                  }}
                >
                  💰 Appliquer une réduction (-20%)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Formulaire d'ajout */}
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '2rem'
      }}>
        <h4 style={{ color: '#2c3e50', marginBottom: '1.5rem', fontSize: '1.5rem' }}>
          <FaCar style={{ marginRight: '10px' }} /> Ajouter un véhicule
        </h4>
        <select 
          className="form-control mb-3" 
          value={vehicleType} 
          onChange={(e) => setVehicleType(e.target.value)}
          style={{
            padding: '0.75rem',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            backgroundColor: '#f8f9fa'
          }}>
          <option value="car">🚗 Voiture</option>
          <option value="scooter">🛵 Scooter</option>
        </select>
        <input 
          type="text" 
          name="name" 
          placeholder="Nom" 
          value={newVehicle.name} 
          onChange={handleInputChange} 
          className="form-control mb-3" 
          style={{
            padding: '0.75rem',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}
        />
        <input type="number" name="price" placeholder="Prix (FCFA)" value={newVehicle.price} onChange={handleInputChange} className="form-control mb-2" />
        <input type="number" name="stockQuantity" placeholder="Quantité en stock" value={newVehicle.stockQuantity} onChange={handleInputChange} className="form-control mb-2" />
        <input type="number" name="yearOfManufacture" placeholder="Année" value={newVehicle.yearOfManufacture} onChange={handleInputChange} className="form-control mb-2" />
        
        {/* Choix du carburant */}
        <select 
          name="fuelType" 
          value={newVehicle.fuelType} 
          onChange={handleInputChange} 
          className="form-control mb-2">
          <option value="essence">Essence</option>
          <option value="electric">Électrique</option>

          <option value="diesel">Diesel</option>
        </select>

        {/* <input type="text" name="fuelType" placeholder="Carburant (Essence/Diesel)/ electric" value={newVehicle.fuelType} onChange={handleInputChange} className="form-control mb-2" />
        */}
        
        <input type="number" name="mileage" placeholder="Kilométrage" value={newVehicle.mileage} onChange={handleInputChange} className="form-control mb-2" />
        
        {vehicleType === "car" && (
          <input type="number" name="numberOfDoors" placeholder="Nombre de portes" value={newVehicle.numberOfDoors} onChange={handleInputChange} className="form-control mb-2" />
        )}

        {vehicleType === "scooter" && (
          <div className="form-check">
            <input className="form-check-input" type="checkbox" checked={newVehicle.hasStorageBox} onChange={handleCheckboxChange} />
            <label className="form-check-label">Top case (coffre de rangement)</label>
          </div>
        )}

        <button 
          className="btn btn-success mt-3" 
          onClick={addVehicle}
          style={{
            padding: '0.75rem 2rem',
            borderRadius: '8px',
            backgroundColor: '#2ecc71',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: '500',
            transition: 'all 0.3s ease'
          }}
        >
          <FaSave /> Ajouter
        </button>
      </div>

      {/* ✅ Filtres et recherche */}
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '2rem'
      }}>
        <h4 style={{ color: '#2c3e50', marginBottom: '1.5rem', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaSearch style={{ color: '#3498db' }} /> Filtres
        </h4>
        <div className="row g-3">
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Rechercher..."
              value={filterConfig.search}
              onChange={(e) => setFilterConfig({ ...filterConfig, search: e.target.value })}
            />
          </div>
          <div className="col-md-3">
            <select
              className="form-control"
              value={filterConfig.fuelType}
              onChange={(e) => setFilterConfig({ ...filterConfig, fuelType: e.target.value })}
            >
              <option value="all">Tous les carburants</option>
              <option value="essence">Essence</option>
              <option value="electric">Électrique</option>
              <option value="diesel">Diesel</option>
            </select>
          </div>
          <div className="col-md-3">
            <input
              type="number"
              className="form-control"
              placeholder="Année min"
              value={filterConfig.yearMin}
              onChange={(e) => setFilterConfig({ ...filterConfig, yearMin: e.target.value })}
            />
          </div>
          <div className="col-md-3">
            <input
              type="number"
              className="form-control"
              placeholder="Année max"
              value={filterConfig.yearMax}
              onChange={(e) => setFilterConfig({ ...filterConfig, yearMax: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* ✅ Liste des véhicules */}
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h4 style={{ color: '#2c3e50', marginBottom: '1.5rem', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaList style={{ color: '#3498db' }} /> Véhicules existants
        </h4>
        <div className="table-responsive">
          <table className="table table-hover" style={{ marginBottom: 0 }}>
        <thead style={{ backgroundColor: '#f8f9fa' }}>
          <tr>
            <th onClick={() => requestSort('name')} style={{ cursor: 'pointer' }}>
              Nom {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
            </th>
            <th onClick={() => requestSort('price')} style={{ cursor: 'pointer' }}>
              Prix {sortConfig.key === 'price' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
            </th>
            <th onClick={() => requestSort('yearOfManufacture')} style={{ cursor: 'pointer' }}>
              Année {sortConfig.key === 'yearOfManufacture' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
            </th>
            <th onClick={() => requestSort('fuelType')} style={{ cursor: 'pointer' }}>
              Carburant {sortConfig.key === 'fuelType' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
            </th>
            <th onClick={() => requestSort('mileage')} style={{ cursor: 'pointer' }}>
              Kilométrage {sortConfig.key === 'mileage' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
            </th>
            <th onClick={() => requestSort('stockQuantity')} style={{ cursor: 'pointer' }}>
              Quantité {sortConfig.key === 'stockQuantity' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {getFilteredAndSortedVehicles().map(vehicle => (
            <tr key={vehicle.id}>
              <td>{vehicle.name}</td>
              <td>{vehicle.price} FCFA</td>
              <td>{vehicle.yearOfManufacture}</td>
              <td>{vehicle.fuelType === "essence" ? "Essence" : "Électrique"}</td>
              <td>{vehicle.mileage} km</td>
              <td>{vehicle.stockQuantity}</td>
              <td>
                <button 
                  className="btn btn-danger btn-sm" 
                  onClick={() => confirmDelete(vehicle)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    backgroundColor: '#e74c3c',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <FaTrash /> Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ Fenêtre modale pour confirmation */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation de suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Voulez-vous vraiment supprimer <strong>{vehicleToDelete?.name}</strong> ?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Annuler</Button>
          <Button variant="danger" onClick={deleteVehicle}><FaTrash /> Supprimer</Button>
        </Modal.Footer>
      </Modal>
    </div>
      </div>
    </div>
  );
};

export default AdminCatalog;
