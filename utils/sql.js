const mysql = require("mysql2/promise");
const pool = mysql.createPool({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "time_manager"
});

module.exports = {
    pool: pool
};