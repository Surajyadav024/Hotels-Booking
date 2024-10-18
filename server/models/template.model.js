import mongoose from "mongoose";
const templateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    html: {
      type: String,
      required: true,
    },
  },
  { timeseries: true, versionKey: false }
);
const templateModel = mongoose.model("template", templateSchema);
export default templateModel;
