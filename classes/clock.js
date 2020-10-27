var pool = require("../utils/sql").pool;

class Clock {
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
                        clock.clock_in = data.clock_in;
                        clock.clock_out = data.clock_out;
                        clock.userId = data.userId;
                        clock.status = data.status;
                        resolv(user);
                    }
                })
                .catch(err => {
                    reject(err);
                });
        });
    };

    static getUserHours = async(userId, type, from, to ) => {
        return new Promise((resolv, reject) => {
            var query;
            if (type == "weekly") {
                query = 
                "SELECT SUM(TIMESTAMPDIFF(MINUTE, clock_in, clock_out)) as minutes,  CONCAT(YEAR(clock_in), '-', WEEKOFYEAR(clock_in)) as date\
                FROM clock\
                WHERE userId = ?\
                  AND clock_in >= ?\
                  AND clock_out <= ?\
                GROUP BY date";
            } else if (type == "daily") {
                query = 
                "SELECT SUM(TIMESTAMPDIFF(MINUTE, clock_in, clock_out)) as minutes, CONCAT(YEAR(clock_in), '-', MONTH(clock_in), '-', DAY(clock_in)) as date\
                FROM clock\
                WHERE userId = ?\
                  AND clock_in >= ?\
                  AND clock_out <= ?\
                GROUP BY date";
            }

            pool.execute(query, [userId, from, to])
            .then(res => {
                var data = res[0];
                var result = {};
                data.forEach(row => {
                    result[row.date] = row.minutes
                })

                resolv(result);
            })
        })
    }

    static getTeamHours = async(teamId, type, from, to ) => {
        return new Promise((resolv, reject) => {
            var query;
            if (type == "weekly") {
                query = 
                "SELECT (SELECT count(t.userId) FROM time_manager.team t LEFT JOIN time_manager.user u ON t.userId = u.id WHERE t.id = ?) as workers, SUM(TIMESTAMPDIFF(MINUTE, clock_in, clock_out)) as minutes,  CONCAT(YEAR(clock_in), '-', WEEKOFYEAR(clock_in)) as date\
                FROM clock c\
                LEFT JOIN time_manager.team t on c.userId = t.userId\
                WHERE t.id = ?\
                  AND clock_in >= ?\
                  AND clock_out <= ?\
                GROUP BY date";
            } else if (type == "daily") {
                query = 
                "SELECT (SELECT count(t.userId) FROM time_manager.team t LEFT JOIN time_manager.user u ON t.userId = u.id WHERE t.id = ?) as workers, SUM(TIMESTAMPDIFF(MINUTE, clock_in, clock_out)) as minutes, CONCAT(YEAR(clock_in), '-', MONTH(clock_in), '-', DAY(clock_in)) as date\
                FROM clock c\
                LEFT JOIN time_manager.team t on c.userId = t.userId\
                WHERE t.id = ?\
                  AND clock_in >= ?\
                  AND clock_out <= ?\
                GROUP BY date";
            }

            pool.execute(query, [teamId, teamId, from, to])
            .then(res => {
                var data = res[0];
                var result = {};
                data.forEach(row => {
                    result[row.date] = row.minutes / row.workers;
                })

                resolv(result);
            })
        })
    }

    
}

module.exports = Clock;