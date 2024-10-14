import Room from "../models/room.model.js";

export const createroom = async (req, res) => {
  try {
    const {
      hotel_id,
      room_name,
      room_size,
      sleeps,
      bed_type,
      is_available,
      total_price,
      amenities,
      bathroom,
      accessibility,
      pricing_options,
      booking_policy,
    } = req.body;

    if (!hotel_id || !room_name || !bed_type || !sleeps || !total_price) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    const newroom = await Room.create({
      hotel_id,
      room_name,
      room_size,
      sleeps,
      bed_type,
      is_available,
      total_price,
      amenities,
      bathroom,
      accessibility,
      pricing_options,
      booking_policy,
    });
    return res
      .status(201)
      .json({ message: "Room created successfully", newroom });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create room", error });
  }
};
export const getRoombyId = async (req, res) => {
  try {
    const id = req.params.id;
    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    return res.json(room);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
export const getRoomsByHotelId = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Please Provide Hotel id" });
    }
    const rooms = await Room.find({ hotel_id: id });
    if (rooms.length === 0) {
      return res.status(404).json({ message: "No rooms found for this hotel" });
    }
    return res.status(200).json({ rooms });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to fetch rooms", error });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      room_name,
      room_size,
      sleeps,
      bed_type,
      is_available,
      total_price,
      amenities,
      bathroom,
      accessibility,
      pricing_options,
      booking_policy,
    } = req.body;
    const room = await Room.findByIdAndUpdate(
      id,
      {
        room_name,
        room_size,
        sleeps,
        bed_type,
        is_available,
        total_price,
        amenities,
        bathroom,
        accessibility,
        pricing_options,
        booking_policy,
      },
      { new: true }
    );
    return res.status(200).json({ message: "Update room successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update room", error });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Please provide room id " });
    }
    const room = await Room.findByIdAndDelete(id);
    return res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to delete room", error });
  }
};
