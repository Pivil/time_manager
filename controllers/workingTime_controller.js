const WorkingTime = require("../classes/workingTime");
const User = require("../classes/user");

var create = async(req, res) => {
    try {
        var arrival = req.body.arrival,
            token = req.headers.token;

        var user = await new User(token);
        await WorkingTime.create(user.id, arrival);
        res.status(200).send("Arrival submited");
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
};

var departure = async(req, res) => {
    try {
        var departure = req.body.departure,
            token = req.headers.token;

        var user = await new User(token);
        await WorkingTime.departure(user.id, departure);
        res.status(200).send("Departure submited");
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
};

var getTeamAverageWorkingTime = async(req, res) => {
    try {
        var token = req.headers.token,
            type = req.params.type,
            from = req.body.from,
            to = req.body.to;

        var user = await new User(token);
        if (user.role == 1) {
            var average = await WorkingTime.getTeamAverageWorkingTime(
                user.team,
                type,
                from,
                to
            );
            res.status(200).send({ average });
        } else {
            throw { status: 0, message: "User is not a manager" };
        }
    } catch (err) {
        res.status(400).send(err);
    }
};

module.exports = {
    create: create,
    getTeamAverageWorkingTime: getTeamAverageWorkingTime,
    departure: departure
};