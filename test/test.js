const User = require("../classes/user");
const WorkingTime = require("../classes/workingTime");

const roleUtils = require("../utils/role");
const pool = require("../utils/sql").pool;
const tokenUtils = require("../utils/token");
var cache = require("memory-cache");

function importTest(name, path) {
    describe(name, function() {
        require(path);
    });
}

describe("Chai-Mocha Unit Test", function() {
    after(() => {
        pool.end();
    });

    before(async() => {
        await tokenUtils.initCache();
    });

    importTest("User", "./user");
    importTest("Clock", "./clock");
});