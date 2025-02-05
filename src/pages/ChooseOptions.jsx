import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_URL_VEHICLES = "http://localhost:8081/api/catalog/vehicles";
const API_URL_OPTIONS = "http://localhost:8081/api/options";
const API_URL_CART = "http://localhost:8081/api/cart";

const ChooseOptions = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const [vehicles, setVehicles] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchVehicles();
    fetchOptions();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get(API_URL_VEHICLES, { withCredentials: true });
      setVehicles(response.data);
    } catch (error) {
      setError("Impossible de charger les véhicules.");
    }
  };

  const fetchOptions = async () => {
    try {
      const response = await axios.get(API_URL_OPTIONS);
      setOptions(response.data);
    } catch (error) {
      setError("Impossible de charger les options.");
    }
  };

  const handleSelectVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setSelectedOptions([]);
  };

  const handleSelectOption = (option) => {
    const incompatible = selectedOptions.some((selectedOption) =>
      option.incompatibleOptions?.some((incomp) => incomp.id === selectedOption.id)
    );
    if (incompatible) {
      setError(`L'option ${option.name} est incompatible avec celles déjà sélectionnées.`);
      return;
    }
    setSelectedOptions((prevOptions) =>
      prevOptions.includes(option) ? prevOptions.filter((opt) => opt.id !== option.id) : [...prevOptions, option]
    );
    setError("");
  };

  const addToCart = async () => {
    if (!selectedVehicle) {
      setError("Veuillez sélectionner un véhicule.");
      return;
    }
    try {
      await axios.post(
        `${API_URL_CART}/add`,
        { vehicleId: selectedVehicle.id, options: selectedOptions.map((opt) => opt.id), quantity },
        { withCredentials: true }
      );
      navigate("/cart");
    } catch (error) {
      setError("Erreur lors de l'ajout au panier.");
    }
  };

  return (
    <div className="container mx-auto p-10">
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-5">Choisir un véhicule et ses options</h2>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-3">{error}</div>}
      <h4 className="text-xl font-semibold mb-3">Véhicules disponibles</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-white p-4 shadow-lg rounded-lg text-center border hover:shadow-xl transition">
            <h3 className="text-lg font-semibold">{vehicle.name || "Nom non disponible"}</h3>
            <p className="text-gray-600">Prix : {vehicle.price} FCFA</p>
            <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700" onClick={() => handleSelectVehicle(vehicle)}>
              Choisir
            </button>
          </div>
        ))}
      </div>

      {selectedVehicle && (
        <>
          <h4 className="text-xl font-semibold mt-6">Options disponibles</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {options.map((option) => (
              <div key={option.id} className={`p-4 border rounded-lg text-center cursor-pointer ${selectedOptions.includes(option) ? "bg-yellow-200" : "bg-white"}`} onClick={() => handleSelectOption(option)}>
                <h5 className="text-lg font-semibold">{option.name}</h5>
                <p className="text-gray-600">Prix: {option.price} FCFA</p>
                <p className="text-gray-500">Catégorie: {option.category}</p>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <label className="block text-lg font-semibold">Quantité:</label>
            <input type="number" value={quantity} min="1" className="border p-2 rounded w-full" onChange={(e) => setQuantity(parseInt(e.target.value))} />
          </div>

          <button className="mt-4 w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700" onClick={addToCart}>
            Ajouter au Panier
          </button>
        </>
      )}

      <button className="mt-4 w-full bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-700" onClick={() => navigate("/catalog")}>
        Retour au Catalogue
      </button>
    </div>
  );
};

export default ChooseOptions;
