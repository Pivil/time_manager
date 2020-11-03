const WorkingTime = require("../classes/workingTime");
const User = require("../classes/user");
const roleUtils = require("../utils/role");

var create = async(req, res) => {
    try {
        var arrival = req.body.arrival,
            departure = req.body.departure,
            token = req.headers.token,
            userId = req.params.userId;

        var user = await new User(token);
        await WorkingTime.create(userId, arrival, departure);
        res.status(200).send("Working time created");
    } catch (err) {
        res.status(400).send(err);
    }
};

var edit = async(req, res) => {
    try {
        var arrival = req.body.arrival,
            departure = req.body.departure,
            token = req.headers.token,
            userId = req.params.userId;

        var user = await new User(token);
        await WorkingTime.edit(userId, arrival, departure);
        res.status(200).send("Working time updated");
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
};

var get = async(req, res) => {
    try {
        var userId = req.params.userId,
            token = req.headers.token;

        if (!userId) {
            var user = await new User(token);
            userId = user.id;
        }
        var wt = await WorkingTime.get(userId);
        res.status(200).send(wt);
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
};

module.exports = {
    create: create,
    edit: edit,
    get: get
};