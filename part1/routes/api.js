var express = require('express');
var router = express.Router();
var { init_db } = require('../db.js');

// api/dogs
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

// api/walkrequests/open
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

// api/walkers/summary
router.get('/walkers/summary', async (req, res) => {
    try {
        const db = await init_db();
        const [walkers] = await db.execute(`
            SELECT u.username AS walker_username,
            COUNT(rate.rating_id) AS total_ratings,
            ROUND(AVG(rate.rating), 1) AS average_rating,
            COUNT(rate.request_id) AS completed_walks
            FROM Users AS u
            LEFT JOIN WalkRatings AS rate ON rate.walker_id = u.user_id
            LEFT JOIN WalkRequests AS req ON req.request_id = rate.request_id AND req.status = 'completed'
            WHERE u.role = 'walker'
            GROUP BY u.user_id;
        `);
        res.json(walkers);
    } catch (err) {
        console.log('Error in api/walkers/summary: ', err);
        res.status(500).json({ error: 'Failed to fetch summary of walkers' });
    }
});

module.exports = router;

