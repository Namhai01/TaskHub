const mongoose = require("mongoose");
const ListsSchema = new mongoose.Schema(
  {
    userID: {
      type: String,
      require: true,
    },
    job: {
      type: String,
      require: true,
    },
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
  },
  {
    collection: "List", // cài đặt tên cho conversations kết nối đến
    versionKey: false, // loai bo version key
  }
);
const List = mongoose.model("List", ListsSchema);
module.exports = List;
