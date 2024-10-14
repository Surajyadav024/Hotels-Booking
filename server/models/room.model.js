import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    hotel_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    }, // Reference to the Hotel

    // Room Basic Information
    room_name: { type: String, required: true }, // e.g., "Room, 1 King Bed, Non Smoking"
    room_size: { type: String, default: "Not specified" }, // e.g., "45 sq m", optional
    sleeps: { type: Number, required: true }, // Maximum number of people, e.g., "3"
    bed_type: { type: String, required: true }, // e.g., "1 King Bed"
    is_available: { type: Boolean, default: true }, // Whether the room is available for booking
    total_price: { type: Number, required: true }, // Total price including any taxes or fees

    // Room Amenities
    amenities: {
      air_conditioning: { type: Boolean, default: false },
      premium_bedding: { type: Boolean, default: false },
      blackout_curtains: { type: Boolean, default: false },
      free_bottled_water: { type: Boolean, default: false },
      minibar: { type: Boolean, default: false },
      coffee_tea_maker: { type: Boolean, default: false },
      room_service_24hr: { type: Boolean, default: false },
      tv: {
        size: { type: String, default: "45-inch" }, // e.g., "45-inch LCD TV"
        channels: { type: Boolean, default: false }, // Whether TV has channels
      },
      internet: {
        wifi: { type: Boolean, default: false },
        speed: { type: String, default: "25+ Mbps" }, // Optional WiFi speed
      },
    },

    // Bathroom Details
    bathroom: {
      private: { type: Boolean, default: true }, // Whether room has a private bathroom
      bathtub: { type: Boolean, default: false },
      rainfall_showerhead: { type: Boolean, default: false },
      bathrobes: { type: Boolean, default: false },
      toiletries: { type: Boolean, default: false },
      slippers: { type: Boolean, default: false },
      hair_dryer: { type: Boolean, default: false },
    },

    // Room Reviews
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to a user who leaves the review
        rating: { type: Number, required: true }, // Rating out of 10
        review_text: String, // Optional review text
        date: { type: Date, default: Date.now },
      },
    ],

    // Room Accessibility
    accessibility: {
      wheelchair_accessible: { type: Boolean, default: false },
      grab_bars_in_bathroom: { type: Boolean, default: false },
      low_height_sinks: { type: Boolean, default: false },
      height_adjustable_showerhead: { type: Boolean, default: false },
      lever_door_handles: { type: Boolean, default: false },
    },

    // Room Pricing Options
    pricing_options: [
      {
        description: String, // e.g., "Breakfast buffet"
        additional_price: Number, // Price for extra services
      },
    ],

    // Booking Information
    booking_policy: {
      refundable: { type: Boolean, default: false }, // Whether the booking is refundable
      refundable_until: Date, // Refundable until this date
    },

    // Timestamps for automatic tracking of creation and updates
  },
  { timestamps: true, versionKey: false }
);

const Room = mongoose.model("Room", roomSchema);

export default Room;
