import express from "express";
import {
  createBooking,
  getBookingsByAgentId,
  getBookingsById,
  updateBookingstatus,
  updatePaymentstatus,
} from "../controllers/bookHotel.controller.js";
const bookHotelRoutes = express.Router();
bookHotelRoutes.post("/bookings", createBooking);
bookHotelRoutes.get("/bookingsById/:id", getBookingsById);
bookHotelRoutes.get("/bookingsByAgentId/:id", getBookingsByAgentId);
bookHotelRoutes.get("/update/payment/status/:id", updatePaymentstatus);
bookHotelRoutes.get("/update/booking/status/:id", updateBookingstatus);
export default bookHotelRoutes;
