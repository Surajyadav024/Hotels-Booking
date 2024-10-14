import express from "express";
import {
  createHotel,
  deleteHotelById,
  getallHotels,
  getHotelById,
  updateHotel,
} from "../controllers/hotel.controller.js";
const hotelRoutes = express.Router();

hotelRoutes.post("/create", createHotel);
hotelRoutes.get("/gethotelbyId/:id", getHotelById);
hotelRoutes.get("/getallhotel", getallHotels);
hotelRoutes.put("/updatehotel/:id", updateHotel);
hotelRoutes.post("/deletehotel/:id", deleteHotelById);

export default hotelRoutes;
