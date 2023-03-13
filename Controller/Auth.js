const User = require('../Model/User.js');
const bcrypt = require('bcrypt');
module.exports.Register = async (req, res) => {
    try {
        if (req.body) {
            const Email = req.body.email;
            const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
            if(emailRegexp.test(Email)){
                const checkUser = await User.findOne({$or:[{userName: req.body.username},{email: Email}]})
                if(!checkUser){
                    const saltRounds = 10;
                    const hash = bcrypt.hashSync(req.body.password, saltRounds);
                    const data = await User.insertMany(
                        {password: hash , email: req.body.email, phone: req.body.phone, userName : req.body.username}
                    )
                    res.json({status: 'Success'})
                }else{
                    res.json({status:'error', Message: 'Email or username has already used'})
                }
            }else {
                res.json({status:'error', Message: 'Email không hợp lệ'})
            };
        }
    } catch (error) {
        res.send('error creating:' + error.message)
    }
}

module.exports.LogOut = async (req, res) => {
    try {
        const setLogin = await User.updateOne({_id: req.session.passport.user },{isLoggedIn: false});
        req.logout(async (err)=>{
            if(err) return res.json({ status:"Error", error: err })
            res.redirect('/api/auth/logout')
        })
    } catch (error) {
        res.send('error creating:' + error.message)
    }
}

module.exports.Login = async (req, res) => {
    const checkLogin = await User.findOne({userName: req.body.username});
    if(checkLogin.isLoggedIn === true) {
        req.logout(async (err)=>{
            if(err) return res.json({ status:"Error", error: err })
            const setLogin = await User.updateOne({userName: req.body.username},{isLoggedIn: false});
            res.redirect('/api/auth/Secure')
        })
    }else{
        res.json({success: true})
    }
}

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
    


