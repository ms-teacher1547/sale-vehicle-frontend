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
import AdminOptions from "./pages/AdminOptions"; // ✅ Import du composant
import ChooseOptions from "./pages/ChooseOptions"; // ✅ Import du composant
import MyOrders from "./pages/MyOrders"; // ✅ Importation du composant
import AdminOrders from "./pages/AdminOrders";
import PaymentPage from "./pages/PaymentPage";
import MyInvoices from "./pages/MyInvoices";


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
        <Route path="/admin/options" element={<AdminOptions />} /> 
        <Route path="/choose-options" element={<ChooseOptions />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/payment/:orderId" element={<PaymentPage />} />
        <Route path="/my-invoices" element={<MyInvoices />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
