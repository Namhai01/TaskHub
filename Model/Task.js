const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "description ...",
    },
    status: {
      type: String,
      enum: [true, false],
      default: false,
    },
    groups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
