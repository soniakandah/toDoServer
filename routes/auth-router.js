'use strict';

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth-middleware.js');

router.post('/signin', auth, (req, res, next) => {
    console.log(req.user);

    res.send({
        token: req.token,
    });
});

router.post('/signup', auth, (req, res, next) => {
    console.log(req.user);

    res.send({ token: req.token });
});

module.exports = router;
