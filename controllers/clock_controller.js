const User = require("../classes/user");
const Clock = require("../classes/clock");

getUserHours = async (req, res) => {
    var token = req.headers.token,
        id = req.params.id,
        type = req.params.type,
        from = req.body.from,
        to = req.body.to;

        var user = await new User(token);

        if (user.role == 1 || user.role == 2) {
            var workedTime = Clock.getUserHours(id, type, from, to);
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
    getUserHours:getUserHours,
    clocks: clocks
};