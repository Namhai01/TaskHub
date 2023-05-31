const { default: mongoose } = require("mongoose");
const Task = require("../Model/Task");
const User = require("../Model/User");
module.exports.getTask = async (req, res) => {
  try {
    const userId = req.session.passport.user;
    const user = await User.findById({
      _id: userId,
    });
    if (!user) {
      return res.json({ status: "error", message: "Người dùng không hợp lệ" });
    }
    const List = await Task.find({ groups: { $in: user.groups } });
    return res.json({ status: "success", data: List });
  } catch (error) {
    res.send("error creating:" + error.message);
  }
};

module.exports.addTask = async (req, res) => {
  try {
    const userId = req.session.passport.user;
    const groupObjectId = new mongoose.Types.ObjectId(req.body.group);

    // Tìm kiếm thông tin người dùng.
    const user = await User.findById(userId);
    if (!user) {
      return res.json({ status: "error", message: "Người dùng không hợp lệ" });
    }

    // Kiểm tra người dùng có trong nhóm hay không
    if (!user.groups.includes(groupObjectId)) {
      return res.json({
        status: "error",
        message: "Tạo task không thành công",
      });
    }
    // Kiểm tra thông tin người được giao nhiệm vụ
    const assignedTo = req.body.assignedto;
    if (assignedTo) {
      const assignedUser = await User.findById(assignedTo);
      if (!assignedUser || !assignedUser.groups.includes(groupObjectId)) {
        return res.json({
          status: "error",
          message: "Tạo task không thành công",
        });
      }
    }
    // Tạo task mới và trả về dữ liệu
    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      groups: groupObjectId,
      assignedTo: assignedTo,
      // deadline: req.body.deadline,
    });
    return res.status(201).json({
      status: "success",
      message: "Tạo task thành công",
      data: {
        task,
      },
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

module.exports.DelTask = async (req, res) => {
  //user tạo task và leader G dc xoá
  //
};
