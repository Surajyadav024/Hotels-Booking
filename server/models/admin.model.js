import mongoose from "mongoose";
const adminSchema = new mongoose.Schema(
  {
    FirstName: {
      type: String,
      required: true,
    },
    LastName: {
      type: String,
    },
    Email: {
      type: String,
      required: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
    PhoneNo: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"],
    },
    Password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters long"],
    },
    otp: {
      type: String,
    },
    otpExpiry: {
      type: Date,
    },
    token: {
      type: String,
    },  
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
const adminModel = mongoose.model("admin", adminSchema);
export default adminModel;
