const User = require("../classes/user");
const Clock = require("../classes/clock");

getUserHours = async (req, res) => {
    try {
    var token = req.headers.token,
        id = req.params.id,
        type = req.params.type,
        from = req.body.from,
        to = req.body.to;

        var user = await new User(token);

        if (user.role == 1) {
            var workedTime = await Clock.getUserHours(user.team, type, from, to);
            res.status(200).send(workedTime);
        } else if (user.role == 2) {
            var workedTime = await Clock.getUserHours(id, type, from, to);
            res.status(200).send(workedTime);
        }
        else {
            throw { status: 0, message: "User is not a manager" };
        }
    } catch (err) {
        res.status(400).send(err);
    }
}

getTeamHours = async (req, res) => {
    try {
    var token = req.headers.token,
        id = req.params.id,
        type = req.params.type,
        from = req.body.from,
        to = req.body.to;

        var user = await new User(token);

        if (user.role == 1) {
            var workedTime = await Clock.getTeamHours(user.team, type, from, to);
        } else if (user.role == 2) {
            var workedTime = await Clock.getTeamHours(id, type, from, to);
        } else {
            throw { status: 0, message: "User is not a manager" };
        }
        res.status(200).send(workedTime);

    } catch (err) {
        res.status(400).send(err);
    }
}

clocks = async (req, res) => {
    try {
    var token = req.headers.token;

    var user = await new User(token);
    var result = await user.clocks();
        res.status(200).send(result);
    } catch (err) {
        res.status(400).send(err);
    }
}

module.exports = {
    getUserHours: getUserHours,
    getTeamHours: getTeamHours,
    clocks: clocks,
};