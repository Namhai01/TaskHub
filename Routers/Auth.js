const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { Register, Login } = require('../Controller/Auth.js');
const User = require('../Model/User.js');
const router = express.Router();
const checkAuthentication = require('../Middleware/checkAuthen');
// Roters
router.post('/Login', passport.authenticate('local', {
    failureRedirect: '/api/auth/Login_false',
    successRedirect: '/api/list/'
}), (req , res) =>{
});

router.get('/Login_false', checkAuthentication, (req , res) =>{
    res.json({status:"đăng nhập thất bại"})
});

router.post('/Register', Register);
 
router.get('/', checkAuthentication, (req , res) => {
        res.send("ok")
});

passport.use(new LocalStrategy( async (username, password, done) => {
    try {
        const findUser = await User.findOne({ userName: username })
        if(findUser){
            if (!(await bcrypt.compare(password , findUser.password))){ 
                return done(null, false); 
            }else{
                done(null, findUser.id);
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