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
        // Connect to mysql
        db = await mysql.createConnection({
              host: 'localhost',
              user: 'root',
              password: '',
              database: 'DogWalkService'
        });

        // Create tables if not exist
        await db.execute(`

        `);

    } catch (err) {
        console.error('Error setting up database. Ensure Mysql is running: service mysql start', err);
    }
})();

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
