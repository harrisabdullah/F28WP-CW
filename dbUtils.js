const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, 'database', 'db.sqlite');
const seedPath = path.resolve(__dirname, 'database', 'seed.sql');

/**
 * Initializes the SQLite database by executing the seed SQL file.
 * Populates the Users, Hotels, and Bookings tables with sample data
 * if they are empty. Returns the database instance.
 *
 * @returns {sqlite3.Database} The initialized SQLite database object.
 */
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
                INSERT INTO Hotels (name, city, singleRoomPrice, twinRoomPrice, doubleRoomPrice, penthousePrice, starRating, image)
                VALUES
                ('Hotel Aurora', 'London', 120.0, 180.0, 220.0, 600.0, 5, 'aurora.jpg'),
                ('Seaside Inn', 'Brighton', 90.0, 140.0, 170.0, 500.0, 4, 'seaside.jpg'),
                ('Mountain Lodge', 'Inverness', 100.0, 160.0, 200.0, 300.0, 4, 'mountain.jpg'),
                ('City Central', 'Manchester', 80.0, 120.0, 150.0, 350.0, 3, 'central.jpg'),
                ('The Riverside', 'Cambridge', 110.0, 170.0, 210.0, 400.0, 5, 'riverside.jpg');
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
                INSERT INTO Bookings (user, hotel, startDate, endDate, singleCount, doubleCount, twinCount, penthouseCount)
                VALUES
                    (1, 1, '2025-01-05', '2025-01-10', 1, 1, 0, 0),
                    (2, 3, '2025-02-12', '2025-02-15', 0, 1, 2, 0),
                    (3, 2, '2025-03-01', '2025-03-05', 2, 0, 0, 0),
                    (4, 4, '2025-04-10', '2025-04-14', 0, 1, 0, 1),
                    (5, 5, '2025-05-20', '2025-05-25', 1, 1, 1, 0),
                    (6, 2, '2025-06-15', '2025-06-20', 0, 2, 1, 0),
                    (1, 2, '2025-07-05', '2025-07-10', 1, 0, 1, 1);
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

/**
 * Checks if a row exists in a given table with a specific field value.
 *
 * @param {sqlite3.Database} db - The SQLite database object.
 * @param {string} table - The table name to check.
 * @param {string} field - The field/column name to check.
 * @param {*} value - The value to search for in the field.
 * @returns {Promise<boolean>} A promise that resolves to true if the row exists, false otherwise.
 */
async function rowExists(db, table, field, value) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT 1 FROM ${table} WHERE ${field} = ? LIMIT 1`;

    db.get(sql, [value], (err, row) => {
      if (err) return reject(err);
      resolve(!!row);
    });
  });
}

async function getPrice(db, hotelID, single, double, twin, penthouse, duration) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT singleRoomPrice, twinRoomPrice, doubleRoomPrice, penthousePrice FROM Hotels WHERE hotelID = ?`;

    db.get(sql, [hotelID], (err, row) => {
      if (err) {
        console.error("Database error fetching prices:", err.message);
        return reject(new Error("Failed to fetch room prices."));
      }

      if (!row) {
        console.warn(`No prices found for hotel ID: ${hotelID}`);
        return resolve(0);
      }

      const singlePrice = row.singleRoomPrice || 0;
      const doublePrice = row.doubleRoomPrice || 0;
      const twinPrice = row.twinRoomPrice || 0;
      const penthousePrice = row.penthousePrice || 0;

      const subtotalPerDuration = (
        (single * singlePrice) +
        (double * doublePrice) +
        (twin * twinPrice) +
        (penthouse * penthousePrice)
      );

      const totalPrice = subtotalPerDuration * duration;
      console.log(totalPrice);
      resolve(totalPrice);
    });
  });
}

module.exports = { dbinit, rowExists, getPrice };
