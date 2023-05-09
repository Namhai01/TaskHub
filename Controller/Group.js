const Group = require("../Model/Group.js");
const User = require("../Model/User.js");
const mongoose = require("mongoose");
module.exports.CreateGroup = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.session.passport.user });
    if (user) {
      const nameG = req.body.nameG;
      //User tạo nhóm
      await Group.insertMany({
        leaderId: req.session.passport.user,
        name: nameG,
        members: [req.session.passport.user],
      });
      const findG = await Group.find({
        members: { $in: [req.session.passport.user] },
      });
      const getIdG = findG.map((G) => G._id);
      //Add id Groups vào user
      await User.updateOne({ $addToSet: { groups: { $each: getIdG } } });
      res.json({
        data: { status: "success", message: "Tạo nhóm thành công! " },
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      data: { status: "error", message: "có lỗi" },
    });
  }
};

module.exports.DelGroup = async (req, res) => {
  try {
    const groupId = req.body.groupId;
    const findGroup = await Group.findById({ _id: groupId });
    if (!findGroup) {
      res.json({
        data: { status: "error", message: "Không tìm thấy nhóm" },
      });
    } else {
      const idUser = new mongoose.Types.ObjectId(req.session.passport.user);
      const idGroup = findGroup?.leaderId;
      if (idGroup?.equals(idUser)) {
        await Group.deleteOne({ _id: groupId });
        await User.updateOne({ $pull: { groups: groupId } });
        res.json({
          data: { status: "success", message: "Nhóm đã xoá" },
        });
      } else {
        res.json({
          data: { status: "error", message: "Bạn không thể xoá nhóm này" },
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.json({
      data: { status: "error", message: "có lỗi" },
    });
  }
};

module.exports.Adduser = async (req, res) => {
  try {
    // user mời phải trong nhóm và là trưởng nhóm
    const { userAdd, groupId } = req.body;
    const idUser = new mongoose.Types.ObjectId(req.session.passport.user);
    const [checkUser, checkUserAdd, checkGroup] = await Promise.all([
      User.findById({ _id: req.session.passport.user }),
      User.findById({ _id: userAdd }),
      Group.findById({ _id: groupId }),
    ]);
    const checkIdGPromise = checkUser.groups.map((groupsid) =>
      groupsid.toString()
    );
    const checkIdUserAddPromise = checkUserAdd.groups.map((groupsid) =>
      groupsid.toString()
    );
    const checkIdMPromise = checkGroup.members.map((membersid) =>
      membersid.toString()
    );
    const [checkIdG, checkIdUserAdd, checkIdM] = await Promise.all([
      checkIdGPromise,
      checkIdUserAddPromise,
      checkIdMPromise,
    ]);
    if (checkIdUserAdd.includes(groupId)) {
      return res.json({
        data: {
          status: "error",
          message: "user này đã trong nhóm",
        },
      });
    }
    if (checkIdG.includes(groupId) && checkGroup.leaderId.equals(idUser)) {
      await User.findByIdAndUpdate(
        { _id: userAdd },
        { $push: { groups: groupId } }
      );
      await Group.findByIdAndUpdate(
        { _id: groupId },
        { $push: { members: userAdd } }
      );
      return res.json({
        data: {
          status: "success",
          message: "Thêm thành công",
        },
      });
    } else {
      return res.json({
        data: {
          status: "error",
          message: "Bạn không thể mời user vào nhóm này",
        },
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      data: { status: "error", message: "có lỗi" },
    });
  }
};

module.exports.Deluser = async (req, res) => {
  // chỉ có leader mới xoá dc người khác
  // user xoá phải trong nhóm
};
