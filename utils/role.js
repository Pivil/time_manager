var pool = require("../utils/sql").pool;

var getRoleId = role => {
    switch (role) {
        case "employee":
            role = "0";
            break;

        case "manager":
            role = "1";
            break;

        case "generalManager":
            role = "2";
            break;

        default:
            break;
    }
    return role;
};

module.exports = {
    getRoleId: getRoleId
};