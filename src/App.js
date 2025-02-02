import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import VehicleDetails from "./pages/VehicleDetails";
import AdminCatalog from "./pages/AdminCatalog";
import CartPage from "./pages/CartPage";
import ProfilePage from "./pages/ProfilePage";
import SubsidiaryManagement from "./pages/SubsidiaryManagement"; // ✅ Importation ajoutée
import AdminCustomers from "./pages/AdminCustomers"; // ✅ Importer la page
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Footer from "./components/Footer";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/vehicle/:id" element={<VehicleDetails />} />
        <Route path="/admin/catalog" element={<AdminCatalog />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/subsidiaries" element={<SubsidiaryManagement />} /> {/* ✅ Ajout de la route */}
        <Route path="/admin/customers" element={<AdminCustomers />} />
        <Route path="/subsidiaries/:companyId" element={<SubsidiaryManagement />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
