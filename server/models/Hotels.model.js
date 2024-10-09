import mongoose from "mongoose";
const HotelSchema = new mongoose.Schema(
  {
    hotelName:{
        type:String,
        required:true
    },
    address:{
        
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
