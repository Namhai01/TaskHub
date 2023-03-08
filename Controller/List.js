const List = require('../Model/List')
module.exports.getJod = async (req, res) => {
    try {
        const getList = await List.find({ 'userName': req.session.passport.user });
        if (getList) {
            res.json({ status: 'sucsess', data: getList });
        } else {
            res.json({ status: 'false', data: null });
        }

    } catch (error) {
        res.send('error creating:' + error.message)
    }
}
module.exports.addJod = async (req, res) => {
    try {
        if (req.body){
            const getList = await List.insertMany({ 'userName': req.session.passport.user,'job': req.body.job, 'status': req.body.status});
            if(getList){
                res.redirect('/api/list')
            }
        }
    } catch (error) {
        res.send('error creating:' + error.message)
    }
}

module.exports.updateJod = async (req, res) => {
    try {
        if (req.body){
            const updateList = await List.updateOne({_id: req.body.id},{ $set:{ job: req.body.job , status: req.body.status}});
            if(updateList){
                res.redirect('/api/list')
            }
        }
    } catch (error) {
        res.send('error creating:' + error.message)
    }
}