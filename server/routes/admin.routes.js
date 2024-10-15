import express from "express";
import {
  createAdmin,
  deleteAdmin,
  getAdminById,
  getAllAdmins,
  login,
  requestPasswordReset,
  setnewPassword,
  updateAdmin,
  verifyOtp,
} from "../controllers/admin.controller.js";
const AdminRoute = express.Router();

AdminRoute.post("/create", createAdmin);
AdminRoute.post("/login", login);
AdminRoute.get("/getalladmins", getAllAdmins);
AdminRoute.post("/ResetPassword", requestPasswordReset);
AdminRoute.post("/verifyotp", verifyOtp);
AdminRoute.post("/newpassword", setnewPassword);
AdminRoute.put("/updateadmin/:id", updateAdmin);
AdminRoute.get("/getadminbyid/:id", getAdminById);
AdminRoute.delete("/deleteadmin/:id", deleteAdmin);
export default AdminRoute;
