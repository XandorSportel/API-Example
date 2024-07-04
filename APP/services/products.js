// ? ----- [ Packages ] ------
const moment = require('moment');
moment.locale('nl');

// ? ----- [ Variables ] -----
const db = require('../services/db');
const helper = require('../util/helper');

// ? ----- [ Functions ] -----
async function getAll() {
    const query = await db.query(`SELECT * FROM products ORDER BY type DESC`);
    const data = helper.emptyOrRows(query);

    if (data.length == 0) {
        return {
            message: "No products found.",
            code: 404
        };
    } else {
        return {
            message: "Products found.",
            code: 200,
            numberOfProducts: data.length,
            data
        };
    }
};

async function getOne(id) {
    const query = await db.query(`SELECT * FROM products WHERE id=${id}`);
    const data = helper.emptyOrRows(query);

    if (data.length == 0) {
        return {
            message: "No product found.",
            code: 404
        };
    } else {
        return {
            message: "Product found.",
            code: 200,
            data
        };
    }
};

async function search(searchQuery) {
    const query = await db.query(`SELECT * FROM products WHERE type="${searchQuery.toLowerCase()}"`);
    const data = helper.emptyOrRows(query);

    if (data.length == 0) {
        return {
            message: "No products founds.",
            code: 404
        };
    } else {
        return {
            message: "Products found.",
            code: 200,
            data
        };
    };
};

async function random(amount) {
    const query = await db.query(`SELECT * FROM products ORDER BY RAND() LIMIT ${amount}`);
    const data = helper.emptyOrRows(query);

    if (data.length == 0) {
        return {
            message: "No products found.",
            code: 404
        };
    } else {
        return {
            message: "Products found.",
            code: 200,
            data
        };
    };
};

async function create(reqBody) {
    if (!reqBody.name || !reqBody.brand || !reqBody.description || !reqBody.type || !reqBody.price ||  !reqBody.hidden || !reqBody.release_date) {
        return {
            message: "Please provide all required information.",
            code: 400
        };
    }

    // Format release_date
    reqBody.release_date = moment(reqBody.release_date).format('YYYY-MM-DD');

    const query = await db.query(`INSERT INTO products (name, brand, description, type, price, hidden, release_date, creation_date) VALUES ("${reqBody.name}", "${reqBody.brand}", "${reqBody.description}", "${reqBody.type}", "${reqBody.price}", "${reqBody.hidden}", "${reqBody.release_date}", "${moment().format('YYYY-MM-DD HH:mm:ss')}")`);
    const query2 = await db.query(`INSERT INTO stock (product_id, quantity) VALUES ("${query.insertId}", "0")`)

    if (query.affectedRows) {
        return {
            message: `Product created with id #${query.insertId}.`,
            productId: query.insertId,
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
    if (!body.name || !body.brand || !body.description || !body.type || !body.price || !body.img || !body.hidden || !body.release_date) {
        return {
            message: "Please provide all required information.",
            code: 400
        };
    }

    const query = await db.query(`UPDATE products SET name="${body.name}", brand="${body.brand}", description="${body.description}", type="${body.type}", price="${body.price}", img="${body.img}", hidden="${body.hidden}", release_date="${body.release_date}" WHERE id=${id}`);
    
    if (query.affectedRows) {
        return {
            message: `Product updated with id #${id}.`,
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
    const query = await db.query(`DELETE FROM products WHERE id=${id}`);
    const query2 = await db.query(`DELETE FROM stock WHERE product_id=${id}`)

    if (query.affectedRows) {
        return {
            message: `Product deleted with id #${id}.`,
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
    search,
    random,
    create,
    update,
    remove
}