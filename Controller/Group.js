const Group = require("../Model/Group.js");
const User = require("../Model/User.js");
const mongoose = require("mongoose");
module.exports.CreateGroup = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.session.passport.user });
    console.log(user);
    if (user) {
      const nameG = req.body.nameG;
      //User tạo nhóm
      await Group.create({
        leaderId: req.session.passport.user,
        name: nameG,
        members: [req.session.passport.user],
      });
      const findG = await Group.find({
        members: { $in: [req.session.passport.user] },
      });
      const getIdG = findG.map((G) => G._id);
      //Add id Groups vào user
      const a = await User.updateOne(
        { _id: req.session.passport.user },
        {
          $addToSet: { groups: { $each: getIdG } },
        }
      );
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
    if (checkGroup.leaderId.equals(idUser) && checkIdG.includes(groupId)) {
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
  try {
    // chỉ có leader mới xoá dc người khác
    const { userDel, groupId } = req.body;
    const idUser = new mongoose.Types.ObjectId(req.session.passport.user);
    const checkLeader = await Group.findOne({ _id: groupId, leaderId: idUser });
    if (!checkLeader || userDel === req.session.passport.user) {
      return res.json({
        data: {
          status: "error",
          message: "Bạn không thể xoá user khỏi nhóm này",
        },
      });
    } else {
      const [DelG, DelU] = await Promise.all([
        Group.updateOne(
          { _id: groupId, leaderId: idUser },
          { $pull: { members: userDel } }
        ),
        User.updateOne({ _id: userDel }, { $pull: { groups: groupId } }),
      ]);
      return res.json({
        data: {
          status: "success",
          message: "Xoá thành công",
        },
      });
    }
    // user xoá phải trong nhóm
  } catch (error) {
    console.log(error);
    res.json({
      data: { status: "error", message: "có lỗi" },
    });
  }
};
