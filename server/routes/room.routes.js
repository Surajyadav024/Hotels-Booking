import express from "express";
import { createroom, deleteRoom, getRoombyId, getRoomsByHotelId } from "../controllers/room.controllers.js";
const roomRoutes = express.Router();

roomRoutes.post("/createRoom", createroom);
roomRoutes.get("/getRoomById/:id", getRoombyId);
roomRoutes.get("/getRoomByHotelId/:id", getRoomsByHotelId);
roomRoutes.post("/deleteRoom/:id", deleteRoom);
export default roomRoutes;
