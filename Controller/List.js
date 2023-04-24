const { startSucceeded } = require("init");
const List = require("../Model/List");
module.exports.getJod = async (req, res) => {
  try {
    const getList = await List.find({ userID: req.session.passport.user })
      .skip((req.body.skip - 1) * 10)
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
      const getList = await List.insertMany({
        userID: req.session.passport.user,
        job: req.body.job,
        status: req.body.status,
        title: req.body.title,
        description: req.body.description,
      });
      if (getList) {
        res.json({ status: "success", message: "Thêm thành công" });
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
        res.json({ status: "success", message: "Update thành công" });
      }
    }
  } catch (error) {
    res.send("error creating:" + error.message);
  }
};
module.exports.delJod = async (req, res) => {
  try {
    if (req.body || req.body.count > 0) {
      if (req.body.count > 1) {
        let convertString = await JSON.stringify(req.body.id);
        let arr = [];
        for (let i = 0; i < convertString.split(",").length; i++) {
          const test = convertString
            .split(",")
            [i].replace(`"`, ``)
            .replace(`[`, ``);
          arr.push(test);
        }
        const delList = await List.deleteMany({
          _id: {
            $in: arr,
          },
        });
        console.log(delList);
        if (delList.deletedCount > 0) {
          res.json({ status: "success", message: "Xoá thành công" });
        } else {
          res.json({ status: "error", data: [] });
        }
      } else {
        const delList = await List.deleteOne({ _id: req.body.id });
        if (delList.deletedCount > 0) {
          res.json({ status: "success", message: "Xoá thành công" });
        } else {
          res.json({ status: "error", data: [] });
        }
      }
    }
  } catch (error) {
    res.send("error creating:" + error.message);
  }
};
module.exports.findJob = async (req, res) => {
  try {
    const Findtodo = await List.find({
      userID: req.session.passport.user,
    });

    if (Findtodo) {
      if (req.body.job === "") {
        res.json({ data: { Total: Findtodo.length, Findtodo } });
      } else {
        const getjob = req.body.job;
        const Findtodo = await List.aggregate([
          { $match: { job: { $regex: getjob, $options: "i" } } },
        ]);
        // .skip((req.body.skip - 1) * req.body.limit)
        // .limit(req.body.limit || 10);
        res.json({ data: { Total: Findtodo.length, Findtodo } });
      }
    } else {
      res.json({ status: "false", data: null });
    }
  } catch (error) {
    res.send("error creating:" + error.message);
  }
};
