// ? ----- [ Packages ] -----
const moment = require('moment');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv/config');

// ? ----- [ Variables ] -----
const db = require('../services/db');
const helper = require('../util/helper');
const { cLog } = require('../util/logger');

// ? ----- [ Functions ] -----
async function register(reqBody) {
    let { username, email, password, address, phone, role } = reqBody;

    if (!username || !email || !password || !address || !phone) {
        return {
            message: "Please fill all fields.",
            code: 400
        };
    }

    if (!role) {
        role = "user";
    }

    if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
        return {
            message: "Email is not a valid email.",
            code: 400
        };
    }

    if (password.length < 6) {
        return {
            message: "Password should be at least 6 characters long.",
            code: 400
        }
    };

    const findEmail = await db.query(`SELECT * FROM user WHERE email="${email}"`);
    const emailData = helper.emptyOrRows(findEmail);

    if (emailData.length != 0) {
        return {
            message: "This email is already in use.",
            code: 409
        }
    } else {
        const findUsername = await db.query(`SELECT * FROM user WHERE username="${username}"`);
        const usernameData = helper.emptyOrRows(findUsername);

        if (usernameData.length != 0) {
            return {
                message: "This username is already in use.",
                code: 409
            }
        } else {
            // password = await bcrypt.hash(password, 10);

            const query = await db.query(
                `INSERT INTO user
                (username, email, password, address, phone, role)
                VALUES ("${username}", "${email}", "${password}", "${address}", "${phone}", "${role}")`
            );
            if (query.affectedRows) {
                return {
                    message: "User registered successfully.",
                    code: 200
                }
            }
        }
    }
}

async function login(reqBody) {
    const { user, password } = reqBody;

    if (!user || !password) {
        return {
            message: "Please fill all fields.",
            code: 400
        };
    }

    const query = await db.query(`SELECT * FROM user WHERE email="${user}" OR username="${user}"`);
    const data = helper.emptyOrRows(query);

    if (data.length == 0) {
        return {
            message: "User not found.",
            code: 401
        }
    } else {
        try {
            const result = await new Promise((resolve, reject) => {
                bcrypt.compare(password, data[0].password, (err, res) => {
                    if (err) {
                        cLog(`Error while comparing password >>> ${err.message}.`);
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
            });

            if (result) {
                const token = jwt.sign({ id: data[0].id }, process.env.JWT_SECRET, {
                    expiresIn: "1h"
                });
                db.query(
                    `UPDATE user SET last_login = "${moment().format(
                        "YYYY-MM-DD HH:mm:ss"
                    )}" WHERE id = "${data[0].id}"`
                );
                return {
                    message: "Successfully logged in.",
                    token,
                    userid: data[0].id,
                    userrole: data[0]["role"],
                    code: 200
                };
            } else {
                return {
                    message: "Email or password is incorrect.",
                    code: 401
                };
            }
        } catch (err) {
            console.log(err);
            return {
                message: "Internal Error.",
                code: 500
            };
        }
    }
}

// ? ----- [ Export Module ] -----
module.exports = {
    register,
    login
}