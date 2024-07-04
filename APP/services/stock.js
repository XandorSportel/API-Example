// ? ----- [ Packages ] -----
const moment = require('moment');

// ? ----- [ Variables ] -----
const db = require('../services/db');
const helper = require('../util/helper');

// ? ----- [ Functions ] -----
async function getAll() {
    const query = await db.query(`SELECT * FROM stock`);
    const data = helper.emptyOrRows(query);

    if (data.length == 0) {
        return {
            message: "No stock found.",
            code: 404
        };
    } else {
        return {
            message: "Stock found.",
            code: 200,
            numberOfStock: data.length,
            data
        };
    }
}

async function getOne(id) {
    const query = await db.query(`SELECT * FROM stock WHERE id=${id}`);
    const data = helper.emptyOrRows(query);

    if (data.length == 0) {
        return {
            message: "No stock found.",
            code: 404
        };
    } else {
        return {
            message: "Stock found.",
            code: 200,
            data
        };
    }
}

async function create(reqBody) {
    if (!reqBody.product_id || !reqBody.quantity) {
        return {
            message: "Please provide all required information.",
            code: 400
        };
    }

    const query = await db.query(`INSERT INTO stock (product_id, quantity) VALUES (${reqBody.product_id}, ${reqBody.quantity})`);
    
    if (query.affectedRows) {
        return {
            message: `Stock created with id #${query.insertId}.`,
            stockId: query.insertId,
            code: 201
        }
    } else {
        return {
            message: "Something went wrong, check the request body.",
            code: 400
        };
    }
}

async function update(id, body) {
    if (!body.product_id || !body.quantity) {
        return {
            message: "Please provide all required information.",
            code: 400
        };
    }

    const query = await db.query(`UPDATE stock SET product_id=${body.product_id}, quantity=${body.quantity} WHERE id=${id}`);
    
    if (query.affectedRows) {
        return {
            message: `Stock updated with id #${id}.`,
            code: 200
        }
    } else {
        return {
            message: "Something went wrong, check the request body.",
            code: 400
        };
    }
}

async function remove(id) {
    const query = await db.query(`DELETE FROM stock WHERE id=${id}`);
    
    if (query.affectedRows) {
        return {
            message: `Stock deleted with id #${id}.`,
            code: 200
        }
    } else {
        return {
            message: "Something went wrong, check the request body.",
            code: 400
        };
    }
}

// ? ----- [ Export Module ] -----
module.exports = {
    getAll,
    getOne,
    create,
    update,
    remove
}