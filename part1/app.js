var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql2/promise');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to database
// Insert records if not exists (for testing)
let db;

(async () => {
    try {
        // Connect to db
        db = await mysql.createConnection({
              host: 'localhost',
              user: 'root',
              password: '',
              database: 'DogWalkService'
        });

        // Insert data if not exist
        // for Users table
        const [user_rows] = await db.execute(`SELECT COUNT(*) AS user_count FROM Users`);
        if (user_rows[0].user_count === 0) {
            await db.execute(`
                INSERT INTO Users (username, email, password_hash, role) VALUES
                ('alice123', 'alice@example.com', 'hashed123', 'owner'),
                ('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
                ('carol123', 'carol@example.com', 'hashed789', 'owner'),
                ('dom', 'dom@example.com', 'hashed101', 'walker'),
                ('roger', 'roger@example.com', 'hashed200', 'walker');
            `);
        }

        // for Dogs table
        const [dog_rows] = await db.execute(`SELECT COUNT(*) AS dog_count FROM Dogs`)



    } catch (err) {
        console.error('Error setting up database. Ensure Mysql is running: service mysql start', err);
    }
})();

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
