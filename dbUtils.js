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
                ('The Riverside', 'Cambridge', 110.0, 170.0, 210.0, 400.0, 5, 'riverside.jpg'),
                ('Grand Palace', 'London', 200.0, 300.0, 400.0, 1000.0, 5, 'palace.jpg'),
                ('Oceanview Hotel', 'Brighton', 95.0, 145.0, 180.0, 520.0, 4, 'oceanview.jpg'),
                ('Highland Retreat', 'Inverness', 105.0, 165.0, 210.0, 310.0, 4, 'highland.jpg'),
                ('Urban Stay', 'Manchester', 85.0, 125.0, 155.0, 360.0, 3, 'urban.jpg'),
                ('Riverbank Lodge', 'Cambridge', 115.0, 175.0, 215.0, 410.0, 5, 'riverbank.jpg'),
                ('Sunset Inn', 'London', 125.0, 185.0, 230.0, 620.0, 5, 'sunset.jpg'),
                ('Coastal Comfort', 'Brighton', 92.0, 142.0, 175.0, 510.0, 4, 'coastal.jpg'),
                ('Lochside Lodge', 'Inverness', 102.0, 162.0, 205.0, 305.0, 4, 'lochside.jpg'),
                ('Metro Hotel', 'Manchester', 88.0, 128.0, 158.0, 355.0, 3, 'metro.jpg'),
                ('Bridgeview Inn', 'Cambridge', 118.0, 178.0, 218.0, 415.0, 5, 'bridgeview.jpg'),
                ('Royal Garden', 'London', 210.0, 310.0, 420.0, 1020.0, 5, 'royal.jpg'),
                ('Pierpoint Hotel', 'Brighton', 97.0, 147.0, 182.0, 530.0, 4, 'pierpoint.jpg'),
                ('Snowcap Lodge', 'Inverness', 107.0, 167.0, 212.0, 312.0, 4, 'snowcap.jpg'),
                ('Citylights Hotel', 'Manchester', 90.0, 130.0, 160.0, 365.0, 3, 'citylights.jpg'),
                ('Cambridge Suites', 'Cambridge', 120.0, 180.0, 220.0, 420.0, 5, 'suites.jpg'),
                ('Majestic Inn', 'London', 130.0, 190.0, 240.0, 650.0, 5, 'majestic.jpg'),
                ('Brighton Bay', 'Brighton', 94.0, 144.0, 178.0, 515.0, 4, 'bay.jpg'),
                ('Highlands Haven', 'Inverness', 108.0, 168.0, 215.0, 315.0, 4, 'haven.jpg'),
                ('Downtown Lodge', 'Manchester', 92.0, 132.0, 162.0, 370.0, 3, 'downtown.jpg'),
                ('The Old Mill', 'Cambridge', 122.0, 182.0, 222.0, 425.0, 5, 'mill.jpg'),
                ('Empire Hotel', 'London', 215.0, 315.0, 430.0, 1030.0, 5, 'empire.jpg'),
                ('Seabreeze Inn', 'Brighton', 99.0, 149.0, 185.0, 540.0, 4, 'seabreeze.jpg'),
                ('Frostpeak Lodge', 'Inverness', 110.0, 170.0, 215.0, 320.0, 4, 'frostpeak.jpg'),
                ('Metro Suites', 'Manchester', 95.0, 135.0, 165.0, 375.0, 3, 'metrosuites.jpg'),
                ('Cambridge View', 'Cambridge', 125.0, 185.0, 225.0, 430.0, 5, 'view.jpg'),
                ('Crown Palace', 'London', 135.0, 195.0, 245.0, 670.0, 5, 'crown.jpg'),
                ('Brighton Retreat', 'Brighton', 100.0, 150.0, 190.0, 550.0, 4, 'retreat.jpg'),
                ('Highland Peaks', 'Inverness', 112.0, 172.0, 218.0, 325.0, 4, 'peaks.jpg'),
                ('City Hub Hotel', 'Manchester', 97.0, 137.0, 167.0, 380.0, 3, 'hub.jpg'),
                ('Riverside Suites', 'Cambridge', 128.0, 188.0, 228.0, 435.0, 5, 'suites2.jpg'),
                ('Imperial Inn', 'London', 220.0, 320.0, 440.0, 1050.0, 5, 'imperial.jpg'),
                ('Wavefront Hotel', 'Brighton', 102.0, 152.0, 192.0, 560.0, 4, 'wavefront.jpg'),
                ('Snowridge Lodge', 'Inverness', 115.0, 175.0, 220.0, 330.0, 4, 'snowridge.jpg'),
                ('Urban Retreat', 'Manchester', 100.0, 140.0, 170.0, 385.0, 3, 'urban2.jpg'),
                ('Bridgepoint Inn', 'Cambridge', 130.0, 190.0, 230.0, 440.0, 5, 'bridgepoint.jpg'),
                ('Royal Heights', 'London', 225.0, 325.0, 450.0, 1070.0, 5, 'heights.jpg'),
                ('Coastline Hotel', 'Brighton', 105.0, 155.0, 195.0, 570.0, 4, 'coastline.jpg'),
                ('Lochview Lodge', 'Inverness', 118.0, 178.0, 223.0, 335.0, 4, 'lochview.jpg'),
                ('Downtown Suites', 'Manchester', 102.0, 142.0, 172.0, 390.0, 3, 'downtown2.jpg'),
                ('Cambridge Palace', 'Cambridge', 132.0, 192.0, 232.0, 445.0, 5, 'palace2.jpg'),
                ('Regal Inn', 'London', 230.0, 330.0, 460.0, 1090.0, 5, 'regal.jpg'),
                ('Shoreline Inn', 'Brighton', 108.0, 158.0, 198.0, 580.0, 4, 'shoreline.jpg'),
                ('Highland Vista', 'Inverness', 120.0, 180.0, 225.0, 340.0, 4, 'vista.jpg'),
                ('City Center Hotel', 'Manchester', 105.0, 145.0, 175.0, 395.0, 3, 'center.jpg'),
                ('Riverfront Suites', 'Cambridge', 135.0, 195.0, 235.0, 450.0, 5, 'riverfront.jpg'),
                ('Palace View', 'London', 235.0, 335.0, 470.0, 1110.0, 5, 'palaceview.jpg'),
                ('Bayfront Hotel', 'Brighton', 110.0, 160.0, 200.0, 590.0, 4, 'bayfront.jpg'),
                ('Frostpeak Retreat', 'Inverness', 122.0, 182.0, 228.0, 345.0, 4, 'frostpeak2.jpg'),
                ('Urban Stay Suites', 'Manchester', 108.0, 148.0, 178.0, 400.0, 3, 'urban3.jpg'),
                ('Cambridge Heights', 'Cambridge', 138.0, 198.0, 238.0, 455.0, 5, 'heights2.jpg'),
                ('Majestic Palace', 'London', 240.0, 340.0, 480.0, 1130.0, 5, 'majestic2.jpg'),
                ('Seaside Retreat', 'Brighton', 112.0, 162.0, 202.0, 600.0, 4, 'seaside2.jpg'),
                ('Highland Lodge', 'Inverness', 125.0, 185.0, 230.0, 350.0, 4, 'highland2.jpg'),
                ('Metro Hub', 'Manchester', 110.0, 150.0, 180.0, 405.0, 3, 'metro2.jpg'),
                ('Cambridge Inn', 'Cambridge', 140.0, 200.0, 240.0, 460.0, 5, 'inn.jpg'),
                ('Crown Palace Suites', 'London', 245.0, 345.0, 490.0, 1150.0, 5, 'crown2.jpg'),
                ('Pierview Hotel', 'Brighton', 115.0, 165.0, 205.0, 610.0, 4, 'pierview.jpg'),
                ('Snowcap Retreat', 'Inverness', 128.0, 188.0, 233.0, 355.0, 4, 'snowcap2.jpg'),
                ('Downtown Palace', 'Manchester', 112.0, 152.0, 182.0, 410.0, 3, 'downtown3.jpg'),
                ('Riverside Palace', 'Cambridge', 142.0, 202.0, 242.0, 465.0, 5, 'riverside2.jpg'),
                ('Imperial Suites', 'London', 250.0, 350.0, 500.0, 1170.0, 5, 'imperial2.jpg'),
                ('Wavefront Inn', 'Brighton', 118.0, 168.0, 208.0, 620.0, 4, 'wavefront2.jpg'),
                ('Snowridge Retreat', 'Inverness', 130.0, 190.0, 235.0, 360.0, 4, 'snowridge2.jpg'),
                ('Urban Palace', 'Manchester', 115.0, 155.0, 185.0, 415.0, 3, 'urban4.jpg'),
                ('Bridgeview Suites', 'Cambridge', 145.0, 205.0, 245.0, 470.0, 5, 'bridgeview2.jpg'),
                ('Royal Palace', 'London', 255.0, 355.0, 510.0, 1190.0, 5, 'royal2.jpg'),
                ('Coastal Retreat', 'Brighton', 120.0, 170.0, 210.0, 630.0, 4, 'coastal2.jpg'),
                ('Lochside Retreat', 'Inverness', 132.0, 192.0, 238.0, 365.0, 4, 'lochside2.jpg'),
                ('City Hub Suites', 'Manchester', 118.0, 158.0, 188.0, 420.0, 3, 'hub2.jpg'),
                ('Cambridge Grand', 'Cambridge', 148.0, 208.0, 248.0, 475.0, 5, 'grand.jpg'),
                ('Empire Palace', 'London', 260.0, 360.0, 520.0, 1210.0, 5, 'empire2.jpg'),
                ('Seabreeze Retreat', 'Brighton', 122.0, 172.0, 212.0, 640.0, 4, 'seabreeze2.jpg'),
                ('Frostpeak Palace', 'Inverness', 135.0, 195.0, 240.0, 370.0, 4, 'frostpeak3.jpg'),
                ('Metro Grand', 'Manchester', 120.0, 160.0, 190.0, 425.0, 3, 'metro3.jpg'),
                ('Cambridge Tower', 'Cambridge', 150.0, 210.0, 250.0, 480.0, 5, 'tower.jpg'),
                ('Regal Palace', 'London', 265.0, 365.0, 530.0, 1230.0, 5, 'regal2.jpg'),
                ('Shoreline Retreat', 'Brighton', 125.0, 175.0, 215.0, 650.0, 4, 'shoreline2.jpg'),
                ('Highland Palace', 'Inverness', 138.0, 198.0, 243.0, 375.0, 4, 'highland3.jpg'),
                ('City Center Suites', 'Manchester', 122.0, 162.0, 192.0, 430.0, 3, 'center2.jpg'),
                ('Riverfront Palace', 'Cambridge', 152.0, 212.0, 252.0, 485.0, 5, 'riverfront2.jpg');
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
