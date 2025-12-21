const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  startDate: Date,
  endDate: Date,
  status: {
    type: String,
    enum: ["Pending", "In-Progress", "Completed"],
    default: "Pending"
  },
  assignedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  attachments: [String]
}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);
