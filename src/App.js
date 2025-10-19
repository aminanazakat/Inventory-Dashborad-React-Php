import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";

import Login from "./components/Auth/Login";
import Logout from "./components/Auth/Logout";
import Register from "./components/Auth/Register";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import UserProfile from "./components/Users/UserProfile";

import ProductList from "./components/Products/ProductList";
import AddProduct from "./components/Products/AddProduct";
import EditProduct from "./components/Products/EditProduct";

import CategoryList from "./components/Categories/CategoryList";
import AddCategory from "./components/Categories/AddCategory";
import EditCategory from "./components/Categories/EditCategory";

import CustomerList from "./components/Customers/CustomerList";
import EditCustomer from "./components/Customers/EditCustomer";
import AddCustomer from "./components/Customers/AddCustomer";

import SalesList from "./components/Sales/SalesList";
import CreateSale from "./components/Sales/CreateSale";
import DeliverSale from "./components/Sales/DeliverSale";
import EditSale from "./components/Sales/EditSale";

import SupplierList from "./components/Suppliers/SupplierList";
import AddSupplier from "./components/Suppliers/AddSupplier";
import EditSupplier from "./components/Suppliers/EditSupplier";

import PurchaseList from "./components/Purchases/PurchaseList";
import CreatePurchase from "./components/Purchases/CreatePurchase";
import ReceivePurchase from "./components/Purchases/ReceivePurchase";

import StockAdjustments from "./components/Stock/StockAdjustments";
import AddStock from "./components/Stock/AddStock";
import Reports from "./components/Reports/Reports";

import UsersList from "./components/Users/UsersList";
import AddUser from "./components/Users/AddUser";
import EditUser from "./components/Users/EditUser";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile" element={<UserProfile />} />


        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />

          <Route path="/products" element={<ProductList />} />
          <Route path="/products/add" element={<AddProduct />} />
          <Route path="/products/edit/:id" element={<EditProduct />} />

          <Route path="/categories" element={<CategoryList />} />
          <Route path="/categories/add" element={<AddCategory />} />
          <Route path="/categories/edit/:id" element={<EditCategory />} />

          <Route path="/sales" element={<SalesList />} />
          <Route path="/sales/create" element={<CreateSale />} />
          <Route path="/sales/deliver" element={<DeliverSale />} />
          <Route path="/sales/edit/:id" element={<EditSale />} />

          <Route path="/customers" element={<CustomerList />} />
          <Route path="/customers/add" element={<AddCustomer />} />
          <Route path="/customers/edit/:id" element={<EditCustomer />} />

          <Route path="/suppliers" element={<SupplierList />} />
          <Route path="/suppliers/add" element={<AddSupplier />} />
          <Route path="/suppliers/edit/:id" element={<EditSupplier />} />

          <Route path="/purchases" element={<PurchaseList />} />
          <Route path="/purchases/create" element={<CreatePurchase />} />
          <Route path="/purchases/receive" element={<ReceivePurchase />} />

          <Route path="/stock" element={<StockAdjustments />} />
          <Route path="/stock/add" element={<AddStock />} />

          <Route path="/reports" element={<Reports />} />

          <Route path="/users" element={<UsersList />} />
          <Route path="/users/add" element={<AddUser />} />
          <Route path="/users/edit/:id" element={<EditUser />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </Router>
  );
}
