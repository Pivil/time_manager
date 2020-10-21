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

var update = async(req, res) => {
    try {
        var user = await new User(req.headers.token);
        var username = req.body.username || user.username;
        var email = req.body.email || user.email;

        await user.update(username, email);
        res.status(201).send(await new User(req.headers.token));
    } catch (err) {
        res.status(400).send(err);
    }
};

var deleteUser = async(req, res) => {
    try {
        var user = await new User(req.headers.token);
        await user.delete(req.params.id);
        res.status(200).send("Deleted");
    } catch (err) {
        res.status(400).send(err);
    }
};

var updateById = async(req, res) => {
    try {
        var params = req.body,
            username = params.username,
            email = params.email,
            password = params.password;

        var user = await new User();
    } catch (err) {
        res.status(400).send(err);
    }
};

module.exports = {
    create: create,
    get: get,
    update: update,
    delete: deleteUser,
    updateById: updateById,
    show: show
};