import mongoose from "mongoose";
const packageSchema = new mongoose.Schema(
  {
    agent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    numberOfPeople: {
      type: Number,
      required: true,
    },
    hotelDetails: {
      ac: {
        type: Boolean,
        required: true,
      },
      mealIncluded: {
        type: Boolean,
        required: true,
      },
      ratings: {
        type: Number,
        required: true,
      },
    },
    estimatedCost: {
      type: Number,
      required: true,
    },
  },
  { timeseries: true, versionKey: false }
);
const packageModel = mongoose.model("Package", packageSchema);

export default packageModel;
