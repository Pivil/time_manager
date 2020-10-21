var pool = require("../utils/sql").pool;
var cache = require("memory-cache");

var getAllToken = () => {
    return new Promise(function(resolv, reject) {
        let query = "SELECT token, id FROM user";

        pool.query(query, function(error, rows, fields) {
            if (error) {
                reject(error);
            } else {
                resolv(rows);
            }
        });
    });
};

var initCache = async() => {
    var tokens = await getAllToken();
    tokens.forEach(token => {
        cache.put(token.token, token.id);
    });
};

var checkToken = token => {
    return cache.get(token) != null;
};

module.exports = {
    getAllToken: getAllToken,
    initCache: initCache,
    checkToken: checkToken
};