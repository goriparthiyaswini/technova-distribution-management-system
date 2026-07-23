import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";
import Layout from "../components/Layout";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Customers from "../pages/Customers";
import Products from "../pages/Products";
import Inventory from "../pages/Inventory";
import Challans from "../pages/Challans";
import Users from "../pages/Users";
import Profile from "../pages/Profile";

export default function AppRouter() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/products" element={<Products />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/challans" element={<Challans />} />
              <Route path="/profile" element={<Profile />} />
              <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
                <Route path="/users" element={<Users />} />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}