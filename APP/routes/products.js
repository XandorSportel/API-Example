// ? ----- [ Packages ] -----
const express = require('express');

// ? ----- [ Variables ] -----
const products = require('../services/products');
const auth = require('../middleware/auth');
const router = express.Router();
const { log } = require('../util/logger');

// ? ----- [ Routes ] -----
router.all('*', function (req, res, next) {
    log(`[ Request - ${req.originalUrl} ] > Request Type - ${req.method} | Body - ${JSON.stringify(req.body)} | `);
    next();
})

router.get('/all', async function (req, res, next) {
    try {
        const data = await products.getAll();
        res.status(data.code).json(data);
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async function (req, res, next) {
    try {
        const data = await products.getOne(req.params.id);
        res.status(data.code).json(data);
    } catch (err) {
        next(err);
    }
});

router.get('/search/:query', async function (req, res, next) {
    try {
        const data = await products.search(req.params.query);
        res.status(data.code).json(data);
    } catch (err) {
        next(err);
    }
});

router.get('/random/:amount', async function (req, res, next) {
    try {
        const data = await products.random(req.params.amount);
        res.status(data.code).json(data);
    } catch (err) {
        next(err);
    }
});

router.post('/', auth, async function (req, res, next) {
    try {
        const data = await products.create(req.body);
        res.status(data.code).json(data);
    } catch (err) {
        next(err);
    }
});

router.put('/:id', auth, async function (req, res, next) {
    try {
        const data = await products.update(req.params.id, req.body);
        res.status(data.code).json(data);
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', auth, async function (req, res, next) {
    try {
        const data = await products.remove(req.params.id);
        res.status(data.code).json(data);
    } catch (err) {
        next(err);
    }
});

// ? ----- [ Export Module ] -----
module.exports = router;