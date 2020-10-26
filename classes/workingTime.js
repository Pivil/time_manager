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

    static create = async(id, arrival, departure) => {
        return new Promise((resolv, reject) => {
            var query =
                "INSERT INTO workingTime(userId, arrival, departure) VALUES (?, ?, ?)";
            pool
                .execute(query, [id, arrival, departure])
                .then(res => {
                    resolv(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    };

    static edit = async(id, arrival, departure) => {
        return new Promise((resolv, reject) => {
            var query =
                "UPDATE workingTime SET arrival = ?, departure = ? WHERE userId = ?";
            pool
                .execute(query, [arrival, departure, id])
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
            var query = "SELECT * FROM clock WHERE userId = ?";

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