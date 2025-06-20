var express = require('express');
var router = express.Router();
var { init_db } = require('../db.js');

router.get('/dogs', async (req, res) => {
    try {
        const db = await init_db();
        const [dogs] = await db.execute(`SELECT * FROM Dogs`);
        res.json(dogs);
    } catch (err) {
        console.error('Error in /api/dogs:', err);
        res.status(500).json({ error: 'Failed to fetch dogs' });
    }
});

module.exports = router;

