import mongoose from "mongoose";
const connectdb = async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDb connection Error:", error.message);
    throw error;
  } 
};
export default connectdb;
