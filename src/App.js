import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import VehicleDetails from "./pages/VehicleDetails";
import AdminCatalog from "./pages/AdminCatalog";
import CartPage from "./pages/CartPage";
import ProfilePage from "./pages/ProfilePage";
import SubsidiaryManagement from "./pages/SubsidiaryManagement";
import AdminCustomers from "./pages/AdminCustomers";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Footer from "./components/Footer";
import AdminOptions from "./pages/AdminOptions";
import ChooseOptions from "./pages/ChooseOptions";
import MyOrders from "./pages/MyOrders";
import AdminOrders from "./pages/AdminOrders";
import PaymentPage from "./pages/PaymentPage";
import MyInvoices from "./pages/MyInvoices";

const AppRoutes = () => {
  const location = useLocation();

  // Liste des pages où le footer doit être masqué, excluant la page d'accueil
  const hideFooterPages = [
    "/login",
    "/register",
    "/admin/catalog",
    "/cart",
    "/profile",
    "/subsidiaries",
    "/admin/customers",
    "/admin/options",
    "/choose-options",
    "/my-orders",
    "/admin/orders",
    "/payment/:orderId",
    "/my-invoices",
    "/catalog",
    "/vehicle/:id",
    "/:companyId/subsidiaries",
  ];

  // Vérification si la page actuelle est dans la liste des pages sans footer
  const shouldHideFooter = hideFooterPages.includes(location.pathname);

  // Log de débogage
  // console.log('Current path:', location.pathname);
  // console.log('Should hide footer?', shouldHideFooter);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/vehicle/:id" element={<VehicleDetails />} />
        <Route path="/admin/catalog" element={<AdminCatalog />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/subsidiaries" element={<SubsidiaryManagement />} />
        <Route path="/admin/customers" element={<AdminCustomers />} />
        <Route path="/:companyId/subsidiaries" element={<SubsidiaryManagement />} />
        <Route path="/admin/options" element={<AdminOptions />} />
        <Route path="/choose-options" element={<ChooseOptions />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/payment/:orderId" element={<PaymentPage />} />
        <Route path="/my-invoices" element={<MyInvoices />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>

      {/* Affichage du Footer sauf sur les pages sans footer */}
      {!shouldHideFooter && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;
