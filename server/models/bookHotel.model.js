import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    agent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
      required: true,
    }, // Reference to the user who made the booking

    hotel_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    }, // Reference to the hotel

    room_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    }, // Reference to the room that was booked

    check_in: {
      type: Date,
      required: true,
    }, // Check-in date

    check_out: {
      type: Date,
      required: true,
    }, // Check-out date

    guests: {
      type: Number,
      required: true,
    }, // Number of guests for the booking

    total_price: {
      type: Number,
      required: true,
    }, // Total price for the booking

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"], // Booking status
      default: "pending",
    }, // Current status of the booking

    payment_status: {
      type: String,
      enum: ["pending", "paid", "failed"], // Payment status
      default: "pending",
    }, // Payment status for the booking
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

const bookingModel = mongoose.model("Booking", bookingSchema);

export default bookingModel;
