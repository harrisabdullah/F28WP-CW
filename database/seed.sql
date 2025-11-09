CREATE TABLE IF NOT EXISTS Users (
    userID INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT
);

CREATE TABLE IF NOT EXISTS Hotels (
    hotelID INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    city TEXT,
    country TEXT,
    singleRoomPrice REAL,
    twinRoomPrice REAL,
    doubleRoomPrice REAL,
    starRating int
);

CREATE TABLE IF NOT EXISTS Bookings (
    user INTEGER REFERENCES Users(id),
    hotel INTEGER REFERENCES Hotels(id),
    startDate DATE,
    endDate DATE,
    roomType TEXT
);

