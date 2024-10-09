import express from "express";
import {
  createAdmin,
  getAdminById,
  login,
  requestPasswordReset,
  setnewPassword,
  verifyOtp,
} from "../controllers/admin.controller.js";
const AdminRoute = express.Router();

AdminRoute.post("/create", createAdmin);
AdminRoute.post("/login", login);
AdminRoute.post("/ResetPassword", requestPasswordReset);
AdminRoute.post("/verifyotp", verifyOtp);
AdminRoute.post("/newpassword", setnewPassword);
AdminRoute.get("/getadminbyid/:id", getAdminById);
export default AdminRoute;
