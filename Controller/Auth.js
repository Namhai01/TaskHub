const User = require("../Model/User.js");
const bcrypt = require("bcrypt");
module.exports.Register = async (req, res) => {
  try {
    if (req.body) {
      const Email = req.body.email;
      const emailRegexp =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      if (emailRegexp.test(Email)) {
        const checkUser = await User.findOne({ userName: req.body.username });
        if (!checkUser) {
          const saltRounds = 10;
          const hash = bcrypt.hashSync(req.body.password, saltRounds);
          const data = await User.insertMany({
            password: hash,
            email: req.body.email,
            phone: req.body.phone,
            userName: req.body.username,
          });
          res.json({ status: "Success" });
        } else {
          res.json({
            status: "error",
            Message: "Username has already used",
          });
        }
      } else {
        res.json({ status: "error", Message: "Email không hợp lệ" });
      }
    }
  } catch (error) {
    res.send("error creating:" + error.message);
  }
};

module.exports.LogOut = async (req, res) => {
  try {
    await User.updateOne(
      { _id: req.session.passport.user },
      { isLoggedIn: false }
    );
    req.logout(async (err) => {
      if (err) return res.json({ status: "Error", error: err });
      res.json({ status: "success", message: "Đã logOut" });
    });
  } catch (error) {
    res.send("error creating:" + error.message);
  }
};

module.exports.Login = async (req, res) => {
  try {
    const conditions = {
      userName: 1,
      phone: 1,
      email: 1,
      isLoggedIn: 1,
    };
    if (req.session.passport.user) {
      const find = await User.findById(
        { _id: req.session.passport.user },
        conditions
      );
      if (res.statusCode == 401) {
        console.log("a");
      }
      if (find) {
        res.json(find);
      }
    } else {
      res.json({ data: null });
    }
  } catch (error) {
    res.send("error creating:" + error.message);
    // console.log(error.message);
  }
};

// module.exports.ForgetPassword = async (req, res) => {
//     try {
//         if(req.body){
//             const Email = req.body.email;
//             const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
//             if(emailRegexp.test(Email)){
//                 const checkEmail = await User.findOne({email: Email})
//                 if(checkEmail){
//                     console.log(checkEmail)
//                 }
//             }else{
//                 response.json({status:'error', Message: 'Invalid email'})
//             }
//         }else{
//             res.send('error creating:' + error.message)
//         }
//     } catch (error) {
//         res.send('error creating:' + error.message)
//     }
// }
