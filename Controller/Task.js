const { default: mongoose } = require("mongoose");
const Task = require("../Model/Task");
const User = require("../Model/User");
const Group = require("../Model/Group");
module.exports.getTask = async (req, res) => {
  try {
    const user = await User.findById({
      _id: req.session.passport.user,
    });
    if (user) {
      const List = await Task.find({ groups: { $in: user.groups } });
      res.json({ status: "success", data: List });
    }
  } catch (error) {
    res.send("error creating:" + error.message);
  }
};

module.exports.addTask = async (req, res) => {
  try {
    const user = await User.findById(req.session.passport.user);
    if (user) {
      const groupObjectId = new mongoose.Types.ObjectId(req.body.group);
      if (user.groups.includes(groupObjectId)) {
        const task = await Task.create({
          title: req.body.title,
          description: req.body.description,
          status: req.body.status,
          groups: groupObjectId,
        });
        return res.status(201).json({
          status: "success",
          message: "Tạo task thành công",
          data: {
            task,
          },
        });
      } else {
        res.json({ status: "error", message: "Tạo task không thành công" });
      }
    } else {
      res.json({ status: "error", message: "Người dùng không hợp lệ" });
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
};
