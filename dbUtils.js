const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, 'database', 'db.sqlite');
const seedPath = path.resolve(__dirname, 'database', 'seed.sql');

function dbinit(){
    const db = new sqlite3.Database(dbPath);
    const seedSQL = fs.readFileSync(seedPath, 'utf-8');

    db.exec(seedSQL, (err) => {
        if (err) {
            console.error('Error initializing database', err);
            return;
        }

    db.get('SELECT COUNT(*) AS count FROM Users', (err, row) => {
        if (err) {
            console.error('Error checking Users table', err);
            return;
        }

        if (row.count === 0) {
            const insertUsers = `
                INSERT INTO Users (username, password) VALUES
                ('alice', 'password123'),
                ('bob', 'securepass'),
                ('charlie', 'mypassword'),
                ('diana', 'qwerty123'),
                ('edward', 'letmein');
            `;
            db.run(insertUsers, (err) => {
                if (err) console.error('Error inserting sample users', err);
                else console.log('Inserted sample user data.');
            });
        } else {
            console.log('Users table already populated.');
        }
    });

    db.get('SELECT COUNT(*) AS count FROM Hotels', (err, row) => {
        if (err) {
            console.error('Error checking Hotels table', err);
            return;
        }

        if (row.count === 0) {
            const insertHotels = `
                INSERT INTO Hotels (name, city, country, singleRoomPrice, twinRoomPrice, doubleRoomPrice, penthousePrice, starRating, image)
                VALUES
                ('Hotel Aurora', 'London', 'UK', 120.0, 180.0, 220.0, 600.0, 5, 'aurora.jpg'),
                ('Seaside Inn', 'Brighton', 'UK', 90.0, 140.0, 170.0, 500.0, 4, 'seaside.jpg'),
                ('Mountain Lodge', 'Inverness', 'UK', 100.0, 160.0, 200.0, 300.0, 4, 'mountain.jpg'),
                ('City Central', 'Manchester', 'UK', 80.0, 120.0, 150.0, 350.0, 3, 'central.jpg'),
                ('The Riverside', 'Cambridge', 'UK', 110.0, 170.0, 210.0, 400.0, 5, 'riverside.jpg');
            `;
            db.run(insertHotels, (err) => {
                if (err) console.error('Error inserting sample hotels', err);
                else console.log('Inserted sample hotel data.');
            });
        } else {
            console.log('Hotels table already populated.');
        }
    });

    db.get('SELECT COUNT(*) AS count FROM Bookings', (err, row) => {
        if (err) {
            console.error('Error checking Bookings table', err);
            return;
        }

        if (row.count === 0) {
            const insertBookings = `
                INSERT INTO Bookings (user, hotel, startDate, endDate, roomType)
                VALUES
                (1, 1, '2025-01-05', '2025-01-10', 'Double'),
                (2, 3, '2025-02-12', '2025-02-15', 'Twin'),
                (3, 2, '2025-03-01', '2025-03-05', 'Single'),
                (4, 4, '2025-04-10', '2025-04-14', 'Penthouse'),
                (5, 5, '2025-05-20', '2025-05-25', 'Double');
            `;
            db.run(insertBookings, (err) => {
                if (err) console.error('Error inserting sample bookings', err);
                else console.log('Inserted sample booking data.');
            });
        } else {
            console.log('Bookings table already populated.');
        }
    });
    });

    return db;
}

module.export = { dbinit };
