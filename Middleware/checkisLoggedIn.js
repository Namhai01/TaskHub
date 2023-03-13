const User = require("../Model/User");

async function checkLogin (req, res, next) {
    try {
        const checkLogin = await User.findOne({userName: req.body.username });
    if(checkLogin){
        if(checkLogin.isLoggedIn === true) {
            res.redirect('/api/auth/secure')
        }else{
            next();
        }
    }else{
        res.json({status:'error', Message: 'Đăng nhập không thành công'})
    }
    } catch (error) {
        res.send('error creating:' + error.message)
    }
    

}
module.exports = checkLogin