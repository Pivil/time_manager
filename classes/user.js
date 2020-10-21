var md5 = require("md5");
var pool = require("../utils/sql").pool;
var randomstring = require("randomstring");
var cache = require("memory-cache");
var roleUtils = require("../utils/role");

class User {
    constructor(token) {
        this.token = token;
        this.id = cache.get(token);

        return (async() => {
            if (this.id) await this.initValues();
            return this;
        })();
    }

    initValues = async() => {
        return new Promise((resolv, reject) => {
            var user = this;
            var query = "SELECT * FROM user WHERE id = ?";
            pool
                .query(query, [this.id])
                .then(res => {
                    if (res[0].length > 0) {
                        var data = res[0][0];
                        user.id = data.id;
                        user.username = data.username;
                        user.email = data.email;
                        user.role = data.role;
                        resolv(user);
                    }
                })
                .catch(err => {
                    reject(err);
                });
        });
    };

    update = async(username, email) => {
        return new Promise((resolv, reject) => {
            var query = "UPDATE user SET username = ?, email = ? WHERE id = ?";

            pool
                .execute(query, [username, email, this.id])
                .then(res => {
                    resolv(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    };

    delete = async id => {
        return new Promise((resolv, reject) => {
            var query = "DELETE FROM user WHERE id = ?";

            pool
                .execute(query, [id])
                .then(res => {
                    resolv(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    };

    static create = async(username, email, role) => {
        return new Promise((resolv, reject) => {
            var token = randomstring.generate();

            var userRole = roleUtils.getRoleId(role);
            var query =
                "INSERT INTO user (username, email, token, role) VALUES (?, ?, ?, ?)";

            pool
                .execute(query, [username, email, token, userRole])
                .then(res => {
                    resolv(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    };

    static show = async id => {
        return new Promise((resolv, reject) => {
            var query = "SELECT id, username, email, role FROM user WHERE id = ?";

            pool
                .execute(query, [id])
                .then(res => {
                    resolv(res[0][0]);
                })
                .catch(err => {
                    reject(err);
                });
        });
    };
}

module.exports = User;