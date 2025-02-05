import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Spinner } from "react-bootstrap";
import { FaCar, FaTrash, FaEdit, FaSave, FaArrowLeft } from "react-icons/fa";
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
    <div className="admin-container">
      <h2 className="mb-4 text-center">Gestion des Véhicules <FaCar /></h2>

      {/* ✅ Boutons de navigation et réduction */}
      <div className="d-flex justify-content-between mb-3">
        <button className="btn btn-outline-primary" onClick={() => navigate("/catalog")}>
          <FaArrowLeft /> Retour au Catalogue
        </button>
        <button className="btn btn-warning" onClick={applyDiscount}>
          💰 Appliquer une réduction (-20%)
        </button>
      </div>

      {/* ✅ Formulaire d'ajout */}
      <div className="mb-4">
        <h4>Ajouter un véhicule</h4>
        <select className="form-control mb-2" value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}>
          <option value="car">🚗 Voiture</option>
          <option value="scooter">🛵 Scooter</option>
        </select>
        <input type="text" name="name" placeholder="Nom" value={newVehicle.name} onChange={handleInputChange} className="form-control mb-2" />
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

        <button className="btn btn-success mt-2" onClick={addVehicle}><FaSave /> Ajouter</button>
      </div>

      {/* ✅ Liste des véhicules */}
      <h4>Véhicules existants</h4>
      <table className="table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prix</th>
            <th>Année</th>
            <th>Carburant</th>
            <th>Kilométrage</th>
            <th>Quantité</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map(vehicle => (
            <tr key={vehicle.id}>
              <td>{vehicle.name}</td>
              <td>{vehicle.price} FCFA</td>
              <td>{vehicle.yearOfManufacture}</td>
              <td>{vehicle.fuelType === "essence" ? "Essence" : "Électrique"}</td>
              <td>{vehicle.mileage} km</td>
              <td>{vehicle.stockQuantity}</td>
              <td>
                <button className="btn btn-danger btn-sm" onClick={() => confirmDelete(vehicle)}><FaTrash /> Supprimer</button>
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
  );
};

export default AdminCatalog;
