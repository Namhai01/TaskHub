function checkAuthentication (req , res, next) {
    if(req.isAuthenticated()){
        return res.json({status: 'Susscess', message: 'Login successful'});
        next();
    }else{
       res.json({status: 'Error', message: 'NotAuthenticated'})
    }
};
module.exports = checkAuthentication