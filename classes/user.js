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
                        user.team = data.team;
                        resolv(user);
                    }
                })
                .catch(err => {
                    reject(err);
                });
        });
    };

    clocks = async() => {
        return new Promise((resolv, reject) => {
            var query = "SELECT * FROM clock WHERE userId = ? AND status = 1";

            pool.execute(query, [this.id]).then(res => {
                var id;
                if (res[0].length == 0) {
                    query =
                        "INSERT INTO clock (userId, clock_in, status) VALUES (?, NOW(), 1)";
                    id = this.id;
                } else {
                    query = "UPDATE clock SET clock_out = NOW(), status = 0 WHERE id = ?";
                    id = res[0][0].id;
                }
                pool.execute(query, [id]).then(res => {
                    resolv(res);
                });
            });
        });
    };

    update = async(username, email, id = null) => {
        return new Promise((resolv, reject) => {
            var query = "UPDATE user SET username = ?, email = ? WHERE id = ?";
            var userId = id || this.id;
            pool
                .execute(query, [username, email, userId])
                .then(res => {
                    resolv(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    };

    delete = async(id = null) => {
        return new Promise((resolv, reject) => {
            var query = "DELETE FROM user WHERE id = ?";

            var userId = id || this.id;
            pool
                .execute(query, [userId])
                .then(res => {
                    resolv(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    };

    addToTeam = async userId => {
        return new Promise((resolv, reject) => {
            var query = "INSERT INTO team(id, userId) VALUES (?, ?)";
            pool
                .execute(query, [this.team, userId])
                .then(res => {
                    resolv(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    };

    getTeam = async(id, team) => {
        return new Promise((resolv, reject) => {
            var query = "SELECT team FROM user WHERE id = ?";
            pool
                .execute(query, [this.id])
                .then(res => {
                    resolv(res[0][0].team);
                })
                .catch(err => {
                    reject(err);
                });
        });
    };

    promote = async id => {
        return new Promise((resolv, reject) => {
            var query =
                "UPDATE user SET role = 1, team = (SELECT * FROM (SELECT max(team) + 1 FROM user)as tmp)\
                WHERE id = ? and role = 0";

            pool
                .execute(query, [id])
                .then(res => {
                    console.log(res[0]);
                    if (res[0].info.includes(" Changed: 0"))
                        reject({ status: 0, message: "User is not an employee" });
                    resolv(res[0]);
                })
                .catch(err => {
                    reject(err);
                });
        });
    };

    static get = async id => {
        return new Promise((resolv, reject) => {
            var query = "SELECT * FROM user WHERE id = ?";
            pool
                .execute(query, [id])
                .then(async res => {
                    var data = res[0][0];
                    var user = await new User(data.token);
                    user.id = data.id;
                    user.username = data.username;
                    user.email = data.email;
                    user.role = data.role;
                    user.team = data.team;
                    resolv(user);
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
            var query =
                "SELECT id, username, email, role, team FROM user WHERE id = ?";

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