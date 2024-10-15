import mongoose from "mongoose";

const HotelSchema = new mongoose.Schema(
  {
    hotelName: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    contactNumber: {
      type: String,
      required: true,
      unique:true,
      match: [/^[0-9]{10}$/, "Phone number must be 10 digits"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    address: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    amenities: {
      type: [String],
    },
    acAvailable: {
      type: Boolean,
      default: false,
    },
    // mealOptions: {
    //   type: String,
    //   enum: ["Breakfast only", "Half board", "Full board", "All inclusive"],
    // },
    pricePerNight: {
      type: Number,
      required: true,
    },
    totalRooms: {
      type: Number,
      required: true,
    },
    availableRooms: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const HotelModel = mongoose.model("Hotel", HotelSchema);

export default HotelModel;
