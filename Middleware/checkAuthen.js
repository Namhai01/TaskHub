function checkAuthentication (req , res, next) {
    if(req.isAuthenticated()){
        next();
    }else{
       res.json({status: 'Error', message: 'NotAuthenticated'})
    }
};
module.exports = checkAuthentication