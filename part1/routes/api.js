var express = require('express');
var router = express.Router();
var db = require('../db.js');

router.get('/dogs', async (req, res) => {
    try {
        const [dogs] = await db.execute(``)
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch dogs' });
    }
});

module.exports = router;

