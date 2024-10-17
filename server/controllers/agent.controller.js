import AgentModel from "../models/agent.model.js";
import bcrypt from "bcrypt";
export const createagent = async (req, res) => {
  try {
    const { name, email, phoneNo, password, companyName, address, license } =
      req.body;
    if (
      !name ||
      !email ||
      !phoneNo ||
      !password ||
      !companyName ||
      !address ||
      !license
    ) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    const isagentExist = await AgentModel.findOne({ email });
    if (isagentExist) {
      return res.status(400).json({ message: "Agent already exist" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAgent = await AgentModel.create({
      name,
      email,
      phoneNo,
      password: hashedPassword,
      companyName,
      license,
      address,
    });
    return res
      .status(201)
      .json({ message: "Agent created successfully", newAgent });
  } catch (error) {
    return res.status(500).json({ message: "Error creating agent", error });
  }
};
export const getAllAgents = async (req, res) => {
  try {
    const agents = await AgentModel.find();
    return res
      .status(200)
      .json({ message: "Agents fetched successfully", agents });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching agents", error });
  }
};
export const getAgentById = async (req, res) => {
  try {
    const id = req.para.id;
    if (!id) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    const agent = await AgentModel.findById(id);
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }
    return res
      .status(200)
      .json({ message: "Agent fetched Successfully", agent });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching agent", error });
  }
};
export const updateAgent = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Agent id is required" });
    }
    const { name, email, phoneNo, companyName, address, license } = req.body;
    const updateAgent = await AgentModel.findByIdAndUpdate(
      id,
      {
        name,
        email,
        phoneNo,
        companyName,
        address,
        license,
      },
      { new: true }
    );
    if (!updateAgent) {
      return res.status(404).json({ message: "Agent not found" });
    }
    return res
      .status(200)
      .json({ message: "Agent updated successfully", updateAgent });
  } catch (error) {
    return res.status(500).json({ message: "Error updating agent", error });
  }
};
