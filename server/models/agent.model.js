import mongoose from "mongoose";

const agentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
    phoneNo: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"],
    },
    password: {
      type: String,
      required: true,
    },
    companyName: {
      type: String, // The company the agent works for
    },
    address: {
      type: String, // Office or residential address of the agent
    },
    license: {
      type: String, // License or certification number for the agent
      required: true,
    },

    packagesCreated: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Package", // Reference to the Package model
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const AgentModel = mongoose.model("Agent", agentSchema);

export default AgentModel;
