var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api.js');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// // Connect to database
// // Insert records if not exists (for testing)
// let db;

// (async () => {
//     try {
//         // Connect to db
//         db = await mysql.createConnection({
//               host: 'localhost',
//               user: 'root',
//               password: '',
//               database: 'DogWalkService'
//         });

//         // Insert data if not exist
//         // for Users table
//         const [user_rows] = await db.execute(`SELECT COUNT(*) AS user_count FROM Users`);
//         if (user_rows[0].user_count === 0) {
//             await db.execute(`
//                 INSERT INTO Users (username, email, password_hash, role) VALUES
//                 ('alice123', 'alice@example.com', 'hashed123', 'owner'),
//                 ('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
//                 ('carol123', 'carol@example.com', 'hashed789', 'owner'),
//                 ('dom', 'dom@example.com', 'hashed101', 'walker'),
//                 ('roger', 'roger@example.com', 'hashed200', 'walker');
//             `);
//         }

//         // for Dogs table
//         const [dog_rows] = await db.execute(`SELECT COUNT(*) AS dog_count FROM Dogs`);
//         if (dog_rows[0].dog_count === 0) {
//             await db.execute(`
//                 INSERT INTO Dogs (owner_id, name, size) VALUES
//                 ((SELECT user_id FROM Users WHERE username = 'alice123'), 'Max', 'medium'),
//                 ((SELECT user_id FROM Users WHERE username = 'carol123'), 'Bella', 'small'),
//                 ((SELECT user_id FROM Users WHERE username = 'alice123'), 'Riley', 'large'),
//                 ((SELECT user_id FROM Users WHERE username = 'alice123'), 'Milo', 'small'),
//                 ((SELECT user_id FROM Users WHERE username = 'carol123'), 'Love', 'large');
//             `);
//         }

//         // for WalkRequests table
//         const [walk_request_rows] = await db.execute(`SELECT COUNT(*) AS wlkreq_count FROM WalkRequests`);
//         if (walk_request_rows[0].wlkreq === 0) {
//             await db.execute(`
//                 INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status) VALUES
//                 ((SELECT dog_id FROM Dogs WHERE name = 'Max' AND owner_id = (SELECT user_id FROM Users WHERE username = 'alice123')), '2025-06-10 08:00:00', 30, 'Parklands', 'open'),
//                 ((SELECT dog_id FROM Dogs WHERE name = 'Bella' AND owner_id = (SELECT user_id FROM Users WHERE username = 'carol123')), '2025-06-10 09:30:00', 45, 'Beachside Ave', 'accepted'),
//                 ((SELECT dog_id FROM Dogs WHERE name = 'Riley' AND owner_id = (SELECT user_id FROM Users WHERE username = 'alice123')), '2025-06-20 19:00:00', 60, 'Adelaide Uni', 'completed'),
//                 ((SELECT dog_id FROM Dogs WHERE name = 'Milo' AND owner_id = (SELECT user_id FROM Users WHERE username = 'alice123')), '2025-06-11 17:40:00', 40, 'Torrens River', 'open'),
//                 ((SELECT dog_id FROM Dogs WHERE name = 'Riley' AND owner_id = (SELECT user_id FROM Users WHERE username = 'alice123')), '2024-06-13 10:13:00', 50, 'Melbourne airport', 'cancelled');
//             `);
//         }
//     } catch (err) {
//         console.error('Error setting up database. Ensure Mysql is running: service mysql start', err);
//     }
// })();

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);

module.exports = app;
