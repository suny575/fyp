import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: "PDF"
  },
  generatedBy: {
    type: String,
    default: "Admin"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Report = mongoose.model("Report", reportSchema);

export default Report;