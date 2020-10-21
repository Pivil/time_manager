class Manager extends User {
    constructor(token) {
        super(token);
        this.table = "manager";
    }

    create = async() => {
        return new Promise((resolv, reject) => {
            var token = randomstring.generate();
            var query = "INSERT INTO user (username, email, token) VALUES (?, ?, ?)";

            pool
                .execute(query, [this.username, this.email, token])
                .then(res => {
                    resolv(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    };
}