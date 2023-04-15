const User = require("../Model/User");
const conditions = {
  userName: 1,
  phone: 1,
  email: 1,
};
module.exports.userInfo = async (req, res) => {
  try {
    const user = await User.findOne(
      { _id: req.session.passport.user },
      conditions
    );
    if (user) {
      res.json({ status: "success", data: user });
    }
  } catch (error) {
    res.send("error creating:" + error.message);
  }
};

module.exports.userChangeInfo = async (req, res) => {
  try {
    if (req.body) {
      const user = await User.findOneAndUpdate(
        { _id: req.session.passport.user },
        { userName: req.body.username, phone: req.body.phone }
      );
      if (user) {
        res.json({ status: "success", message: "Thay đổi thành công" });
      } else {
        res.json({ status: "success", message: "Thay đổi không thành công" });
      }
    } else {
      res.json({ status: "success", message: "Thiếu thông tin" });
    }
  } catch (error) {
    res.send("error creating:" + error.message);
  }
};

module.exports.userAvatar = async (req, res) => {};
