const User = require("../classes/user.js");

var create = async(req, res) => {
    try {
        var params = req.body,
            username = params.username,
            email = params.email,
            role = req.params.role;

        User.create(username, email, role);
        res.status(200).send("Created");
    } catch (err) {
        res.status(400).send(err);
    }
};

var get = async(req, res) => {
    try {
        var token = req.headers.token;
        var user = await new User(token);
        res.status(200).send(user);
    } catch (err) {
        res.status(400).send(err);
    }
};

var show = async(req, res) => {
    try {
        var id = req.params.id;
        res.status(200).send(await User.show(id));
    } catch (err) {
        res.status(400).send(err);
    }
};

var deleteUser = async(req, res) => {
    try {
        var user = await new User(req.headers.token);

        var id = req.params.id;
        if (id != undefined) {
            if (user.role == 2) {
                await user.delete(id);
            } else {
                throw { status: 0, message: "User is not a general manager" };
            }
        } else {
            await user.delete();
        }
        res.status(200).send("Deleted");
    } catch (err) {
        res.status(400).send(err);
    }
};

var update = async(req, res) => {
    try {
        var user = await new User(req.headers.token);
        var params = req.body,
            username = params.username,
            email = params.email,
            password = params.password,
            id = req.params.id;

        if (id) {
            if (user.role == 2) {
                await user.update(username, email, id);
            } else {
                throw { status: 0, message: "User is not a general manager" };
            }
        } else {
            await user.update(username, email);
        }
        res.status(201).send("Updated");
    } catch (err) {
        res.status(400).send(err);
    }
};

var addToTeam = async(req, res) => {
    try {
        var token = req.headers.token,
            userId = req.body.userId;

        var user = await new User(token);
        if (user.role == 1) {
            await user.addToTeam(userId);
        } else {
            throw { status: 0, message: "User is not a manager" };
        }
        res.status(200).send("Added to team");
    } catch (err) {
        res.status(400).send(err);
    }
};

var promote = async(req, res) => {
    try {
        var token = req.headers.token,
            userId = req.params.id;

        var user = await new User(token);

        if (user.role == 2) {
            await user.promote(userId);
        } else {
            throw { status: 0, message: "User is not a general manager" };
        }
        res.status(200).send("User promoted to manager");
    } catch (err) {
        res.status(400).send(err);
    }
};

module.exports = {
    create: create,
    get: get,
    update: update,
    deleteUser: deleteUser,
    show: show,
    addToTeam: addToTeam,
    promote: promote
};