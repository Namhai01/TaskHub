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
    isLoggedIn: {
      type: Boolean,
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
    collection: "Users", // cài đặt tên cho conversations kết nối đến
    versionKey: false, // loai bo version key
    timestamps: true,
  }
);
const User = mongoose.model("Users", UsersSchema);
module.exports = User;
