import express from "express";
import { createagent, deleteAgent, getAgentById, getAllAgents, login, requestPasswordReset, setnewPassword, updateAgent, verifyOtp } from "../controllers/agent.controller.js";

const agentRoutes = express.Router();
agentRoutes.post("/createagent", createagent);
agentRoutes.post("/login", login);
agentRoutes.get("/getalladmins", getAllAgents);
agentRoutes.post("/ResetPassword", requestPasswordReset);
agentRoutes.post("/verifyotp", verifyOtp);
agentRoutes.post("/newpassword", setnewPassword);
agentRoutes.put("/updateagent/:id", updateAgent);
agentRoutes.get("/getagentbyid/:id", getAgentById);
agentRoutes.delete("/deleteagent/:id", deleteAgent);
export default agentRoutes;
