const config = require("./config");
const token = require("./utils/token");
var cors = require('cors')

//* EXPRESS */
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

//* CACHE */
var cache = require("memory-cache");
let port = config.expressPort;
var options = {
    explorer: true
};

token.initCache();

app.use(cors());
app.use(function(req, res, next) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
    res.header(
        "Access-Control-Allow-Headers",
        "X-Requested-With, Content-Type, Authorization, token"
    );
    res.header("Content-Type", "application/json");

    if (token.checkToken(req.headers.token)) next();
    else {
        res.status(404).send({ error: "bad token" }); //bad token
    }
});

app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use(bodyParser.json());

var routes = {};
routes.user = require("./controllers/user_controller");
routes.workingTime = require("./controllers/workingTime_controller");
routes.clock = require("./controllers/clock_controller");

// USERS
app.post(
    "/api/users/:role(employee|manager|generalManager)/",
    routes.user.create
);
app.get("/api/users/:id", routes.user.show);
app.get("/api/users/role/(:id?)", routes.user.getRole);

app.put("/api/users/(:id?)", routes.user.update);
app.delete("/api/users/(:id?)", routes.user.deleteUser);
app.put("/api/users/promote/(:id?)", routes.user.promote);
app.get("/api/users/", routes.user.get);

// CLOCKS
app.post("/api/clocks", routes.clock.clocks);
app.get("/api/clock/:type(weekly|daily)/(:id?)", routes.clock.getUserHours);
app.get("/api/clock/team/:type(weekly|daily)/(:id?)", routes.clock.getTeamHours);

// TEAMS
app.post("/api/team/:userId", routes.user.addToTeam);
app.get("/api/team/info/(:teamId?)", routes.user.getTeamInfo);

// WORKING TIMES
app.post("/api/workingTime/create/:userId", routes.workingTime.create);
app.put("/api/workingTime/edit/:userId", routes.workingTime.edit);
app.get("/api/workingTime/(:userId?)", routes.workingTime.get);

app.listen(process.env.PORT || 3000, function() {
    console.log("it works !!");
    console.log("App listening on port " + port);
});