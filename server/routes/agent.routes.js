import express from "express";
import { createagent } from "../controllers/agent.controller.js";

const agentRoutes = express.Router();
agentRoutes.post("/create/agent", createagent);
export default agentRoutes;
