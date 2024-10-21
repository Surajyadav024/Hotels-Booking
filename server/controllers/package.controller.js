import packageModel from "../models/package.model.js";
export const createPackage = async (req, res) => {
  try {
    const {
      agent_id,
      location,
      duration,
      numberOfPeople,
      hotelDetails,
      estimatedCost,
    } = req.body;
    if (
      !agent_id ||
      !location ||
      !duration ||
      !numberOfPeople ||
      !hotelDetails ||
      !estimatedCost
    ) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    const newPackage = await packageModel.create({
      agent_id,
      location,
      duration,
      numberOfPeople,
      hotelDetails,
      estimatedCost,
    });
    res
      .status(201)
      .json({ message: "Package created successfully", newPackage });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error creating package", newPackage });
  }
};
