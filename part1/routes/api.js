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

router.get('/walkrequests/open', async (req, res) => {
    try {
        const db = await init_db();
        const [open_wlkreq] = await db.execute(`
            SELECT r.request_id, d.name AS dog_name, r.requested_time, r.duration_minutes, r.location, u.username AS owner_username
            FROM WalkRequests AS r
            JOIN Dogs AS d ON d.dog_id = r.dog_id
            JOIN Users AS u ON u.user_id = d.owner_id
            WHERE r.status = 'open';
        `);
        res.json(open_wlkreq);
    } catch (err) {
        console.log('Error in api/walkrequests/open: ', err);
        res.status(500).json({ error: 'Failed to fetch open walk requests' });
    }
});

router.get('/walkers/summary', async (req, res) => {
    try {
        const db = await init_db();
        const [walkers] = await db.execute(`
            SELECT u.username AS walker_username,
            (SELECT COUNT(*) FROM WalkRatings AS wr JOIN Users AS u ON u.user_id = wr.walker_id WHERE u.username = walker_username)
        `);
    } catch (err) {
        console.log('Error in api/walkers/summary: ', err);
        res.status(500).json({ error: 'Failed to fetch summary of walkers' });
    }
});

module.exports = router;

