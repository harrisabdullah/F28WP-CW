const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, 'database', 'db.sqlite');
const db = new sqlite3.Database(dbPath);

const seedPath = path.resolve(__dirname, 'database', 'seed.sql');
const seedSQL = fs.readFileSync(seedPath, 'utf-8');

db.exec(seedSQL, (err) => {
    if (err) console.error('Error initializing database', err);
});

module.exports = db;

