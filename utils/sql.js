const mysql = require("mysql2/promise");
const pool = mysql.createPool({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "time_manager"
});

var getUser = async id => {
    return new Promise((resolv, reject) => {
        pool
            .execute("SELECT * FROM user WHERE id = " + id)
            .then(data => {
                resolv(data[0][0]);
            })
            .catch(err => {
                reject(err);
            });
    });
};

module.exports = {
    pool: pool,
    getUser: getUser
};