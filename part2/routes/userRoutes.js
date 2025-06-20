const express = require('express');
const router = express.Router();
const db = require('../models/db');
const { signedCookie } = require('cookie-parser');

// GET all users (for admin/testing)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT user_id, username, email, role FROM Users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST a new user (simple signup)
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const [result] = await db.query(`
      INSERT INTO Users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `, [username, email, password, role]);

    res.status(201).json({ message: 'User registered', user_id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  res.json(req.session.user);
});

// POST login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.query(`
      SELECT user_id, username, role FROM Users
      WHERE username = ? AND password_hash = ?
    `, [username, password]);

    // No user found
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Save login to session
    const user = rows[0];
    req.session.user = {
      user_id: user.user_id,
      username: user.username,
      role: user.role
    };

    res.json({ message: 'Login successful', user_info: user });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// POST logout
router.post('/logout', async (req, res) => {
  req.session.destroy((err) => {
    // If failed
    if (err) {
      console.log('Logout error: ', err);
      return res.status(500).json({ error: 'Failed to log out' });
    }

    // Clear session
    res.clearCookie('connect.sid');
    res.json({ message: 'Log out successfully' });
  });
});

// GET dogs of a specific owner
router.get('/dogs', async (req, res) => {
  // Check for valid user session
  if (!req.session.user) {
    return res.status(401).json({ error: "Not logged in" });
  }

  // Query dog from db
  try {
    const owner_id = req.session.user.user_id;
    const [rows] = await db.query(`
      SELECT name FROM Dogs WHERE owner_id = ?
    `, [owner_id]);

    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch dogs" });
  }
});

// GET all the dogs
router.get('/dogs', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT * FROM Dogs;
    `);
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch dogs" });
  }
});

module.exports = router;
