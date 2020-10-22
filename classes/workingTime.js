var pool = require("../utils/sql").pool;

class WorkingTime {
    constructor(id) {
        this.id = id;

        return (async() => {
            if (this.id) await this.initValues();
            return this;
        })();
    }

    initValues = async() => {
        return new Promise((resolv, reject) => {
            var workingTime = this;
            var query = "SELECT * FROM workingTime WHERE id = ?";
            pool
                .query(query, [this.id])
                .then(res => {
                    if (res[0].length > 0) {
                        var data = res[0][0];
                        workingTime.arrival = data.arrival;
                        workingTime.departure = data.departure;
                        workingTime.userId = data.userId;
                        resolv(user);
                    }
                })
                .catch(err => {
                    reject(err);
                });
        });
    };

    static getDateOfWeek(w, y) {
        var d = 1 + (w - 1) * 7; // 1st of January + 7 days for each week
        var date = new Date(y, 0, d);
        var month = date.getMonth() + 1,
            year = date.getFullYear(),
            day = date.getDate();

        if (day < 10) {
            day = "0" + day;
        }

        if (month < 10) {
            month = "0" + month;
        }

        return (year + "-" + month + "-" + day).toString();
    }
    static getUserWorkingTime = async(id, type, from, to) => {
        return new Promise((resolv, reject) => {
            if (type == "daily") {
                var query =
                    "   SELECT TIMESTAMPDIFF(HOUR, arrival, departure) as workingTime, CONCAT(YEAR(arrival), '-', MONTH(arrival), '-', DAY(arrival)) as date\
                    FROM time_manager.workingTime WHERE userId = ? AND arrival >= ? AND departure <= ?";
            } else if (type == "weekly") {
                var query =
                    "   SELECT SUM(TIMESTAMPDIFF(HOUR, arrival, departure)) as workingTime, CONCAT(YEAR(arrival), '-', WEEK(arrival)) as date\
                    FROM time_manager.workingTime WHERE userId = ? AND arrival >= ? AND departure <= ?\
                    GROUP BY date";
            }

            pool
                .execute(query, [id, from, to])
                .then(res => {
                    var wt = {};
                    var total = 0;
                    res[0].forEach(row => {
                        wt[row.date] = row.workingTime;
                        total += +row.workingTime;
                    });
                    wt["total"] = total;
                    resolv(wt);
                })
                .catch(err => {
                    reject(err);
                });
        });
    };

    static getTeamAverageWorkingTime = async(teamId, type, from, to) => {
        return new Promise((resolv, reject) => {
            if (type == "daily") {
                var query =
                    "   SELECT AVG(TIMESTAMPDIFF(HOUR, arrival, departure)) as workingTime, CONCAT(YEAR(arrival), '-', MONTH(arrival), '-', DAY(arrival)) as date\
                    FROM time_manager.workingTime wt\
                    LEFT JOIN time_manager.team t ON wt.userId = t.userId \
                    WHERE t.id = ? AND arrival >= ? AND departure <= ?\
                    GROUP BY date";
            } else if (type == "weekly") {
                var query =
                    "   SELECT AVG(TIMESTAMPDIFF(HOUR, arrival, departure)) as workingTime, CONCAT(YEAR(arrival), '-', WEEK(arrival)) as date\
                    FROM time_manager.workingTime WHERE userId = ? AND arrival >= ? AND departure <= ?\
                    GROUP BY date";
            }

            pool
                .execute(query, [teamId, from, to])
                .then(res => {
                    var wt = {};
                    res[0].forEach(row => {
                        wt[row.date] = row.workingTime;
                    });
                    resolv(wt);
                })
                .catch(err => {
                    reject(err);
                });
        });
    };
    static create = async(userId, arrival) => {
        return new Promise((resolv, reject) => {
            var query = "INSERT INTO workingTime (userId, arrival) VALUES (?, ?)";
            pool
                .execute(query, [userId, arrival])
                .then(res => {
                    resolv(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    };

    static departure = async(userId, arrival) => {
        return new Promise((resolv, reject) => {
            var query = "INSERT INTO workingTime (userId, departure) VALUES (?, ?)";
            pool
                .execute(query, [userId, arrival])
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

module.exports = WorkingTime;