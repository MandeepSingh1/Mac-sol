import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/layout';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import Home from 'pages/home/home';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import InventoryList from 'pages/inventories/inventories';
import AddInventory from 'pages/inventories/addInventories/addInventories';
import LoginPage from 'pages/login/login';
import './style.css';
import Profile from 'pages/profile/profile';
import RoutingPaths from 'Helper/routingPath';
import PrivateRoutes from 'Helper/privateRoute/privateRoute';
import SuppliersList from 'pages/suppliers/suppliers';
import AddSuppliers from 'pages/suppliers/addsuppliers/addSuppliers';


function App() {
  let auth = localStorage.getItem('session')

  return (
    <>
    <Router>
      <Routes>
      <Route element={<PrivateRoutes />}>
      <Route path="/" element={<Layout />}>
          <Route path={RoutingPaths.home} index element={<Home />} />
          <Route path={RoutingPaths.inventoryList} element={<InventoryList />} />
          
          <Route path={RoutingPaths.addInventories} element={<AddInventory />} />
          <Route path={RoutingPaths.editInventories} element={<AddInventory />} />

          <Route path={RoutingPaths.suppliersList} element={<SuppliersList />} />

          <Route path={RoutingPaths.addSuppliers} element={<AddSuppliers />} />
          <Route path={RoutingPaths.editSuppliers} element={<AddSuppliers />} />

          <Route path={RoutingPaths.profile} element={<Profile />} />
        </Route>
            
          </Route>
          <Route path={RoutingPaths.login} element={auth ? <Navigate to={RoutingPaths.home} /> : <LoginPage />} />
      </Routes>
    </Router>
  </>
  );
}

export default App;