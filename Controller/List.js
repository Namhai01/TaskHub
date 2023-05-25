const List = require("../Model/List");
module.exports.getJod = async (req, res) => {
  try {
    const getList = await List.find({ userID: req.session.passport.user })
      .skip((req.query.skip - 1) * 10)
      .limit(10);
    const Total = await List.count({ userID: req.session.passport.user });
    if (getList) {
      res.json({ data: { Total: Total, getList } });
    } else {
      res.send(null);
    }
  } catch (error) {
    res.send("error creating:" + error.message);
  }
};
module.exports.addJod = async (req, res) => {
  try {
    if (req.body) {
      const getList = await List.create({
        userID: req.session.passport.user,
        job: req.body.job,
        title: req.body.title,
        description: req.body.des,
      });
      if (getList) {
        const Count = await List.count({ userID: req.session.passport.user });
        const getList = await List.find({ userID: req.session.passport.user })
          .skip((req.body.skip - 1) * 10)
          .limit(10);
        res.json({
          data: {
            Total: Count,
            status: "success",
            message: "Thêm thành công",
            getList,
          },
        });
      }
    }
  } catch (error) {
    res.send("error creating:" + error.message);
  }
};
module.exports.updateJod = async (req, res) => {
  try {
    if (req.body) {
      const updateList = await List.updateOne(
        { _id: req.body.id },
        {
          $set: {
            job: req.body.job,
            status: req.body.status,
            title: req.body.title,
            description: req.body.des,
          },
        }
      );
      if (updateList) {
        const Count = await List.count({ userID: req.session.passport.user });
        const getList = await List.find({ userID: req.session.passport.user })
          .skip((req.body.skip - 1) * 10)
          .limit(10);
        res.json({
          data: {
            Total: Count,
            status: "success",
            message: "Update thành công",
            getList,
          },
        });
      }
    }
  } catch (error) {
    res.send("error creating:" + error.message);
  }
};
module.exports.delJod = async (req, res) => {
  try {
    if (req.body.id) {
      const delList = await List.deleteOne({ _id: req.body.id });
      const Count = await List.count({ userID: req.session.passport.user });
      const getList = await List.find({ userID: req.session.passport.user })
        .skip(10)
        .limit(10);
      if (delList.deletedCount > 0) {
        res.json({
          data: {
            Total: Count,
            status: "success",
            message: "Xoá thành công",
            getList,
          },
        });
      } else {
        res.json({
          data: {
            Total: Count,
            status: "false",
            message: "Xoá không thành công",
            getList,
          },
        });
      }
    }
  } catch (error) {
    res.send("error creating:" + error.message);
  }
};
module.exports.findJob = async (req, res) => {
  try {
    const Count = await List.count({ userID: req.session.passport.user });

    if (Count > 0) {
      if (req.body.job === "") {
        const Findtodo = await List.find({
          userID: req.session.passport.user,
        })
          .skip((req.query.skip - 1) * 10)
          .limit(10);
        res.json({ data: { Total: Count, Findtodo } });
      } else {
        const getjob = req.body.job;
        const CountFinds = await List.aggregate([
          { $match: { job: { $regex: getjob, $options: "i" } } },
        ]);

        if (CountFinds.length > 0) {
          const Findtodo = await List.aggregate([
            { $match: { job: { $regex: getjob, $options: "i" } } },
          ])
            .skip((req.query.skip - 1) * 10)
            .limit(10);
          res.json({ data: { Total: CountFinds.length, Findtodo } });
        } else {
          res.json({
            data: { Total: CountFinds.length, message: "Không tìm thấy" },
          });
        }
      }
    } else {
      res.json({ status: "false", data: null });
    }
  } catch (error) {
    res.send("error creating:" + error.message);
  }
};
