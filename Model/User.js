const mongoose = require("mongoose");
const UsersSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    phone: {
      type: Number,
    },
    userName: {
      type: String,
      require: true,
    },
    lastTimeLoggedIn: {
      type: Number,
      require: true,
    },
    isLoggedIn: {
      type: Boolean,
      enum: [true, false],
      default: false,
    },
  },
  {
    collection: "Users", // cài đặt tên cho conversations kết nối đến
    versionKey: false, // loai bo version key
  }
);
const User = mongoose.model("Users", UsersSchema);
module.exports = User;
