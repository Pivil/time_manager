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
                    console.log(res[0][0])
                    query = "UPDATE clock SET clock_out = NOW(), status = 0 WHERE id = ?";
                    id = res[0][0].id;
                }
                console.log(id);
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
                    cache.
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

    getTeamInfo = async(teamId) => {
        return new Promise((resolv, reject) => {
            var query = "SELECT * FROM user u LEFT JOIN team t ON u.id = t.userId WHERE t.id = ?";
            pool
                .execute(query, [teamId])
                .then(res => {
                    var data = res[0];
                    var res = {};
                    data.forEach(row => {
                        res[row.userId] = row;
                    })
                    resolv(res);
                })
                .catch(err => {
                    reject(err);
                })
        })
    };

    getRole = async id => {
        return new Promise((resolv, reject) => {
        var userId = id || this.id;
        var query = "SELECT role FROM user WHERE id = ?";

        pool
            .execute(query, [userId])
            .then(res => {
                var role = res[0][0].role;
                var label;
                switch (role) {
                    case 0:
                        label = "Employee";
                        break;
                    case 1:
                        label = "Manager";
                        break;
                    case 2: 
                        label = "General Manager";
                        break;
                    default:
                        break;
                }
                resolv({"role": role, "label": label});
            })
            .catch(err => {
                reject(err);
            })
        })
    }


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
                    cache.put(token, res[0].insertId);
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