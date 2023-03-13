const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { Register, LogOut, Login } = require('../Controller/Auth.js');
const User = require('../Model/User.js');
const router = express.Router();
const checkAuthentication = require('../Middleware/checkAuthen');
const checkLogin = require('../Middleware/checkisLoggedIn.js');

// Roters
router.post('/Login'  ,checkLogin,passport.authenticate('local', {
    failureRedirect: '/api/auth/Login_false',
    successRedirect: '/api/list/'
}));

router.get('/Login_false', checkAuthentication, (req , res) =>{
    res.json({status:"Đăng nhập thất bại"})
});

router.get('/Secure', (req , res) =>{
    res.json({status:"Tài khoản đang có người login, mời đăng nhập lại"})
});

router.post('/Register', Register);

router.post('/Logout',checkAuthentication, LogOut);

router.get('/logout', (req , res) =>{
    res.json({status:"Đăng xuất thành công"})
});

// router.post('/forgetpassword', ForgetPassword)
//-----------------------------------------------------------------------------------------//
passport.use(new LocalStrategy( async (username, password, done) => {
    try {
        const findUser = await User.findOne({ userName: username })
        if(findUser){
            if (!(await bcrypt.compare(password , findUser.password))){ 
                return done(null, false); 
            }else{
                await User.updateOne({userName: username},{isLoggedIn: true});
                return done(null, findUser.id);
            }
        }else{
            done(null, false);
        }
    } catch (error) {
        done(null, error);
    }
}));
    
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});
module.exports = router;