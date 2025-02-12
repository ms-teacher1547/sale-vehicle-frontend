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

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);

  const [editingVehicle, setEditingVehicle] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const addVehicle = async () => {
    const formData = new FormData();

    // Convertir l'objet JavaScript en JSON
    const vehicleJSON = JSON.stringify({
        name: newVehicle.name,
        price: Number(newVehicle.price),
        stockQuantity: Number(newVehicle.stockQuantity),
        yearOfManufacture: Number(newVehicle.yearOfManufacture),
        fuelType: newVehicle.fuelType,
        mileage: Number(newVehicle.mileage),
        ...(vehicleType === "car"
            ? { numberOfDoors: Number(newVehicle.numberOfDoors) }
            : { hasStorageBox: newVehicle.hasStorageBox }),
    });

    // Ajouter le JSON en tant que blob
    formData.append("vehicle", new Blob([vehicleJSON], { type: "application/json" }));

    if (imageFile) {
        formData.append("image", imageFile);
    }

    // ✅ Vérifier les données envoyées
    for (let pair of formData.entries()) {
        console.log("📤 Clé:", pair[0], "➡️ Valeur:", pair[1]);
    }

    try {
        const response = await axios.post(`${API_URL}/${vehicleType}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
        });

        console.log("✅ Réponse du serveur :", response.data);
        setVehicles([...vehicles, response.data]);
        resetForm();
        alert("✅ Véhicule ajouté avec succès !");
    } catch (error) {
        console.error("❌ Erreur lors de l'ajout :", error.response ? error.response.data : error);
    }
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
    setImageFile(null);
    setImagePreview(null);
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

  const handleEdit = (vehicle) => {
    console.log("Vehicle to edit:", vehicle);  // Debug log
    // Determine the vehicle type based on the presence of type-specific fields
    const vehicleType = vehicle.numberOfDoors !== undefined ? "CAR" : 
                       vehicle.hasStorageBox !== undefined ? "SCOOTER" : "CAR"; // Default to CAR if unknown
    
    setEditingVehicle({
      ...vehicle,
      yearOfManufacture: vehicle.yearOfManufacture || "",
      fuelType: vehicle.fuelType || "essence",
      mileage: vehicle.mileage || 0,
      stockQuantity: vehicle.stockQuantity || 0,
      vehicle_type: vehicleType,  // Set the vehicle type explicitly
      numberOfDoors: vehicleType === "CAR" ? (vehicle.numberOfDoors || "") : undefined,
      hasStorageBox: vehicleType === "SCOOTER" ? (vehicle.hasStorageBox || false) : undefined
    });
    setShowEditModal(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingVehicle(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleUpdate = async () => {
    try {
      // Create the vehicle data with the correct type structure
      const vehicleData = {
        id: editingVehicle.id,
        name: editingVehicle.name,
        price: Number(editingVehicle.price),
        stockQuantity: Number(editingVehicle.stockQuantity),
        yearOfManufacture: Number(editingVehicle.yearOfManufacture),
        mileage: Number(editingVehicle.mileage),
        fuelType: editingVehicle.fuelType,
        animationUrl: editingVehicle.animationUrl,
        imageUrl: editingVehicle.imageUrl,
        vehicle_type: "CAR",  // Set this explicitly for cars
        numberOfDoors: Number(editingVehicle.numberOfDoors || 0)
      };

      console.log("Données envoyées pour la mise à jour:", vehicleData);

      const response = await axios.put(
        `${API_URL}/${editingVehicle.id}/update`,
        vehicleData,
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        setVehicles(vehicles.map(v => 
          v.id === editingVehicle.id ? response.data : v
        ));
        
        setShowEditModal(false);
        setEditingVehicle(null);
        alert("✅ Véhicule mis à jour avec succès !");
      } else {
        throw new Error("Pas de données reçues du serveur");
      }
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour :", error.response?.data || error.message);
      alert("❌ Erreur lors de la mise à jour du véhicule : " + 
            (error.response?.data?.message || error.message || "Erreur inconnue"));
    }
  };

  if (loading) return <Spinner animation="border" role="status" />;

  return (
    <div className="admin-catalog-container">
      <div className="admin-header">
        <h1><FaCar /> Gestion du Catalogue</h1>
        <div className="header-actions">
          <button className="premium-button" onClick={() => navigate(-1)}>
            <FaArrowLeft /> Retour
          </button>
          <button className="premium-button success" onClick={applyDiscount}>
            Appliquer les réductions
          </button>
        </div>
      </div>

      <div className="admin-filters">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher un véhicule..."
            value={filterConfig.search}
            onChange={(e) => setFilterConfig({ ...filterConfig, search: e.target.value })}
          />
        </div>
        <div className="filter-group">
          <select
            value={filterConfig.fuelType}
            onChange={(e) => setFilterConfig({ ...filterConfig, fuelType: e.target.value })}
          >
            <option value="all">Tous les carburants</option>
            <option value="essence">Essence</option>
            <option value="diesel">Diesel</option>
            <option value="electric">Électrique</option>
            <option value="hybrid">Hybride</option>
          </select>
          <input
            type="number"
            placeholder="Année min"
            value={filterConfig.yearMin}
            onChange={(e) => setFilterConfig({ ...filterConfig, yearMin: e.target.value })}
          />
          <input
            type="number"
            placeholder="Année max"
            value={filterConfig.yearMax}
            onChange={(e) => setFilterConfig({ ...filterConfig, yearMax: e.target.value })}
          />
        </div>
      </div>

      <div className="admin-content">
        <div className="add-vehicle-section">
          <h2>Ajouter un nouveau véhicule</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Type de véhicule</label>
              <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}>
                <option value="car">Voiture</option>
                <option value="scooter">Scooter</option>
              </select>
            </div>
            <div className="form-group">
              <label>Nom</label>
              <input
                type="text"
                name="name"
                value={newVehicle.name}
                onChange={handleInputChange}
                placeholder="Nom du véhicule"
              />
            </div>
            <div className="form-group">
              <label>Prix</label>
              <input
                type="number"
                name="price"
                value={newVehicle.price}
                onChange={handleInputChange}
                placeholder="Prix"
              />
            </div>
            <div className="form-group">
              <label>Quantité en stock</label>
              <input
                type="number"
                name="stockQuantity"
                value={newVehicle.stockQuantity}
                onChange={handleInputChange}
                placeholder="Quantité"
              />
            </div>
            <div className="form-group">
              <label>Année de fabrication</label>
              <input
                type="number"
                name="yearOfManufacture"
                value={newVehicle.yearOfManufacture}
                onChange={handleInputChange}
                placeholder="Année"
              />
            </div>
            <div className="form-group">
              <label>Type de carburant</label>
              <select name="fuelType" value={newVehicle.fuelType} onChange={handleInputChange}>
                <option value="essence">Essence</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Électrique</option>
                <option value="hybrid">Hybride</option>
              </select>
            </div>
            <div className="form-group">
              <label>Kilométrage</label>
              <input
                type="number"
                name="mileage"
                value={newVehicle.mileage}
                onChange={handleInputChange}
                placeholder="Kilométrage"
              />
            </div>
            {vehicleType === "car" ? (
              <div className="form-group">
                <label>Nombre de portes</label>
                <input
                  type="number"
                  name="numberOfDoors"
                  value={newVehicle.numberOfDoors}
                  onChange={handleInputChange}
                  placeholder="Nombre de portes"
                />
              </div>
            ) : (
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="hasStorageBox"
                    checked={newVehicle.hasStorageBox}
                    onChange={handleCheckboxChange}
                  />
                  Coffre de rangement
                </label>
              </div>
            )}
            <div className="form-group image-upload">
              <label>Image du véhicule</label>
              <input
                type="file"
                onChange={handleImageChange}
                accept="image/*"
              />
              {imagePreview && (
                <img src={imagePreview} alt="Aperçu" className="image-preview" />
              )}
            </div>
          </div>
          <div className="form-actions">
            <button className="premium-button" onClick={resetForm}>Réinitialiser</button>
            <button className="premium-button success" onClick={addVehicle}>
              <FaSave /> Ajouter le véhicule
            </button>
          </div>
        </div>

        <div className="vehicles-list-section">
          <h2>Liste des véhicules</h2>
          {loading ? (
            <div className="loading-spinner">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Chargement...</span>
              </Spinner>
            </div>
          ) : (
            <div className="vehicles-grid">
              {getFilteredAndSortedVehicles().map((vehicle) => (
                <div key={vehicle.id} className="vehicle-card">
                  <div className="vehicle-image">
                    {vehicle.imageUrl ? (
                      <img src={vehicle.imageUrl} alt={vehicle.name} />
                    ) : (
                      <div className="no-image">
                        <FaCar />
                        <span>Pas d'image</span>
                      </div>
                    )}
                  </div>
                  <div className="vehicle-info">
                    <h3>{vehicle.name}</h3>
                    <div className="info-grid">
                      <span>Prix: {vehicle.price} €</span>
                      <span>Stock: {vehicle.stockQuantity}</span>
                      <span>Année: {vehicle.yearOfManufacture}</span>
                      <span>Carburant: {vehicle.fuelType}</span>
                    </div>
                  </div>
                  <div className="vehicle-actions">
                    <button className="icon-button edit" onClick={() => handleEdit(vehicle)}>
                      <FaEdit />
                    </button>
                    <button className="icon-button delete" onClick={() => confirmDelete(vehicle)}>
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation de suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir supprimer ce véhicule ?
          {vehicleToDelete && (
            <div className="delete-confirmation-details">
              <p><strong>Nom:</strong> {vehicleToDelete.name}</p>
              <p><strong>Prix:</strong> {vehicleToDelete.price} €</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={deleteVehicle}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Modifier le véhicule</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingVehicle && (
            <div className="edit-form">
              <div className="form-group">
                <label>Nom</label>
                <input
                  type="text"
                  name="name"
                  value={editingVehicle.name}
                  onChange={handleEditInputChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Prix</label>
                <input
                  type="number"
                  name="price"
                  value={editingVehicle.price}
                  onChange={handleEditInputChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Quantité en stock</label>
                <input
                  type="number"
                  name="stockQuantity"
                  value={editingVehicle.stockQuantity}
                  onChange={handleEditInputChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Année de fabrication</label>
                <input
                  type="number"
                  name="yearOfManufacture"
                  value={editingVehicle.yearOfManufacture}
                  onChange={handleEditInputChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Type de carburant</label>
                <select
                  name="fuelType"
                  value={editingVehicle.fuelType}
                  onChange={handleEditInputChange}
                  className="form-control"
                >
                  <option value="essence">Essence</option>
                  <option value="diesel">Diesel</option>
                  <option value="electric">Électrique</option>
                  <option value="hybrid">Hybride</option>
                </select>
              </div>
              <div className="form-group">
                <label>Kilométrage</label>
                <input
                  type="number"
                  name="mileage"
                  value={editingVehicle.mileage}
                  onChange={handleEditInputChange}
                  className="form-control"
                />
              </div>
              {/* Display fields based on vehicle_type from the database */}
              {editingVehicle.vehicle_type === "CAR" && (
                <div className="form-group">
                  <label>Nombre de portes</label>
                  <input
                    type="number"
                    name="numberOfDoors"
                    value={editingVehicle.numberOfDoors}
                    onChange={handleEditInputChange}
                    className="form-control"
                  />
                </div>
              )}
              {editingVehicle.vehicle_type === "SCOOTER" && (
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      name="hasStorageBox"
                      checked={editingVehicle.hasStorageBox}
                      onChange={handleEditInputChange}
                    />
                    Coffre de rangement
                  </label>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Mettre à jour
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminCatalog;
