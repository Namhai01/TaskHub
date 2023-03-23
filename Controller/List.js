const List = require('../Model/List')
module.exports.getJod = async (req, res) => {
    try {
        const getList = await List.find({ 'userID': req.session.passport.user })
        if (getList) {
            res.json({ getList });
        } else {
            res.send(null);
        }
    } catch (error) {
        res.send('error creating:' + error.message)
    }
}
module.exports.addJod = async (req, res) => {
    try {
        if (req.body) {
            const getList = await List.insertMany({ 'userID': req.session.passport.user, 'job': req.body.job, 'status': req.body.status });
            if (getList) {
                res.redirect('/api/list')
            }
        }
    } catch (error) {
        res.send('error creating:' + error.message)
    }
}
module.exports.updateJod = async (req, res) => {
    try {
        if (req.body) {
            const updateList = await List.updateOne({ _id: req.body.id }, { $set: { job: req.body.job, status: req.body.status } });
            if (updateList) {
                res.redirect('/api/list')
            }
        }
    } catch (error) {
        res.send('error creating:' + error.message)
    }
}
module.exports.delJod = async (req, res) => {
    try {
        if (req.body || req.body.count > 0) {
            if (req.body.count > 1) {
                let convertString = await JSON.stringify(req.body.id)
                let arr = []
                for (let i = 0; i < convertString.split(",").length; i++) {
                    const test = convertString.split(",")[i].replace(`"`, ``).replace(`[`, ``)
                    arr.push(test)
                }
                console.log(arr)
                const delList = await List.deleteMany({
                    '_id': {
                        '$in': arr
                    }
                });
                console.log(delList)
                if (delList.deletedCount > 0) {
                    res.redirect('/api/list')
                } else {
                    res.json({ status: 'error', data: [] })
                }
            } else {
                const delList = await List.deleteOne({ _id: req.body.id });
                if (delList.deletedCount > 0) {
                    res.redirect('/api/list')
                } else {
                    res.json({ status: 'error', data: [] })
                }
            }
        }
    } catch (error) {
        res.send('error creating:' + error.message)
    }
}
module.exports.findJob = async (req, res) => {
    try {
        const getList = await (await List.find({ 'userID': req.session.passport.user }))
        if (getList) {
            if (req.body.job === "") {
                res.json({ status: 'sucsess', data: getList });
            } else {
                const find = getList.filter(getList => getList.job == req.body.job)
                res.json({ status: 'sucsess', data: find });
            }
        } else {
            res.json({ status: 'false', data: null });
        }

    } catch (error) {
        res.send('error creating:' + error.message)
    }
}