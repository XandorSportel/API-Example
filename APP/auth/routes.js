// ? ----- [ Packages ] -----
const express = require('express');

// ? ----- [ Variables ] -----
const auth = require('./auth');
const { cLog, log } = require('../util/logger');
const router = express.Router();

router.all('*', function (req, res, next) {
    log(`[ Request - ${req.originalUrl} ] > Request Type - ${req.method} | Body - ${JSON.stringify(req.body)} | `);
    next();
})

// ? ----- [ Routes ] -----
router.post('/register', async function (req, res, next) {
    try {
        const data = await auth.register(req.body);
        res.status(data.code).json(data);
    } catch (err) {
        cLog(`Error while registering user >>> ${err.message}.`);
        next(err);
    }
})

router.post('/login', async function (req, res, next) {
    try {
        const data = await auth.login(req.body);
        res.status(data.code).json(data);
    } catch (err) {
        cLog(`Error while getting user >>> ${err.message}.`);
        next(err);
    }
});

// ? ----- [ Export Module ] -----
module.exports = router;