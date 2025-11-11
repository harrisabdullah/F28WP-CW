const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, 'database', 'db.sqlite');
const db = new sqlite3.Database(dbPath);

const seedPath = path.resolve(__dirname, 'database', 'seed.sql');
const seedSQL = fs.readFileSync(seedPath, 'utf-8');

db.exec(seedSQL, (err) => {
    if (err) {
        console.error('Error initializing database', err);
        return;
    }

    db.get('SELECT COUNT(*) AS count FROM Hotels', (err, row) => {
        if (err) {
            console.error('Error checking Hotels table', err);
            return;
        }

        if (row.count === 0) {
            const insertSQL = `
                INSERT INTO Hotels (name, city, country, singleRoomPrice, twinRoomPrice, doubleRoomPrice, penthousePrice, starRating, image)
                VALUES
                ('Hotel Aurora', 'London', 'UK', 120.0, 180.0, 220.0, 600.0, 5, 'aurora.jpg'),
                ('Seaside Inn', 'Brighton', 'UK', 90.0, 140.0, 170.0, 500.0, 4, 'seaside.jpg'),
                ('Mountain Lodge', 'Inverness', 'UK', 100.0, 160.0, 200.0, 300.0, 4, 'mountain.jpg'),
                ('City Central', 'Manchester', 'UK', 80.0, 120.0, 150.0, 350.0, 3, 'central.jpg'),
                ('The Riverside', 'Cambridge', 'UK', 110.0, 170.0, 210.0, 400.0, 5, 'riverside.jpg');
            `;
            db.run(insertSQL, (err) => {
                if (err) console.error('Error inserting sample hotels', err);
                else console.log('Inserted sample hotel data.');
            });
        } else {
            console.log('Hotels table already populated.');
        }
    });
});

module.exports = db;
