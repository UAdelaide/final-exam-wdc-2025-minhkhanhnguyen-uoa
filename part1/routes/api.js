var express = require('express');
var router = express.Router();
var db = require('../db.js');

router.get('/dogs', async (req, res) => {
    try {

    } catch (err) {
        res.status(500).json
    }
});

module.exports = router;

