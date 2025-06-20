var express = require('express');
var router = express.Router();

module.exports = (db) => {
    router.get('/dogs', async (req, res) => {
        try {
            const [rows]
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch dogs' });
        }
    });

    return router;
};

