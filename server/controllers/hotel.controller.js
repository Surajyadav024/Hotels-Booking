import HotelModel from "../models/Hotels.model.js";
export const createHotel = async (req, res) => {
  try {
    const {
      hotelName,
      location,
      contactNumber,
      email,
      address,
      rating,
      amenities,
      acAvailable,
      pricePerNight,
      totalRooms,
      availableRooms,
    } = req.body;
    if (!hotelName || !location || !contactNumber || !email || !address) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    const isexist = await HotelModel.findOne({ email });
    if (isexist) {
      return res
        .status(400)
        .json({ message: "Hotel already exists with this email" });
    }

    const newhotel = await HotelModel.create({
      hotelName,
      location,
      contactNumber,
      email,
      address,
      rating,
      amenities,
      acAvailable,
      pricePerNight,
      totalRooms,
      availableRooms,
    });
    res.status(201).json({ message: "Hotel created successfully", newhotel });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: error.message });
  }
};
export const getHotelById = async (req, res) => {
  try {
    const hotelId = req.params.id;
    const hotel = await HotelModel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    return res.status(200).json(hotel);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching hotel", error });
  }
};
export const getallHotels = async (req, res) => {
  try {
    const allHotels = await HotelModel.find();
    if (!allHotels) {
      return res.status(404).json({ message: "No hotels found" });
    }
    return res.status(200).json(allHotels);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching hotels", error });
  }
};
export const updateHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      hotelName,
      location,
      contactNumber,
      email,
      address,
      rating,
      amenities,
      acAvailable,
      pricePerNight,
      totalRooms,
      availableRooms,
    } = req.body;
    const updatedHotel = await HotelModel.findByIdAndUpdate(
      id,
      {
        hotelName,
        location,
        contactNumber,
        email,
        address,
        rating,
        amenities,
        acAvailable,
        pricePerNight,
        totalRooms,
        availableRooms,
      },
      { new: true }
    );
    if (!updatedHotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    return res
      .status(200)
      .json({ message: "Hotel updated successfully", updatedHotel });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: error.message });
  }
};
export const deleteHotelById = async (req, res) => {
  try {
    const { id } = req.params;
    const hotel = await HotelModel.findByIdAndDelete(id);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    return res.status(200).json({ message: "Hotel deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting hotel", error });
  }
};
