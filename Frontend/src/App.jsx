import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { ToastProvider } from './context/ToastContext';

// Common Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/products/ProductDetail';
import SearchResults from './pages/common/SearchResults';
import CategoryProducts from './pages/CategoryProducts'; // THÊM IMPORT NÀY
import ProtectedRoute from './components/ProtectedRoute';

// Buyer Pages
import BuyerDashboard from './pages/buyer/BuyerDashboard';
import Wishlist from './pages/buyer/Wishlist';
import Cart from './pages/cart/Cart';
import Checkout from './pages/checkout/Checkout';
import CheckoutSuccess from './pages/checkout/CheckoutSuccess';
import MyOrders from './pages/orders/MyOrders';
import OrderDetail from './pages/orders/OrderDetail';
import Profile from './pages/Profile';

// Seller Pages
import SellerDashboard from './pages/seller/SellerDashboard';
import SellerOrders from './pages/orders/SellerOrders';
import Products from './pages/seller/Products';
import AddProduct from './pages/products/SellProduct';
import EditProduct from './pages/products/EditProduct';
import RevenueStats from './pages/seller/RevenueStats';
import Reviews from './pages/seller/Reviews';
import SellerProfile from './pages/seller/SellerProfile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import AllOrders from './pages/admin/AllOrders';
import AllProducts from './pages/admin/AllProducts';
import Categories from './pages/admin/Categories';
import Reports from './pages/admin/Reports';
import Settings from './pages/admin/Settings';

// Support Pages
import Contact from './pages/Contact';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Support from './pages/Support';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProductProvider>
          <ToastProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/search" element={<SearchResults />} />
              
              {/* THÊM ROUTE NÀY */}
              <Route path="/category" element={<CategoryProducts />} />
              <Route path="/category/:categoryId" element={<CategoryProducts />} />

              {/* Buyer Routes */}
              <Route path="/buyer/dashboard" element={
                <ProtectedRoute><BuyerDashboard /></ProtectedRoute>
              } />
              <Route path="/wishlist" element={
                <ProtectedRoute><Wishlist /></ProtectedRoute>
              } />
              <Route path="/cart" element={
                <ProtectedRoute><Cart /></ProtectedRoute>
              } />
              <Route path="/checkout" element={
                <ProtectedRoute><Checkout /></ProtectedRoute>
              } />
              <Route path="/checkout/success" element={
                <ProtectedRoute><CheckoutSuccess /></ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute><MyOrders /></ProtectedRoute>
              } />
              <Route path="/orders/:id" element={
                <ProtectedRoute><OrderDetail /></ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute><Profile /></ProtectedRoute>
              } />

              {/* Seller Routes */}
              <Route path="/seller/dashboard" element={
                <ProtectedRoute><SellerDashboard /></ProtectedRoute>
              } />
              <Route path="/seller/orders" element={
                <ProtectedRoute><SellerOrders /></ProtectedRoute>
              } />
              <Route path="/seller/products" element={
                <ProtectedRoute><Products /></ProtectedRoute>
              } />
              <Route path="/sell" element={
                <ProtectedRoute><AddProduct /></ProtectedRoute>
              } />
              <Route path="/edit-product/:id" element={
                <ProtectedRoute><EditProduct /></ProtectedRoute>
              } />
              <Route path="/seller/revenue" element={
                <ProtectedRoute><RevenueStats /></ProtectedRoute>
              } />
              <Route path="/seller/reviews" element={
                <ProtectedRoute><Reviews /></ProtectedRoute>
              } />
              <Route path="/seller/:id" element={<SellerProfile />} />

              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute><AdminDashboard /></ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute><UserManagement /></ProtectedRoute>
              } />
              <Route path="/admin/orders" element={
                <ProtectedRoute><AllOrders /></ProtectedRoute>
              } />
              <Route path="/admin/products" element={
                <ProtectedRoute><AllProducts /></ProtectedRoute>
              } />
              <Route path="/admin/categories" element={
                <ProtectedRoute><Categories /></ProtectedRoute>
              } />
              <Route path="/admin/reports" element={
                <ProtectedRoute><Reports /></ProtectedRoute>
              } />
              <Route path="/admin/settings" element={
                <ProtectedRoute><Settings /></ProtectedRoute>
              } />

              {/* Support Routes */}
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/support" element={<Support />} />

              {/* 404 Redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ToastProvider>
        </ProductProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;