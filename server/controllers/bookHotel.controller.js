import bookingModel from "../models/bookHotel.model.js";

export const createBooking = async (req, res) => {
  try {
    const {
      agent_id,
      hotel_id,
      room_id,
      check_in,
      check_out,
      guests,
      total_price,
    } = req.body;
    if (
      !agent_id ||
      !hotel_id ||
      !room_id ||
      !check_in ||
      !check_out ||
      !guests ||
      !total_price
    ) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }
    const newBooking = await bookingModel.create({
      agent_id,
      hotel_id,
      room_id,
      check_in,
      check_out,
      guests,
      total_price,
    });
    return res
      .status(201)
      .json({ message: "Booking created successfully", newBooking });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Failed to create booking", error });
  }
};
export const getBookingsById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Booking ID is required" });
    }
    const booking = await bookingModel
      .findById(id)
      .populate("hotel_id room_id agent_id");

    return res.status(200).json({ message: "All Bookings", booking });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to get booking", error: error.message });
  }
};
export const getBookingsByAgentId = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Agent id is required" });
    }
    const bookings = await bookingModel.find({ agent_id: id });
    if (bookings.length === 0) {
      return res.status(404).json({ message: "No bookings for this agent" });
    }
    return res.status(200).json({ message: "Agent Bookings", bookings });
  } catch (error) {
    return res.status(500).json({ message: "  Failed to fetch error ", error });
  }
};
export const updatePaymentstatus = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { payment_status } = req.body;
    if (!bookingId) {
      return res.status(400).json({ message: "Id is required" });
    }
    const booking = await bookingModel.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (
      payment_status &&
      ["pending", "paid", "failed"].includes(payment_status)
    ) {
      booking.payment_status = payment_status;
    } else {
      return res.status(400).json({ message: "Invalid payment status" });
    }
    await booking.save();
    return res
      .status(200)
      .json({ message: "Payment updated successfully", booking });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to update Payment", error: error.message });
  }
};

export const updateBookingstatus = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { status } = req.body;
    if (!bookingId) {
      return res.status(400).json({ message: "Id is required" });
    }
    const booking = await bookingModel.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (
      status &&
      ["pending", "confirmed", "cancelled", "completed"].includes(status)
    ) {
      booking.status = status;
    } else {
      return res.status(400).json({ message: "Invalid Booking status" });
    }

    await booking.save();
    return res
      .status(200)
      .json({ message: "Booking updated successfully", booking });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to update booking", error: error.message });
  }
};
export const deleteBooking = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Id is required" });
    }
    const booking = await bookingModel.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    await booking.remove();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to delete booking", error: error.message });
  }
};
