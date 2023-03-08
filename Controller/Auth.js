const User = require('../Model/User.js');
const bcrypt = require('bcrypt');
module.exports.Register = async (req, res) => {
    try {
        if (req.body) {
            const checkUser = await User.findOne({userName: req.body.username})
            if(!checkUser){
                const saltRounds = 10;
                const hash = bcrypt.hashSync(req.body.password, saltRounds);
                const data = await User.insertMany(
                    {password: hash , email: req.body.email, phone: req.body.phone, userName : req.body.username}
                )
                res.send('ok')
            }else{
                res.json({status: 'Tên đã được sử dụng'})
            }
        }
    } catch (error) {
        res.send('error creating:' + error.message)
    }
}

module.exports.Login = (req, res) => {
   
}
    


