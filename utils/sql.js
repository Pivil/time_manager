const mysql = require("mysql2/promise");
const pool = mysql.createPool({
    host: "us-cdbr-east-02.cleardb.com",
    port: 3306,
    user: "bfba7887dedcf2",
    password: "3cf80ce0",
    database: "heroku_8286b8f0f97b83b"
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