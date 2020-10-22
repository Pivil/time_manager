const User = require("../classes/user");
var expect = require("chai").expect;
var cache = require("memory-cache");
var { pool, getUser } = require("../utils/sql");

var generateRandom = () => {
    return (
        "[MOCHA] - " +
        Math.random()
        .toString(36)
        .substring(7)
    );
};

describe("create", () => {
    describe("employee", () => {
        it("should add a new user", async function() {
            var username = generateRandom(),
                email = generateRandom(),
                role = "employee";

            var res = await User.create(username, email, role);
            var user = await User.get(res[0].insertId);
            expect(user.username).to.equal(username);
            expect(user.email).to.equal(email);
            expect(user.role).to.equal("0");
            expect(user.id).to.not.be.null;
            user.delete();
        });
    });

    describe("manager", () => {
        it("should add a new user", async function() {
            var username = generateRandom(),
                email = generateRandom(),
                role = "manager";

            var res = await User.create(username, email, role);
            var user = await User.get(res[0].insertId);
            expect(user.username).to.equal(username);
            expect(user.email).to.equal(email);
            expect(user.role).to.equal("1");
            expect(user.id).to.not.be.null;
            user.delete();
        });
    });

    describe("generalManager", () => {
        it("should add a new user", async function() {
            var username = generateRandom(),
                email = generateRandom(),
                role = "generalManager";

            var res = await User.create(username, email, role);
            var user = await User.get(res[0].insertId);
            expect(user.username).to.equal(username);
            expect(user.email).to.equal(email);
            expect(user.role).to.equal("2");
            expect(user.id).to.not.be.null;
            user.delete();
        });
    });
});

describe("update", () => {
    describe("employee", () => {
        it("should user update himself", async function() {
            var username = generateRandom(),
                email = generateRandom(),
                role = "employee";

            var res = await User.create(username, email, role);

            var user = await User.get(res[0].insertId);
            var username = generateRandom(),
                email = generateRandom();

            user.update(username, email);

            var user = await User.get(res[0].insertId);
            expect(user.username).to.equal(username);
            expect(user.email).to.equal(email);
            expect(user.role).to.equal("0");
            expect(user.id).to.not.be.null;
            user.delete();
        });
    });

    describe("generalManager", () => {
        it("should update an employee", async function() {
            var user = await User.get(1);
            var username = generateRandom(),
                email = generateRandom();

            await user.update(username, email, 9);

            getUser(9).then(user => {
                expect(user.username).to.equal(username);
                expect(user.email).to.equal(email);
                expect(user.role).to.equal("0");
                expect(user.id).to.not.be.null;
            });
        });
    });
});

describe("delete", () => {
    describe("employee", () => {
        it("should user delete himself", async function() {
            var username = generateRandom(),
                email = generateRandom(),
                role = "employee";

            var res = await User.create(username, email, role);

            var user = await User.get(res[0].insertId);

            var deleteRes = await user.delete();
            try {
                var user = await User.get(res[0].insertId);
            } catch (err) {
                expect(deleteRes[0].affectedRows).to.equal(1);
                expect(1).to.equal(1);
            }
        });
    });

    describe("generalManager", () => {
        it("should user delete employee", async function() {
            var username = generateRandom(),
                email = generateRandom(),
                role = "employee";

            var res = await User.create(username, email, role);

            var user = await User.get(1);
            var deleteRes = await user.delete(res[0].insertId);
            try {
                var user = await User.get(res[0].insertId);
            } catch (err) {
                expect(deleteRes[0].affectedRows).to.equal(1);
                expect(1).to.equal(1);
            }
        });
    });
});

describe("show", () => {
    describe("employee", () => {
        it("should user delete himself", async function() {
            var username = generateRandom(),
                email = generateRandom(),
                role = "employee";

            var res = await User.create(username, email, role);
            var user = await User.get(res[0].insertId);

            var res = await User.show(user.id);
            expect(user.username).to.equal(username);
            expect(user.email).to.equal(email);
            expect(user.role).to.equal("0");
            expect(user.id).to.not.be.null;
        });
    });
});