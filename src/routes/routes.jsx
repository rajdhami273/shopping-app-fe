import { Routes, Route } from "react-router";
import AuthLayout from "../pages/auth/AuthLayout";
import Login from "../pages/auth/login/Login";
import Register from "../pages/auth/register/Register";
import ResetPassword from "../pages/auth/reset-password/ResetPassword";
import Verify from "../pages/auth/verify/Verify";
import MainAppLayout from "../pages/main-app/MainAppLayout";

export const routes = (
  <Routes>
    <Route path="/" element={<MainAppLayout />} />
    <Route path="/auth" element={<AuthLayout />}>
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth/reset-password" element={<ResetPassword />} />
      <Route path="/auth/verify" element={<Verify />} />
    </Route>
  </Routes>
);
