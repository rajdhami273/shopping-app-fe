import { Routes, Route } from "react-router";

// auth
import AuthLayout from "../pages/auth/AuthLayout";
import Login from "../pages/auth/login/Login";
import Register from "../pages/auth/register/Register";
import ResetPassword from "../pages/auth/reset-password/ResetPassword";
import Verify from "../pages/auth/verify/Verify";

// common
import NotFound from "../pages/common/NotFound";

// main app
import MainAppLayout from "../pages/main-app/MainAppLayout";
import ProductsList from "../pages/main-app/products/ProductsList";
import Product from "../pages/main-app/products/Product";
import Cart from "../pages/main-app/cart/Cart";

export const routes = (
  <Routes>
    <Route path="/" element={<MainAppLayout />}>
      <Route path="/products" element={<ProductsList />} />
      <Route path="/products/:id" element={<Product />} />
      <Route path="/cart" element={<Cart />} />
    </Route>
    <Route path="/auth" element={<AuthLayout />}>
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth/reset-password" element={<ResetPassword />} />
      <Route path="/auth/verify" element={<Verify />} />
    </Route>
    <Route path="*" element={<NotFound />} />
  </Routes>
);
