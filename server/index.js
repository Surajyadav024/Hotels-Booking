import express from "express";
import dotenv from "dotenv";
import connectdb from "./connectdb.js";
import AdminRoute from "./routes/admin.routes.js";
const app = express();
dotenv.config();
const port = process.env.PORT || 8004;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//--------------------Routes------------------------------
app.use("/Admin", AdminRoute);
//--------------------------------------------------------

const startServer = async () => {
  try {
    await connectdb();
    app.listen(port, () => {
      console.log(`server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error.message);
    process.exit(1);
  }
};
startServer();
