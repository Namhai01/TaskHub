const { default: mongoose } = require("mongoose");
const Task = require("../Model/Task");
const User = require("../Model/User");
const Group = require("../Model/Group");
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
  try {
    const taskId = req.body.taskId;
    const userId = req.session.passport.user;
    const user = await User.findById(userId);
    const task = await Task.findById(taskId);

    if (!user || !task) {
      return res.status(404).json({
        status: "error",
        message: "Không tìm thấy người dùng hoặc công việc",
      });
    }

    const group = await Group.findById(task.groups);
    if (!group) {
      return res
        .status(404)
        .json({ status: "error", message: "Không tìm thấy nhóm" });
    }
    // if (!user.groups.some((id) => console.log(id.equals(task.groups)))) {
    //   return res.status(403).json({
    //     status: "error",
    //     message: "Người dùng không có quyền xoá công việc",
    //   });
    // }
    if (group.leaderId.toString() !== userId) {
      return res.status(403).json({
        status: "error",
        message: "Chỉ nhóm trưởng mới có thể xoá công việc",
      });
    }
    await Task.findByIdAndDelete({ _id: taskId });
    return res
      .status(200)
      .json({ status: "success", message: "Xoá task thành công" });
  } catch (error) {
    res.status(400).send(error.message);
  }
};
