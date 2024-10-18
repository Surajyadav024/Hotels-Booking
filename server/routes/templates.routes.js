import express from "express";
import {
  createTemplate,
  deleteTemplate,
  getTemplateById,
  getTemplateByName,
  updateTemplate,
} from "../controllers/template.controller.js";
const templateRoutes = express.Router();
templateRoutes.post("/create", createTemplate);
templateRoutes.get("/getTemplateById/:id", getTemplateById);
templateRoutes.get("/getTemplateByName/:name", getTemplateByName);
templateRoutes.post("/updateTemplate", updateTemplate);
templateRoutes.post("/deleteTemplate/:id", deleteTemplate);
export default templateRoutes;
